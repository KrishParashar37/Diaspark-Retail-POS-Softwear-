import pyodbc

conn_str = (
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

cursor.execute("SELECT customerId, firstName, lastName FROM customers WHERE firstName = 'Arjun'")
print("Arjun Kumar:", cursor.fetchall())

cursor.execute("SELECT customer_id, SUM(net_amt) FROM pos_invoices GROUP BY customer_id")
print("\nTop 5 customers with sales:")
for row in cursor.fetchmany(5):
    print(row)
