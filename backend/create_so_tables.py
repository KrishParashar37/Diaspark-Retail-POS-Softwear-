from database import engine
from sqlalchemy import text

conn = engine.connect()

conn.execute(text("""
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pos_special_orders' AND xtype='U')
CREATE TABLE pos_special_orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    invoice_id INT NULL,
    trans_no VARCHAR(50) NULL,
    sku VARCHAR(100),
    serial VARCHAR(100),
    description NVARCHAR(MAX),
    price DECIMAL(18,2),
    qty INT,
    category VARCHAR(100),
    metal_type VARCHAR(100),
    metal_color VARCHAR(100),
    purity VARCHAR(100),
    finish VARCHAR(100),
    ring_size VARCHAR(50),
    status VARCHAR(100),
    vendor VARCHAR(100),
    special_instructions NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE()
)
"""))

conn.execute(text("""
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='pos_special_order_components' AND xtype='U')
CREATE TABLE pos_special_order_components (
    id INT IDENTITY(1,1) PRIMARY KEY,
    special_order_id INT,
    component_type VARCHAR(50), 
    component_desc VARCHAR(200),
    qty INT,
    price DECIMAL(18,2),
    total_price DECIMAL(18,2)
)
"""))

conn.commit()
print('Tables created')
conn.close()
