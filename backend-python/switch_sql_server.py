import re
import os

file_path = 'c:/Users/test/Desktop/DIASPARK UI/backend-python/app.py'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace get_db_connection
content = re.sub(r'def get_db_connection\(\):.*?return sqlite3\.connect\([^\)]+\)',
'''def get_db_connection():
    # Connect to SQL Server
    conn_str = (
        "Driver={SQL Server Native Client 11.0};"
        "Server=DBSRV2025;"
        "Database=POSDB;"
        "UID=retail;"
        "PWD=retail@1234;"
    )
    return pyodbc.connect(conn_str)''', content, flags=re.DOTALL)

# Replace get_table_schema
content = re.sub(r'def get_table_schema\(cursor, table_name\):.*?return schema',
'''def get_table_schema(cursor, table_name):
    if not hasattr(get_table_schema, 'cache'):
        get_table_schema.cache = {}
    if table_name in get_table_schema.cache:
        return get_table_schema.cache[table_name]
    cursor.execute(f"SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='{table_name}'")
    schema = {row[0]: (row[1], row[2]) for row in cursor.fetchall()}
    get_table_schema.cache[table_name] = schema
    return schema''', content, flags=re.DOTALL)

# Replace execute_dynamic_insert lastrowid
content = content.replace(
'''    if table_name == 'pos_invoices':
        query = f"INSERT INTO {table_name} ({cols_str}) VALUES ({pl_str})"
        cursor.execute(query, tuple(values))
        return cursor.lastrowid''',
'''    if table_name == 'pos_invoices':
        query = f"INSERT INTO {table_name} ({cols_str}) OUTPUT inserted.id VALUES ({pl_str})"
        cursor.execute(query, tuple(values))
        return cursor.fetchone()[0]''')

# Replace other cursor.lastrowid instances (like in pos_orders)
content = re.sub(
r'(\s*INSERT INTO pos_orders.*?\))(\s*VALUES\s*\([^)]+\)\s*""",\s*\([^)]+\)\s*\)\s*)order_id\s*=\s*cursor\.lastrowid',
r'\1\n            OUTPUT inserted.id\2order_id = cursor.fetchone()[0]',
content, flags=re.DOTALL | re.IGNORECASE)

# Replace strftime('%m/%d/%Y', ...) with CONVERT(varchar, ..., 101)
content = re.sub(r"strftime\('%m/%d/%Y',\s*([a-zA-Z0-9_.]+)\)", r"CONVERT(varchar, \1, 101)", content, flags=re.IGNORECASE)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SQL Server configuration restored.")
