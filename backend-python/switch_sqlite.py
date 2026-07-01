import re
import os

file_path = 'c:/Users/test/Desktop/DIASPARK UI/backend-python/app.py'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace get_db_connection
content = re.sub(r'def get_db_connection\(\):.*?return pyodbc\.connect\(conn_str\)',
'''def get_db_connection():
    return sqlite3.connect('pos.db')''', content, flags=re.DOTALL)

# Replace get_table_schema
content = re.sub(r'def get_table_schema\(cursor, table_name\):.*?return schema',
'''def get_table_schema(cursor, table_name):
    if not hasattr(get_table_schema, 'cache'):
        get_table_schema.cache = {}
    if table_name in get_table_schema.cache:
        return get_table_schema.cache[table_name]
    cursor.execute(f"PRAGMA table_info({table_name})")
    schema = {row[1]: (row[2], None) for row in cursor.fetchall()}
    get_table_schema.cache[table_name] = schema
    return schema''', content, flags=re.DOTALL)

# Replace OUTPUT inserted.id in execute_dynamic_insert
content = content.replace(
'''    if table_name == 'pos_invoices':
        query = f"INSERT INTO {table_name} ({cols_str}) OUTPUT inserted.id VALUES ({pl_str})"
        cursor.execute(query, tuple(values))
        return cursor.fetchone()[0]''',
'''    if table_name == 'pos_invoices':
        query = f"INSERT INTO {table_name} ({cols_str}) VALUES ({pl_str})"
        cursor.execute(query, tuple(values))
        return cursor.lastrowid''')

# Replace other OUTPUT inserted.id instances (like in pos_orders)
content = re.sub(
r'(\s*INSERT INTO pos_orders.*?)OUTPUT inserted\.id(\s*VALUES\s*\([^)]+\)\s*""",\s*\([^)]+\)\s*\)\s*)order_id\s*=\s*cursor\.fetchone\(\)\[0\]',
r'\1\2order_id = cursor.lastrowid',
content, flags=re.DOTALL | re.IGNORECASE)

# Replace CONVERT(varchar, ..., 101) with strftime('%m/%d/%Y', ...)
content = re.sub(r"CONVERT\(varchar,\s*([a-zA-Z0-9_.]+),\s*101\)", r"strftime('%m/%d/%Y', \1)", content, flags=re.IGNORECASE)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement done.")
