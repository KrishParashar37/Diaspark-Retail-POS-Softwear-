import sys
sys.path.append('c:/Users/test/Desktop/DIASPARK UI/backend')
from database import engine
from sqlalchemy import text

conn = engine.connect()

sql_script = """
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pos_orders' AND xtype='U')
CREATE TABLE pos_orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_no VARCHAR(50),
    customer_id INT,
    salesperson_code VARCHAR(100),
    item_amt DECIMAL(18,2) DEFAULT 0,
    tax_amt DECIMAL(18,2) DEFAULT 0,
    net_amt DECIMAL(18,2) DEFAULT 0,
    paid_amt DECIMAL(18,2) DEFAULT 0,
    balance_amt DECIMAL(18,2) DEFAULT 0,
    order_date DATETIME DEFAULT GETDATE(),
    order_status VARCHAR(50) DEFAULT 'Pending',
    special_instructions NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE()
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pos_order_lines' AND xtype='U')
CREATE TABLE pos_order_lines (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT FOREIGN KEY REFERENCES pos_orders(id),
    sku VARCHAR(100),
    serial_no VARCHAR(100),
    item_description NVARCHAR(MAX),
    item_qty INT DEFAULT 1,
    item_price DECIMAL(18,2) DEFAULT 0,
    subtotal DECIMAL(18,2) DEFAULT 0,
    category VARCHAR(100),
    metal_type VARCHAR(100),
    metal_color VARCHAR(100),
    purity VARCHAR(50),
    finish VARCHAR(50),
    ring_size VARCHAR(50),
    vendor VARCHAR(100)
);

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pos_order_payments' AND xtype='U')
CREATE TABLE pos_order_payments (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT FOREIGN KEY REFERENCES pos_orders(id),
    payment_type VARCHAR(100),
    payment_amt DECIMAL(18,2) DEFAULT 0,
    payment_date DATETIME DEFAULT GETDATE(),
    credit_card_last_four VARCHAR(20),
    auth_code VARCHAR(100)
);
"""

conn.execute(text(sql_script))
conn.commit()
print("Tables created successfully!")
