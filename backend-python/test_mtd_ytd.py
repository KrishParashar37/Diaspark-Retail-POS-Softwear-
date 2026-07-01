import urllib.request
import json

def fetch_data(url):
    req = urllib.request.Request(url)
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read().decode('utf-8'))
    return data['data']

mtd_url = 'http://localhost:5001/api/reports/split-sales-summary?reportType=Sales%20Person&startDate=2026-06-01&endDate=2026-06-30'
ytd_url = 'http://localhost:5001/api/reports/split-sales-summary?reportType=Sales%20Person&startDate=2026-01-01&endDate=2026-12-31'

mtd_data = fetch_data(mtd_url)
ytd_data = fetch_data(ytd_url)

print(f"MTD Data Rows: {len(mtd_data)}")
if len(mtd_data) > 0:
    print(f"MTD Total: {sum(x['NetSales'] for x in mtd_data)}")

print(f"YTD Data Rows: {len(ytd_data)}")
if len(ytd_data) > 0:
    print(f"YTD Total: {sum(x['NetSales'] for x in ytd_data)}")

