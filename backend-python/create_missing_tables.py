import pyodbc
import sys

conn_str = (
    "Driver={SQL Server Native Client 11.0};"
    "Server=DBSRV2025;"
    "Database=POSDB;"
    "UID=retail;"
    "PWD=retail@1234;"
)

def create_and_seed_tables():
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        # 1. Labor Table
        print("Creating Labor table...")
        cursor.execute("""
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Labor' and xtype='U')
            CREATE TABLE Labor (
                laborNum VARCHAR(50) PRIMARY KEY,
                description VARCHAR(255),
                price DECIMAL(10, 2)
            )
        """)
        
        # Clear existing data if any (for idempotency)
        cursor.execute("DELETE FROM Labor")
        
        labor_data = [
            ('EN', 'Engraving', 0.00),
            ('JR', 'Jewelry Repair', 0.00),
            ('JRP', 'Jewelry Repair Parts', 0.00),
            ('RS', 'Restringing', 0.00),
            ('RS0110KT', 'Less than 3.0mm smaller', 39.00),
            ('RS0114KT', 'Less than 3.0mm smaller', 39.00),
            ('RS02', 'Less than 3.0mm smaller', 45.00),
            ('RS03', 'Less than 3.0mm smaller', 68.00),
            ('RS04', 'Less than 3.0mm smaller', 39.00),
            ('RS0510KT', 'Less than 3.0mm 1st si', 63.00),
            ('RS0514KT', 'Less than 3.0mm 1st si', 63.00),
            ('RS06', 'Less than 3.0mm 1st si', 77.00),
        ]
        cursor.executemany("INSERT INTO Labor (laborNum, description, price) VALUES (?, ?, ?)", labor_data)

        # 2. DiamondStones Table
        print("Creating DiamondStones table...")
        cursor.execute("""
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DiamondStones' and xtype='U')
            CREATE TABLE DiamondStones (
                sku VARCHAR(50) PRIMARY KEY,
                lot VARCHAR(50),
                name VARCHAR(255),
                stone VARCHAR(50),
                type VARCHAR(50),
                shape VARCHAR(50),
                shade VARCHAR(50),
                size VARCHAR(50),
                clarity VARCHAR(50),
                color VARCHAR(50),
                pcs VARCHAR(10),
                wt VARCHAR(50),
                price VARCHAR(50),
                cert VARCHAR(50),
                ownership VARCHAR(50),
                remarks VARCHAR(255),
                orderNum VARCHAR(50),
                loc VARCHAR(50)
            )
        """)
        cursor.execute("DELETE FROM DiamondStones")
        
        ds_data = [
            ('D-100009-P', 'D-100009', 'DIAM 4.0 Ct OVL B VS1', '', 'DIAM', 'OVL', '', '8', 'VS1', 'B', '1', '0.000', '3,250.00', '', 'Owned', '', '', 'RECV'),
            ('D-100011-P', 'D-100011', 'DIAM 2 Ct CHN F SI1 B', '', 'DIAM', 'CHN', '', '4', 'SI1', 'F', '1', '0.000', '3,750.00', '', 'Owned', '', '', 'RECV'),
            ('D-100013-P', 'D-100013', 'DIAM 2.5 Ct EMD K VS2', '', 'DIAM', 'EMD', '', '5', 'VS2', 'K', '1', '0.000', '4,250.00', '', 'Owned', '', '', 'SHIP'),
            ('D-100014-P', 'D-100014', 'DIAM 2.7 Ct BAG B SIO', '', 'DIAM', 'BAG', '', '5.5', 'SIO', 'B', '1', '2.750', '4,500.00', '', 'Memo', '', '', 'RECV'),
            ('D-100016-P', 'D-100016', 'DIAM 3.2 Ct CHN F IF E', '', 'DIAM', 'CHN', '', '6.5', 'IF', 'F', '1', '0.000', '5,000.00', '', 'Owned', '', '', 'RECV'),
            ('D-100017-P', 'D-100017', 'DIAM 3.5 Ct OVL G VS1', '', 'DIAM', 'OVL', '', '7', 'VS1', 'G', '1', '0.000', '5,250.00', '', 'Owned', '', '', 'RECV'),
            ('D-100019-P', 'D-100019', 'DIAM 4.0 Ct CHN B SI1', '', 'DIAM', 'CHN', '', '8', 'SI1', 'B', '1', '0.000', '5,750.00', '', 'Owned', '', '', 'RECV'),
            ('D-100026-P', 'D-100026', 'DIAM 3.5 Ct RDI F SI2', '', 'DIAM', 'RDI', '', '6.5', 'SI2', 'F', '1', '0.000', '7,500.00', '', 'Owned', '', '', 'RECV'),
            ('D-100028-P', 'D-100028', 'DIAM 4.0 Ct HRT K VS1', '', 'DIAM', 'HRT', '', '7.5', 'VS1', 'K', '1', '0.000', '8,000.00', '', 'Owned', '', '', 'RECV'),
            ('D-100029-P', 'D-100029', 'DIAM 4.3 Ct EMD B SI2', '', 'DIAM', 'EMD', '', '8', 'SI2', 'B', '1', '0.000', '8,250.00', '', 'Owned', '', '', 'RECV'),
        ]
        cursor.executemany("INSERT INTO DiamondStones (sku, lot, name, stone, type, shape, shade, size, clarity, color, pcs, wt, price, cert, ownership, remarks, orderNum, loc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", ds_data)

        # 3. GiftCertificates Table
        print("Creating GiftCertificates table...")
        cursor.execute("""
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='GiftCertificates' and xtype='U')
            CREATE TABLE GiftCertificates (
                gcNumber VARCHAR(50) PRIMARY KEY,
                value DECIMAL(10, 2),
                expiryDate VARCHAR(50)
            )
        """)
        cursor.execute("DELETE FROM GiftCertificates")
        
        gc_data = [
            ('GC-1001', 50.00, '2026-12-31'),
            ('GC-1002', 120.50, '2026-11-15'),
            ('GC-1003', 25.00, '2026-08-01'),
        ]
        cursor.executemany("INSERT INTO GiftCertificates (gcNumber, value, expiryDate) VALUES (?, ?, ?)", gc_data)

        # 4. Terms Table
        print("Creating Terms table...")
        cursor.execute("""
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Terms' and xtype='U')
            CREATE TABLE Terms (
                code VARCHAR(50) PRIMARY KEY,
                name VARCHAR(100)
            )
        """)
        cursor.execute("DELETE FROM Terms")
        
        terms_data = [
            ('NET365', '1 Year'),
            ('NET30', '30 Days'),
            ('NET60', '60 Days'),
            ('NET90', '90 Days'),
            ('COD', 'Cash on Delivery'),
        ]
        cursor.executemany("INSERT INTO Terms (code, name) VALUES (?, ?)", terms_data)

        conn.commit()
        print("All tables created and seeded successfully!")
        
    except Exception as e:
        print("Error:", e)
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    create_and_seed_tables()
