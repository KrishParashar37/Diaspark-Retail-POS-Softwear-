import os

route_code = """
# CUSTOMER RANKING REPORT
# ════════════════════════════════════════

@app.route('/api/reports/customer-ranking', methods=['GET'])
def customer_ranking_report():
    try:
        req_date = request.args.get('date')
        report_format = request.args.get('reportFormat', 'Customer Ranking MTD')
        top_limit = int(request.args.get('top', 25))

        if not req_date:
            req_date = datetime.now().strftime('%Y-%m-%d')
            
        dt_obj = datetime.strptime(req_date, '%Y-%m-%d')

        if 'MTD' in report_format:
            start_date = dt_obj.replace(day=1).strftime('%Y-%m-%d')
            end_date = req_date
        else:
            # YTD
            start_date = dt_obj.replace(month=1, day=1).strftime('%Y-%m-%d')
            end_date = req_date

        conn = get_db_connection()
        cursor = conn.cursor()

        query = f\"\"\"
            SELECT TOP {top_limit} 
                customer_code,
                SUM(net_amt) as TotalSales
            FROM pos_invoices
            WHERE CAST(trans_date as DATE) >= ? AND CAST(trans_date as DATE) <= ?
            GROUP BY customer_code
            ORDER BY TotalSales DESC
        \"\"\"
        
        cursor.execute(query, [start_date, end_date])
        data = []
        rank = 1
        for row in cursor.fetchall():
            c_code = row[0] if row[0] else 'Unknown'
            total_sales = float(row[1]) if row[1] else 0.0
            
            data.append({
                'Rank': rank,
                'CustomerCode': c_code,
                'TotalSales': round(total_sales, 2)
            })
            rank += 1

        conn.close()
        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        print("Error in customer_ranking_report:", str(e))
        return jsonify({'status': 'error', 'message': str(e)}), 500
"""

with open('app.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

main_idx = -1
for i, line in enumerate(lines):
    if line.strip() == 'if __name__ == "__main__":':
        main_idx = i
        break

if main_idx != -1:
    if "def customer_ranking_report():" not in "".join(lines):
        new_lines = lines[:main_idx] + [route_code, '\n'] + lines[main_idx:]
        with open('app.py', 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print("Added customer_ranking_report to app.py")
    else:
        print("customer_ranking_report already exists")
else:
    print("Main block not found in app.py")
