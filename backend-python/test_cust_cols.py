import app

conn = app.get_db_connection()
cursor = conn.cursor()
cursor.execute("SELECT TOP 1 * FROM Customers")
cols = [column[0] for column in cursor.description]
print("Columns in Customers table:")
for col in cols:
    print(col)
