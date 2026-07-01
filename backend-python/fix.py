import sys

file_path = r'c:\Users\test\Desktop\DIASPARK UI\backend-python\app.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '''def get_table_schema(cursor, table_name):
    if not hasattr(get_table_schema, 'cache'):
        get_table_schema.cache = {}
    if table_name in get_table_schema.cache:
        return get_table_schema.cache[table_name]
    cursor.execute(f"SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='{table_name}'")
    schema = {row[0]: row[1] for row in cursor.fetchall()}
    get_table_schema.cache[table_name] = schema
    return schema

def execute_dynamic_insert(cursor, table_name, data, trans_date):
    schema = get_table_schema(cursor, table_name)
    columns = []
    values = []
    placeholders = []
    for col, dtype in schema.items():
        if col in ['id', 'created_at', 'updated_at']:
            continue
        columns.append(col)
        placeholders.append('?')
        if col in data:
            values.append(data[col])
        else:
            if dtype in ['int', 'decimal', 'numeric', 'float']:
                values.append(0)
            elif dtype in ['datetime', 'date']:
                values.append(trans_date)
            else:
                values.append('')
    cols_str = ', '.join(columns)
    pl_str = ', '.join(placeholders)
    
    if table_name == 'pos_invoices':
        query = f"INSERT INTO {table_name} ({cols_str}) OUTPUT inserted.id VALUES ({pl_str})"
        cursor.execute(query, tuple(values))
        return cursor.fetchone()[0]
    else:
        query = f"INSERT INTO {table_name} ({cols_str}) VALUES ({pl_str})"
        cursor.execute(query, tuple(values))'''

replacement = '''def get_table_schema(cursor, table_name):
    if not hasattr(get_table_schema, 'cache'):
        get_table_schema.cache = {}
    if table_name in get_table_schema.cache:
        return get_table_schema.cache[table_name]
    cursor.execute(f"SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='{table_name}'")
    schema = {row[0]: (row[1], row[2]) for row in cursor.fetchall()}
    get_table_schema.cache[table_name] = schema
    return schema

def execute_dynamic_insert(cursor, table_name, data, trans_date):
    schema = get_table_schema(cursor, table_name)
    columns = []
    values = []
    placeholders = []
    for col, (dtype, max_len) in schema.items():
        if col in ['id', 'created_at', 'updated_at']:
            continue
        columns.append(col)
        placeholders.append('?')
        
        if col in data:
            val = data[col]
        else:
            if dtype in ['int', 'decimal', 'numeric', 'float']:
                val = 0
            elif dtype in ['datetime', 'date']:
                val = trans_date
            else:
                val = ''
                
        # Truncate string if needed
        if isinstance(val, str) and max_len and max_len > 0:
            val = val[:max_len]
            
        values.append(val)
        
    cols_str = ', '.join(columns)
    pl_str = ', '.join(placeholders)
    
    if table_name == 'pos_invoices':
        query = f"INSERT INTO {table_name} ({cols_str}) OUTPUT inserted.id VALUES ({pl_str})"
        cursor.execute(query, tuple(values))
        return cursor.fetchone()[0]
    else:
        query = f"INSERT INTO {table_name} ({cols_str}) VALUES ({pl_str})"
        cursor.execute(query, tuple(values))'''

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS')
else:
    print('TARGET NOT FOUND')
