# devz.cl

A tiny static website built with [Hugo](https://gohugo.io/) and the `nostyleplease` Hugo theme.

## Development

Install the extended Hugo binary, then run:

```sh
hugo server --buildDrafts
```

Build the production site with:

```sh
hugo --minify
```

## Monthly stats

Run the self-contained script with [uv](https://docs.astral.sh/uv/) installed;
its shebang and inline dependency header handle Python and dependencies:

```sh
export PLAUSIBLE_API_KEY='your-stats-api-key'
export CLOUDFLARE_API_TOKEN='your-api-token'
export CLOUDFLARE_ZONE_ID='your-zone-id'
export CLOUDFLARE_ACCOUNT_ID='your-account-id'
./scripts/update_stats.py
```

The default is the previous completed month. To fetch a specific month or
preview the result without changing the file:

```sh
./scripts/update_stats.py --month 2026-09 --dry-run
./scripts/update_stats.py --month 2026-09
```

Optional environment variables: `PLAUSIBLE_SITE_ID` (default `devz.cl`) and
`PLAUSIBLE_BASE_URL` (default `https://plausible.io`, for self-hosted instances).
`--output PATH` selects a different JSON file. Credentials are read only from
the environment. Existing reports are retained; rerunning a month replaces
that month's report. Both providers must succeed before the file is replaced.

The script uses UTC calendar months for both APIs, including explicit UTC
timestamps for Plausible. Cloudflare totals cover the entire zone, including
other proxied hostnames in that zone, using `httpRequests1dGroups`. Use a token
with Zone Analytics Read permission for the selected zone. Dataset access and
retention depend on your Cloudflare plan; the script requires a daily row for
every day and refuses incomplete coverage, including absent zero-traffic days.
Run shortly after a month ends while the full month is still available.
Plausible requires Stats API access for the selected site/team.

API references: [Plausible Stats API](https://plausible.io/docs/stats-api) and
[Cloudflare GraphQL Analytics](https://developers.cloudflare.com/analytics/graphql-api/).

`/stats/` reads `static/data/stats.json` during the Hugo build. Generate this
file at the end of each month, commit it, and rebuild/deploy the site. The same
file is published at `/data/stats.json`. No API credentials belong in this file.

Use this shape (the numbers below are illustrative, not real site traffic):

```json
{
  "updated_at": "2026-10-01",
  "months": [
    {
      "month": "2026-09",
      "plausible": { "visitors": 120, "visits": 160, "pageviews": 240 },
      "cloudflare": {
        "requests": 1200,
        "cached_requests": 900,
        "bandwidth_bytes": 52428800
      },
      "days": [
        {
          "date": "2026-09-01",
          "plausible": { "visitors": 4, "visits": 5, "pageviews": 8 },
          "cloudflare": {
            "requests": 40,
            "cached_requests": 30,
            "bandwidth_bytes": 1747627
          }
        }
      ]
    }
  ]
}
```

The `days` array contains one entry for every day of the month, oldest first
(only one day is shown in the example). Each day groups both providers under
an ISO `date`. `/stats/` renders daily pageview and request graphs plus a table
of all six metrics. Old monthly reports without `days` still display totals;
rerun the script for those months to add daily data.

Monthly Plausible totals come from a separate aggregate query: daily unique
visitors must not be summed to get monthly unique visitors. The script makes
one Plausible query for the month and one for each UTC day, plus one Cloudflare
query. Explicit daily ranges avoid grouping by Plausible's reporting timezone.

### Paths, traffic sources and Cloudflare Web Analytics

Monthly and daily `plausible` reports include `paths` (grouped by `event:page`)
and `sources` (grouped by `visit:source`), each with visitors, visits and
pageviews. Plausible path/source results are paginated. Unique visitors across
paths or days overlap and must not be summed into a site-wide visitor count.

The separate `cloudflare_web` report contains browser `visits`, `pageviews`,
`sample_interval`, `paths` and `sources`, both monthly and inside each day.
It queries `rumPageloadEventsAdaptiveGroups`, excluding detected bots, with
`requestPath` and `refererHost` breakdowns. Cloudflare's schema defines visits
as pageviews initiated from a different website, not unique visitors. Blank
source values appear as Direct / unknown. Plausible source attribution and
Cloudflare referring host attribution are kept separate.

Web Analytics requires `CLOUDFLARE_ACCOUNT_ID` and Account Analytics Read
permission on the token, in addition to Zone Analytics Read for edge data.
`CLOUDFLARE_WEB_HOST` defaults to `devz.cl`; optional `CLOUDFLARE_SITE_TAG`
restricts the Web Analytics property further. Neither changes the existing
zone-wide edge metrics. Find the account ID on the domain Overview page and
the optional site tag in the Web Analytics beacon snippet. The export fails
without changing the file if Web Analytics access fails. Cloudflare
breakdowns refuse 10,000-row results to avoid silent truncation.

The exporter now makes three Plausible queries per reporting period (totals,
paths and sources), plus extra pagination requests when needed. It also
makes one Web Analytics query per period, alongside the zone edge query.
This supersedes the earlier request-count description. Cloudflare uses
adaptive sampling; returned estimates and sample intervals are preserved.

References: [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/about/)
and [Cloudflare sampling](https://developers.cloudflare.com/web-analytics/faq/).

Keep one entry per completed calendar month (`YYYY-MM`), retaining previous
entries. Reports display newest first. Use the same calendar boundaries and
timezone for both exports. Counts must be nonnegative integers; use `null` or
omit a metric when unavailable (zero means a measured zero). `updated_at` is
the publication date (`YYYY-MM-DD`), or `null` before the first report.
Normalize API results to these fields in your monthly generator; the page
does not call either API. Only publish aggregate data intended to be public.
