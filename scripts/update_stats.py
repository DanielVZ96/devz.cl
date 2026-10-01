#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28,<0.29"]
# ///
"""Fetch a completed UTC month and atomically update the public stats JSON."""

import argparse
import calendar
from datetime import UTC, date, datetime, timedelta
import json
import os
from pathlib import Path
import re
import sys
import tempfile

import httpx

OUTPUT = Path(__file__).resolve().parents[1] / "static/data/stats.json"
QUERY = """
query MonthlyStats($zone: string, $start: Date, $end: Date) {
  viewer {
    zones(filter: {zoneTag: $zone}) {
      httpRequests1dGroups(limit: 31, orderBy: [date_ASC],
        filter: {date_geq: $start, date_lt: $end}) {
        dimensions { date }
        sum { requests cachedRequests bytes }
      }
    }
  }
}
"""


def count(value):
    if type(value) is not int or value < 0:
        raise ValueError("API returned an invalid count")
    return value


def month_bounds(month, today):
    if not re.fullmatch(r"\d{4}-\d{2}", month):
        raise ValueError("Month must be YYYY-MM")
    start = date.fromisoformat(month + "-01")
    end = start + timedelta(days=calendar.monthrange(start.year, start.month)[1])
    if end > today:
        raise ValueError("Choose a completed month")
    return start, end


def post(client, url, token, payload, provider):
    try:
        response = client.post(url, headers={"Authorization": f"Bearer {token}"}, json=payload)
    except httpx.HTTPError:
        raise ValueError(f"{provider}: network request failed") from None
    if not response.is_success:
        raise ValueError(f"{provider}: HTTP {response.status_code}; check credentials and API access")
    result = response.json()
    if not isinstance(result, dict):
        raise ValueError(f"{provider}: unexpected response")
    return result



def plausible_query(client, start, end, env, dimension=None):
    keys = ("visitors", "visits", "pageviews")
    base = env.get("PLAUSIBLE_BASE_URL", "https://plausible.io").rstrip("/")
    payload = {"site_id": env.get("PLAUSIBLE_SITE_ID", "devz.cl"),
               "metrics": list(keys),
               "date_range": [f"{start}T00:00:00Z", f"{end - timedelta(days=1)}T23:59:59Z"]}
    if dimension:
        payload["dimensions"] = [dimension]
        payload["pagination"] = {"limit": 1000, "offset": 0}
    results = []
    while True:
        rows = post(client, base + "/api/v2/query", env["PLAUSIBLE_API_KEY"], payload, "Plausible")["results"]
        for row in rows:
            if len(row["metrics"]) != len(keys):
                raise ValueError("Plausible: invalid metric response")
            item = dict(zip(keys, map(count, row["metrics"])))
            if dimension:
                if len(row["dimensions"]) != 1 or not isinstance(row["dimensions"][0], str):
                    raise ValueError("Plausible: invalid dimension response")
                item["path" if dimension == "event:page" else "source"] = row["dimensions"][0]
            results.append(item)
        if not dimension:
            if len(results) != 1:
                raise ValueError("Plausible: expected one aggregate row")
            return results[0]
        if len(rows) < 1000:
            return results
        payload["pagination"]["offset"] += 1000


def plausible_report(client, start, end, env):
    return {**plausible_query(client, start, end, env),
            "paths": plausible_query(client, start, end, env, "event:page"),
            "sources": plausible_query(client, start, end, env, "visit:source")}


def web_query(client, start, end, env):
    # Fields verified against Cloudflare's live GraphQL schema.
    filters = {"datetime_geq": f"{start}T00:00:00Z", "datetime_lt": f"{end}T00:00:00Z",
               "requestHost": env.get("CLOUDFLARE_WEB_HOST", "devz.cl"), "bot": 0}
    if env.get("CLOUDFLARE_SITE_TAG"):
        filters["siteTag"] = env["CLOUDFLARE_SITE_TAG"]
    query = """
    query WebStats($account: string, $filter: AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject) {
      viewer { accounts(filter: {accountTag: $account}) {
        total: rumPageloadEventsAdaptiveGroups(limit: 1, filter: $filter) {
          count sum { visits } avg { sampleInterval }
        }
        paths: rumPageloadEventsAdaptiveGroups(limit: 10000, filter: $filter, orderBy: [count_DESC]) {
          count sum { visits } dimensions { requestPath } avg { sampleInterval }
        }
        sources: rumPageloadEventsAdaptiveGroups(limit: 10000, filter: $filter, orderBy: [count_DESC]) {
          count sum { visits } dimensions { refererHost } avg { sampleInterval }
        }
      }}
    }
    """
    result = post(client, "https://api.cloudflare.com/client/v4/graphql", env["CLOUDFLARE_API_TOKEN"],
                  {"query": query, "variables": {"account": env["CLOUDFLARE_ACCOUNT_ID"], "filter": filters}}, "Cloudflare Web Analytics")
    if result.get("errors"):
        raise ValueError("Cloudflare Web Analytics: query failed; check Account Analytics Read permission and retention")
    accounts = result["data"]["viewer"]["accounts"]
    if len(accounts) != 1:
        raise ValueError("Cloudflare Web Analytics: account not accessible")
    data = accounts[0]
    def metrics(row):
        return {"pageviews": count(row["count"]), "visits": count(row["sum"]["visits"]),
                "sample_interval": row["avg"]["sampleInterval"]}
    totals = data["total"]
    if len(totals) > 1:
        raise ValueError("Cloudflare Web Analytics: invalid aggregate response")
    report = metrics(totals[0]) if totals else {"pageviews": 0, "visits": 0, "sample_interval": None}
    for label, dimension, key in (("paths", "requestPath", "path"), ("sources", "refererHost", "source")):
        if len(data[label]) >= 10000:
            raise ValueError("Cloudflare Web Analytics: breakdown hit 10000 rows; refusing truncated data")
        report[label] = [{key: row["dimensions"][dimension], **metrics(row)} for row in data[label]]
    return report


