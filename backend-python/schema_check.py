import pyodbc

conn_str = (
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)

try:
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    tables = ['pos_orders', 'pos_order', 'pos_order_lines', 'pos_order_payments']
    
    for tbl in tables:
        print(f"--- Schema for {tbl} ---")
        try:
            cursor.execute(f"SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='{tbl}'")
            rows = cursor.fetchall()
            if not rows:
                print("Table not found or no columns.")
            for r in rows:
                print(f"{r[0]} ({r[1]})")
        except Exception as ex:
            print(ex)
        print("\n")
        
except Exception as e:
    print(e)
