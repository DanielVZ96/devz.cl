#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28,<0.29"]
# ///
"""Offline API-contract and month-update checks."""
from datetime import date, timedelta
import unittest

import httpx
import update_stats as stats


class StatsTests(unittest.TestCase):
    def test_month_boundaries(self):
        self.assertEqual(stats.month_bounds('2024-02', date(2024, 3, 1)),
                         (date(2024, 2, 1), date(2024, 3, 1)))
        for month in ('2024-2', '2024-13', '2024-03'):
            with self.assertRaises(ValueError):
                stats.month_bounds(month, date(2024, 3, 1))

    def test_merge_replaces_and_preserves_history(self):
        old = {'months': [{'month': '2024-01', 'plausible': {'visitors': 7}},
                          {'month': '2024-02', 'plausible': {'visitors': 8}}]}
        report = {'month': '2024-02', 'plausible': {'visitors': 0}}
        result = stats.merge(old, report, date(2024, 3, 1))
        self.assertEqual(result['months'], [report, old['months'][0]])
        self.assertEqual(result['updated_at'], '2024-03-01')
        self.assertEqual(old['months'][1]['plausible']['visitors'], 8)

    def fetch(self, incomplete=False, errors=False):
        start, end = date(2024, 2, 1), date(2024, 3, 1)
        def handler(request):
            import json
            payload = json.loads(request.content)
            if request.url.host == 'plausible.io':
                self.assertTrue(payload['date_range'][0].endswith('T00:00:00Z'))
                self.assertTrue(payload['date_range'][1].endswith('T23:59:59Z'))
                if payload.get('dimensions'):
                    dimension = '/' if payload['dimensions'] == ['event:page'] else 'Google'
                    return httpx.Response(200, json={'results': [{'metrics': [0, 2, 3], 'dimensions': [dimension]}]})
                return httpx.Response(200, json={'results': [{'metrics': [0, 2, 3]}]})
            if 'account' in payload['variables']:
                row = {'count': 8, 'sum': {'visits': 5}, 'avg': {'sampleInterval': 1}}
                return httpx.Response(200, json={'data': {'viewer': {'accounts': [{
                    'total': [row], 'paths': [{**row, 'dimensions': {'requestPath': '/'}}],
                    'sources': [{**row, 'dimensions': {'refererHost': 'google.com'}}]
                }]}}})
            self.assertEqual(payload['variables']['end'], '2024-03-01')
            if errors:
                return httpx.Response(200, json={'errors': [{'message': 'denied'}]})
            rows = [{'dimensions': {'date': str(start + timedelta(days=i))},
                     'sum': {'requests': 10, 'cachedRequests': 4, 'bytes': 100}}
                    for i in range(28 if incomplete else 29)]
            return httpx.Response(200, json={'data': {'viewer': {'zones': [{'httpRequests1dGroups': rows}]}}})
        with httpx.Client(transport=httpx.MockTransport(handler)) as client:
            return stats.fetch(client, start, end, {'PLAUSIBLE_API_KEY': 'fake', 'CLOUDFLARE_API_TOKEN': 'fake', 'CLOUDFLARE_ZONE_ID': 'fake', 'CLOUDFLARE_ACCOUNT_ID': 'fake'})

    def test_api_mapping_and_daily_totals(self):
        report = self.fetch()
        self.assertEqual(report['plausible']['pageviews'], 3)
        self.assertEqual(report['plausible']['paths'][0]['path'], '/')
        self.assertEqual(report['plausible']['sources'][0]['source'], 'Google')
        self.assertEqual(report['cloudflare_web']['visits'], 5)
        self.assertEqual(report['days'][0]['cloudflare_web']['sources'][0]['source'], 'google.com')
        self.assertEqual(report['cloudflare'], {'requests': 290, 'cached_requests': 116, 'bandwidth_bytes': 2900})
        self.assertEqual(len(report['days']), 29)
        self.assertEqual(report['days'][0]['date'], '2024-02-01')
        self.assertEqual(report['days'][-1]['date'], '2024-02-29')
        self.assertEqual(report['days'][0]['plausible']['visitors'], 0)
        self.assertEqual(report['days'][0]['cloudflare']['requests'], 10)

    def test_partial_coverage_and_graphql_errors_fail(self):
        with self.assertRaisesRegex(ValueError, 'incomplete'):
            self.fetch(incomplete=True)
        with self.assertRaisesRegex(ValueError, 'GraphQL'):
            self.fetch(errors=True)

    def test_web_analytics_access_error_fails(self):
        with httpx.Client(transport=httpx.MockTransport(lambda request: httpx.Response(
            200, json={'errors': [{'message': 'not authorized'}]}))) as client:
            with self.assertRaisesRegex(ValueError, 'Account Analytics Read'):
                stats.web_query(client, date(2024, 2, 1), date(2024, 3, 1),
                                {'CLOUDFLARE_API_TOKEN': 'fake', 'CLOUDFLARE_ACCOUNT_ID': 'fake'})

    def test_plausible_breakdown_paginates(self):
        import json
        offsets = []
        def handler(request):
            payload = json.loads(request.content)
            offset = payload['pagination']['offset']
            offsets.append(offset)
            rows = [{'dimensions': [f'/page-{offset + i}'], 'metrics': [1, 1, 1]}
                    for i in range(1000 if offset == 0 else 1)]
            return httpx.Response(200, json={'results': rows})
        with httpx.Client(transport=httpx.MockTransport(handler)) as client:
            rows = stats.plausible_query(client, date(2024, 2, 1), date(2024, 3, 1),
                                         {'PLAUSIBLE_API_KEY': 'fake'}, 'event:page')
        self.assertEqual(offsets, [0, 1000])
        self.assertEqual(len(rows), 1001)
        self.assertEqual(rows[-1]['path'], '/page-1000')


if __name__ == '__main__':
    unittest.main()
