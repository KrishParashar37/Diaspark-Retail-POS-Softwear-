import pyodbc

conn_str = (
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)

def check_recent_sales():
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        print("\n--- RECENTLY SAVED SALES IN DATABASE ---")
        
        # Get the 5 most recent sales from pos_invoices
        cursor.execute('''
            SELECT TOP 5 id, customer_id, salesperson_code, net_amt, paid_amt, trans_date 
            FROM pos_invoices 
            ORDER BY id DESC
        ''')
        
        rows = cursor.fetchall()
        if not rows:
            print("No sales found in the database.")
        else:
            for row in rows:
                print(f"Transaction ID: {row.id} | Date: {row.trans_date} | Salesperson: {row.salesperson_code} | Total: ${row.net_amt} | Paid: ${row.paid_amt}")
                
        print("----------------------------------------\n")
        conn.close()
        
    except Exception as e:
        print("Error connecting to database:", e)

if __name__ == "__main__":
    check_recent_sales()
