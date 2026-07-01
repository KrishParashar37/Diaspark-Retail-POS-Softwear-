import pyodbc
from datetime import datetime

conn = pyodbc.connect('Driver={SQL Server Native Client 11.0};Server=DBSRV2025;Database=POSDB;UID=retail;PWD=retail@1234;')
cursor = conn.cursor()

def get_table_schema(cursor, table_name):
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
        cursor.execute(query, tuple(values))

trans_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

invoice_data = {
    'company_id': 1, 'history_flag': 'N', 'qb_flag': 'N',
    'customer_id': 1, 'salesperson_code': 'test', 'cashier_code': 'test',
    'item_amt': 100.0, 'tax_per': 0.0, 'tax_amt': 0.0, 'net_amt': 100.0, 'paid_amt': 100.0, 'balance_amt': 0.0,
    'sales_category': 'test', 'trans_date': trans_date, 'department': 'POS',
    'item_qty': 1, 'trans_type': 'S', 'sales_status': 'C',
    'created_by': 1, 'updated_by': 1, 'update_flag': 'Y', 'trans_flag': 'Y', 'lock_version': 0
}

tid = execute_dynamic_insert(cursor, 'pos_invoices', invoice_data, trans_date)
print(f"Inserted ID: {tid}")
conn.rollback()
print("Success")
