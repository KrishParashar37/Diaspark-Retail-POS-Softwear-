import sqlite3

def convert_to_mssql():
    conn = sqlite3.connect('pos.db')
    cursor = conn.cursor()

    tables = ['Customers', 'Vendors', 'StoneCodes', 'Transactions', 'TransactionItems', 'Orders']
    
    with open('mssql_database.sql', 'w', encoding='utf-8') as f:
        # Schema definition
        f.write("-- MS SQL Server Database Export\n\n")

        f.write('''CREATE TABLE Customers (
    customerId INT IDENTITY(1,1) PRIMARY KEY,
    firstName NVARCHAR(MAX),
    lastName NVARCHAR(MAX),
    email NVARCHAR(MAX),
    mobile NVARCHAR(MAX),
    city NVARCHAR(MAX),
    stateName NVARCHAR(MAX),
    zipCode NVARCHAR(MAX),
    addressLine NVARCHAR(MAX)
);\nGO\n\n''')

        f.write('''CREATE TABLE Vendors (
    code NVARCHAR(50) PRIMARY KEY,
    name NVARCHAR(MAX),
    phone NVARCHAR(MAX),
    city NVARCHAR(MAX),
    state NVARCHAR(MAX),
    zip NVARCHAR(MAX),
    email NVARCHAR(MAX)
);\nGO\n\n''')

        f.write('''CREATE TABLE StoneCodes (
    code NVARCHAR(50) PRIMARY KEY,
    stoneType NVARCHAR(MAX),
    color NVARCHAR(MAX)
);\nGO\n\n''')

        f.write('''CREATE TABLE Transactions (
    transactionId INT IDENTITY(1,1) PRIMARY KEY,
    customerId INT,
    salesperson NVARCHAR(MAX),
    totalAmount FLOAT,
    status NVARCHAR(MAX),
    createdAt DATETIME DEFAULT GETDATE()
);\nGO\n\n''')

        f.write('''CREATE TABLE TransactionItems (
    itemId INT IDENTITY(1,1) PRIMARY KEY,
    transactionId INT,
    sku NVARCHAR(MAX),
    description NVARCHAR(MAX),
    quantity INT,
    price FLOAT,
    FOREIGN KEY(transactionId) REFERENCES Transactions(transactionId)
);\nGO\n\n''')

        f.write('''CREATE TABLE Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    orderType NVARCHAR(MAX),
    special NVARCHAR(MAX),
    lastName NVARCHAR(MAX),
    firstName NVARCHAR(MAX),
    orderDate NVARCHAR(MAX),
    estYear NVARCHAR(MAX),
    shipDate NVARCHAR(MAX),
    cf NVARCHAR(MAX),
    ack NVARCHAR(MAX),
    esti NVARCHAR(MAX),
    po NVARCHAR(MAX),
    cnt NVARCHAR(MAX),
    rec NVARCHAR(MAX),
    st NVARCHAR(MAX),
    co NVARCHAR(MAX),
    salesPerson NVARCHAR(MAX),
    rush NVARCHAR(MAX),
    workbag NVARCHAR(MAX),
    currentStage NVARCHAR(MAX),
    stageDueDate NVARCHAR(MAX),
    vendor NVARCHAR(MAX),
    customerConfi NVARCHAR(MAX),
    item NVARCHAR(MAX),
    name NVARCHAR(MAX),
    saleDescription NVARCHAR(MAX)
);\nGO\n\n''')

        # Insert statements
        for table in tables:
            cursor.execute(f"SELECT * FROM {table}")
            rows = cursor.fetchall()
            
            # Get column names
            col_names = [description[0] for description in cursor.description]
            
            if rows:
                if 'id' in col_names or 'customerId' in col_names or 'transactionId' in col_names or 'itemId' in col_names:
                    # Determine identity column if present (assuming first column for these)
                    f.write(f"SET IDENTITY_INSERT {table} ON;\nGO\n")
                
                for row in rows:
                    values = []
                    for val in row:
                        if val is None:
                            values.append("NULL")
                        elif isinstance(val, (int, float)):
                            values.append(str(val))
                        else:
                            val_str = str(val).replace("'", "''")
                            values.append(f"N'{val_str}'")
                    
                    insert_stmt = f"INSERT INTO {table} ({', '.join(col_names)}) VALUES ({', '.join(values)});\n"
                    f.write(insert_stmt)
                
                f.write("GO\n")
                
                if 'id' in col_names or 'customerId' in col_names or 'transactionId' in col_names or 'itemId' in col_names:
                    f.write(f"SET IDENTITY_INSERT {table} OFF;\nGO\n\n")
                else:
                    f.write("\n")

    conn.close()
    print("Successfully generated mssql_database.sql")

if __name__ == '__main__':
    convert_to_mssql()