def fetch(client, start, end, env):
    plausible_counts = plausible_report(client, start, end, env)
    plausible_days = {}
    web_days = {}
    web_counts = web_query(client, start, end, env)
    # Explicit daily UTC ranges avoid time:day's site reporting timezone.
    for offset in range((end - start).days):
        day = start + timedelta(days=offset)
        plausible_days[str(day)] = plausible_report(client, day, day + timedelta(days=1), env)
        web_days[str(day)] = web_query(client, day, day + timedelta(days=1), env)
    cloudflare = post(client, "https://api.cloudflare.com/client/v4/graphql", env["CLOUDFLARE_API_TOKEN"], {
        "query": QUERY,
        "variables": {"zone": env["CLOUDFLARE_ZONE_ID"], "start": str(start), "end": str(end)},
    }, "Cloudflare")
    if cloudflare.get("errors"):
        raise ValueError("Cloudflare: GraphQL query failed; check Zone Analytics Read permission, dataset access and retention")
    zones = cloudflare["data"]["viewer"]["zones"]
    if len(zones) != 1:
        raise ValueError("Cloudflare: zone not accessible")
    days = zones[0]["httpRequests1dGroups"]
    expected = {str(start + timedelta(days=i)) for i in range((end - start).days)}
    actual = [row["dimensions"]["date"] for row in days]
    if set(actual) != expected or len(actual) != len(expected):
        raise ValueError("Cloudflare: incomplete daily coverage; refusing to publish a partial month (check retention)")
    cf_counts = {target: sum(count(row["sum"][source]) for row in days)
                 for source, target in (("requests", "requests"), ("cachedRequests", "cached_requests"), ("bytes", "bandwidth_bytes"))}
    daily = [{"date": row["dimensions"]["date"],
              "plausible": plausible_days[row["dimensions"]["date"]],
              "cloudflare_web": web_days[row["dimensions"]["date"]],
              "cloudflare": {target: count(row["sum"][source]) for source, target in
                             (("requests", "requests"), ("cachedRequests", "cached_requests"), ("bytes", "bandwidth_bytes"))}}
             for row in sorted(days, key=lambda row: row["dimensions"]["date"])]
    return {"month": start.strftime("%Y-%m"), "plausible": plausible_counts,
            "cloudflare": cf_counts, "cloudflare_web": web_counts, "days": daily}


def merge(document, report, today):
    if not isinstance(document, dict) or not isinstance(document.get("months"), list):
        raise ValueError("Existing file must contain a months array")
    months = document["months"]
    seen = set()
    for entry in months:
        month_bounds(entry["month"], today)
        if entry["month"] in seen:
            raise ValueError("Existing file has duplicate months")
        seen.add(entry["month"])
    return {**document, "updated_at": str(today), "months": sorted(
        [entry for entry in months if entry["month"] != report["month"]] + [report],
        key=lambda entry: entry["month"], reverse=True)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--month", help="YYYY-MM; defaults to previous completed UTC month")
    parser.add_argument("--output", type=Path, default=OUTPUT)
    parser.add_argument("--dry-run", action="store_true", help="Fetch and print the merged JSON without writing")
    args = parser.parse_args()
    today = datetime.now(UTC).date()
    month = args.month or (today.replace(day=1) - timedelta(days=1)).strftime("%Y-%m")
    try:
        start, end = month_bounds(month, today)
        missing = [name for name in ("PLAUSIBLE_API_KEY", "CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_ID", "CLOUDFLARE_ACCOUNT_ID") if not os.environ.get(name)]
        if missing:
            raise ValueError("Set environment variables: " + ", ".join(missing))
        document = json.loads(args.output.read_text()) if args.output.exists() else {"months": []}
        # Validate the existing document before making API requests.
        merge(document, {"month": month}, today)
        with httpx.Client(timeout=60) as client:
            report = fetch(client, start, end, os.environ)
        text = json.dumps(merge(document, report, today), indent=2) + "\n"
        if args.dry_run:
            print(text, end="")
            return
        args.output.parent.mkdir(parents=True, exist_ok=True)
        temporary = None
        try:
            with tempfile.NamedTemporaryFile(mode="w", dir=args.output.parent, delete=False) as handle:
                temporary = Path(handle.name)
                handle.write(text)
            temporary.chmod(0o644)
            temporary.replace(args.output)
        finally:
            if temporary is not None:
                temporary.unlink(missing_ok=True)
        print(f"Updated {args.output} for {month}")
    except (ValueError, KeyError, TypeError, IndexError, OSError) as error:
        # Avoid printing raw API responses, which may include sensitive data.
        message = str(error) if isinstance(error, ValueError) and not isinstance(error, json.JSONDecodeError) else "Invalid file/API response or file access failure"
        print(f"Error: {message}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
