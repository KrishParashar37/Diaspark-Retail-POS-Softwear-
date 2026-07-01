import sqlite3

conn = sqlite3.connect('pos.db')
cursor = conn.cursor()

# Appraisals table
cursor.execute('''
CREATE TABLE IF NOT EXISTS Appraisals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId TEXT,
    appraisalNo TEXT,
    date TEXT,
    salesperson TEXT,
    retailValue REAL,
    image TEXT
)
''')

# Receivables table
cursor.execute('''
CREATE TABLE IF NOT EXISTS Receivables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId TEXT,
    storeNo TEXT,
    transBk TEXT,
    transNo TEXT,
    transDate TEXT,
    dueDate TEXT,
    rewardType TEXT,
    netAmt REAL,
    balanceAmt REAL,
    description TEXT
)
''')

# Wishlists table
cursor.execute('''
CREATE TABLE IF NOT EXISTS Wishlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId TEXT,
    image TEXT,
    date TEXT,
    description TEXT,
    salesperson TEXT,
    retailPrice REAL,
    storeInvn TEXT,
    otherStoreInvn TEXT,
    interestLevel TEXT
)
''')

# Repairs table
cursor.execute('''
CREATE TABLE IF NOT EXISTS Repairs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId TEXT,
    image TEXT,
    transactionNo TEXT,
    dueDate TEXT,
    description TEXT,
    salesperson TEXT,
    repairCharge REAL,
    orderStatus TEXT,
    approved BOOLEAN
)
''')

# FamilyMembers table
cursor.execute('''
CREATE TABLE IF NOT EXISTS FamilyMembers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId TEXT,
    firstName TEXT,
    lastName TEXT,
    birthDate TEXT,
    anniversary TEXT,
    significantOtherName TEXT,
    significantOtherBirthDate TEXT,
    phone TEXT,
    email TEXT
)
''')

# FamilyTransactions table
cursor.execute('''
CREATE TABLE IF NOT EXISTS FamilyTransactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId TEXT,
    image TEXT,
    transactionNo TEXT,
    description TEXT,
    salesperson TEXT,
    qty INTEGER,
    price REAL,
    extPrice REAL
)
''')

# GiftCards table
cursor.execute('''
CREATE TABLE IF NOT EXISTS GiftCards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId TEXT,
    giftCardNo TEXT,
    value REAL,
    balanceAmt REAL,
    chargeValue REAL,
    status TEXT
)
''')

# GiftCertificates table
cursor.execute('''
CREATE TABLE IF NOT EXISTS GiftCertificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId TEXT,
    certificateNo TEXT,
    value REAL,
    expiryDate TEXT,
    remarks TEXT,
    status TEXT
)
''')

# Purchases view or table mock
# Let's use TransactionItems joined with Transactions if possible, but for simplicity, we can create a Purchases table for the view mock
cursor.execute('''
CREATE TABLE IF NOT EXISTS Purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerId TEXT,
    image TEXT,
    storeNo TEXT,
    transNo TEXT,
    date TEXT,
    type TEXT,
    category TEXT,
    department TEXT,
    brand TEXT,
    styleSku TEXT,
    serialNo TEXT,
    description TEXT,
    salesperson TEXT,
    qty INTEGER,
    price REAL,
    taxAmt REAL,
    discount REAL,
    extPrice REAL
)
''')

# Insert some mock data for customer ID DANB-00001
cursor.execute('DELETE FROM Purchases WHERE customerId="DANB-00001"')
cursor.execute('''
INSERT INTO Purchases (customerId, storeNo, transNo, date, type, category, department, brand, styleSku, serialNo, description, salesperson, qty, price, taxAmt, discount, extPrice)
VALUES 
('DANB-00001', 'Edison', '203256', '12/24/2023', 'Jewelr', 'BANGLE', 'BG', 'Tristar', 'DBAN-1049', 'DBG-275176', '18K W Bangle Dia Wt. 3.25 ct', 'CARLOS', 1, 48525.00, 0.00, 0.00, 48525.00),
('DANB-00001', 'Edison', '203237', '12/17/2023', 'Jewelr', 'BRACELET', 'BR', 'AARTA Ltd', 'DBR-1130', 'DBR-2473919', '18K W G Dia Ladies bracelet', 'CARLOS', 1, 98000.00, 0.00, 0.00, 98000.00)
''')

conn.commit()
conn.close()
print("Tables and mock data created successfully.")
