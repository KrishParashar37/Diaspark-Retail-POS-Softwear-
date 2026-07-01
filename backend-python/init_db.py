import sqlite3
import os

DB_FILE = "pos.db"

def init_db():
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
        
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Create Customers table
    cursor.execute('''
        CREATE TABLE Customers (
            customerId INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT,
            lastName TEXT,
            email TEXT,
            mobile TEXT,
            city TEXT,
            stateName TEXT,
            zipCode TEXT,
            addressLine TEXT
        )
    ''')

    # Create Vendors table
    cursor.execute('''
        CREATE TABLE Vendors (
            code TEXT PRIMARY KEY,
            name TEXT,
            phone TEXT,
            city TEXT,
            state TEXT,
            zip TEXT,
            email TEXT
        )
    ''')

    # Create StoneCodes table
    cursor.execute('''
        CREATE TABLE StoneCodes (
            code TEXT PRIMARY KEY,
            stoneType TEXT,
            color TEXT
        )
    ''')

    # Create Transactions table
    cursor.execute('''
        CREATE TABLE Transactions (
            transactionId INTEGER PRIMARY KEY AUTOINCREMENT,
            customerId INTEGER,
            salesperson TEXT,
            totalAmount REAL,
            status TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Create TransactionItems table
    cursor.execute('''
        CREATE TABLE TransactionItems (
            itemId INTEGER PRIMARY KEY AUTOINCREMENT,
            transactionId INTEGER,
            sku TEXT,
            description TEXT,
            quantity INTEGER,
            price REAL,
            FOREIGN KEY(transactionId) REFERENCES Transactions(transactionId)
        )
    ''')

    # Create Orders table
    cursor.execute('''
        CREATE TABLE Orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderType TEXT,
            special TEXT,
            lastName TEXT,
            firstName TEXT,
            orderDate TEXT,
            estYear TEXT,
            shipDate TEXT,
            cf TEXT,
            ack TEXT,
            esti TEXT,
            po TEXT,
            cnt TEXT,
            rec TEXT,
            st TEXT,
            co TEXT,
            salesPerson TEXT,
            rush TEXT,
            workbag TEXT,
            currentStage TEXT,
            stageDueDate TEXT,
            vendor TEXT,
            customerConfi TEXT,
            item TEXT,
            name TEXT,
            saleDescription TEXT
        )
    ''')

    ORDER_TRACKING_DATA = [
        {"orderType": "Special Order", "special": "102946-101", "lastName": "Chang", "firstName": "Judy", "orderDate": "07/20/2023", "estYear": "2023", "shipDate": "07/25/2023", "cf": "-", "ack": "", "esti": "", "po": "", "cnt": "-", "rec": "-", "st": "-", "co": "-", "salesPerson": "GHAD", "rush": "", "workbag": "1029461010", "currentStage": "WB", "stageDueDate": "07/25/2023", "vendor": "DVA0001", "customerConfi": "", "item": "DER-1015-000", "name": "18K Y Earring Dia Wt. 0.26", "saleDescription": "18K Y Earring Dia Wt. 0.26 ct V"},
        {"orderType": "Special Order", "special": "102914-101", "lastName": "Bimont", "firstName": "Timba", "orderDate": "09/12/2023", "estYear": "2023", "shipDate": "09/26/2023", "cf": "-", "ack": "", "esti": "", "po": "+", "cnt": "-", "rec": "-", "st": "-", "co": "+", "salesPerson": "HARRY", "rush": "", "workbag": "1029141010", "currentStage": "PO", "stageDueDate": "06/25/2024", "vendor": "DPR0002", "customerConfi": "", "item": "DPT-323334", "name": "18K WG Dia Pendant & Ear", "saleDescription": "Pendant"},
        {"orderType": "Repair Order", "special": "102920-101", "lastName": "Craven", "firstName": "Paul", "orderDate": "09/12/2023", "estYear": "2023", "shipDate": "09/28/2023", "cf": "-", "ack": "", "esti": "", "po": "", "cnt": "-", "rec": "-", "st": "-", "co": "-", "salesPerson": "CARLOS", "rush": "", "workbag": "1029201010", "currentStage": "WB", "stageDueDate": "09/28/2023", "vendor": "DPR0002", "customerConfi": "", "item": "DRG-6034-000", "name": "14 KT Rings", "saleDescription": "Rings"},
        {"orderType": "Repair Order", "special": "102913-101", "lastName": "Bray", "firstName": "Matthew", "orderDate": "09/12/2023", "estYear": "2023", "shipDate": "09/29/2023", "cf": "-", "ack": "", "esti": "", "po": "+", "cnt": "-", "rec": "-", "st": "-", "co": "+", "salesPerson": "DAVE", "rush": "", "workbag": "1029131010", "currentStage": "PO", "stageDueDate": "06/25/2024", "vendor": "DPR0002", "customerConfi": "", "item": "DRG-594382", "name": "18K WG Dia Ring with Dia:C", "saleDescription": "Rings"},
        {"orderType": "Layaway Order", "special": "102908-101", "lastName": "Ahmed", "firstName": "Syeda", "orderDate": "09/12/2023", "estYear": "2023", "shipDate": "09/30/2023", "cf": "-", "ack": "", "esti": "", "po": "", "cnt": "-", "rec": "-", "st": "-", "co": "-", "salesPerson": "DAVE", "rush": "", "workbag": "1029081010", "currentStage": "WB", "stageDueDate": "09/30/2023", "vendor": "ROLEX", "customerConfi": "", "item": "RO-0002", "name": "40MM S/YG SUBMARINER DA", "saleDescription": "40MM S/YG SUBMARINER DATE"},
        {"orderType": "Layaway Order", "special": "102910-101", "lastName": "Ambridge", "firstName": "Brittany", "orderDate": "09/12/2023", "estYear": "2023", "shipDate": "09/30/2023", "cf": "-", "ack": "", "esti": "", "po": "", "cnt": "-", "rec": "-", "st": "-", "co": "-", "salesPerson": "HEMAN", "rush": "", "workbag": "1029101010", "currentStage": "WB", "stageDueDate": "09/30/2023", "vendor": "ROLEX", "customerConfi": "", "item": "RO-0003", "name": "40MM S/S SUBMARINER", "saleDescription": "40MM S/S SUBMARINER"},
        {"orderType": "Layaway Order", "special": "102912-101", "lastName": "Antoniou", "firstName": "Elias", "orderDate": "09/12/2023", "estYear": "2023", "shipDate": "09/30/2023", "cf": "-", "ack": "", "esti": "", "po": "+", "cnt": "-", "rec": "-", "st": "-", "co": "+", "salesPerson": "GHAD", "rush": "", "workbag": "1029121010", "currentStage": "PO", "stageDueDate": "06/25/2024", "vendor": "DPR0002", "customerConfi": "", "item": "DBG-275176", "name": "18K W Bangle Dia Wt. 3.25", "saleDescription": "Bangle"},
        {"orderType": "Custom Order", "special": "102959-101", "lastName": "Allen-Arney", "firstName": "Jeremy", "orderDate": "02/21/2024", "estYear": "2024", "shipDate": "02/29/2024", "cf": "-", "ack": "", "esti": "", "po": "", "cnt": "-", "rec": "-", "st": "-", "co": "-", "salesPerson": "HEMAN", "rush": "", "workbag": "1029591010", "currentStage": "WB", "stageDueDate": "02/29/2024", "vendor": "DPR0002", "customerConfi": "", "item": "DNK-6031-000", "name": "Necklace", "saleDescription": "Necklace"},
        {"orderType": "Custom Order", "special": "102993-101", "lastName": "CHHAJLANI", "firstName": "ABHISHEK", "orderDate": "08/09/2024", "estYear": "2024", "shipDate": "08/16/2024", "cf": "-", "ack": "", "esti": "", "po": "+", "cnt": "-", "rec": "-", "st": "-", "co": "-", "salesPerson": "DAVE", "rush": "", "workbag": "1029931010", "currentStage": "PO", "stageDueDate": "08/16/2024", "vendor": "DPR0002", "customerConfi": "", "item": "DRG-6034-000", "name": "Rings", "saleDescription": "Rings"},
        {"orderType": "Special Order", "special": "103021-101", "lastName": "Park", "firstName": "Sam", "orderDate": "12/18/2024", "estYear": "2024", "shipDate": "12/20/2024", "cf": "-", "ack": "", "esti": "", "po": "", "cnt": "-", "rec": "-", "st": "-", "co": "-", "salesPerson": "WILLIAM", "rush": "", "workbag": "1030211010", "currentStage": "WB", "stageDueDate": "12/20/2024", "vendor": "DAA0001", "customerConfi": "", "item": "DRG-1012-000", "name": "18K Y Ring Dia Wt. 0.13 ct V", "saleDescription": "18K Y Ring Dia Wt. 0.13 ct VVS"},
        {"orderType": "Special Order", "special": "103007-101", "lastName": "Park", "firstName": "Sam", "orderDate": "10/23/2024", "estYear": "2024", "shipDate": "12/25/2024", "cf": "-", "ack": "", "esti": "+", "po": "+", "cnt": "-", "rec": "+", "st": "-", "co": "+", "salesPerson": "WILLIAM", "rush": "", "workbag": "1030071010", "currentStage": "CO", "stageDueDate": "10/30/2024", "vendor": "TAGHEUER", "customerConfi": "", "item": "DTH-WAR201A-BA743", "name": "WTCH CARRE AUTO MG STE", "saleDescription": "WTCH CARRE AUTO MG STEEL D"}
    ]

    extended_orders = []
    for i in range(20):
        for order in ORDER_TRACKING_DATA:
            new_order = dict(order)
            new_order["special"] = new_order["special"] + f"-{i}"
            extended_orders.append(new_order)

    for order in extended_orders:
        cursor.execute('''
            INSERT INTO Orders (
                orderType, special, lastName, firstName, orderDate, estYear, shipDate, cf, ack, esti, po, cnt, rec, st, co, salesPerson, rush, workbag, currentStage, stageDueDate, vendor, customerConfi, item, name, saleDescription
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            order["orderType"], order["special"], order["lastName"], order["firstName"], order["orderDate"], order["estYear"],
            order["shipDate"], order["cf"], order["ack"], order["esti"], order["po"], order["cnt"],
            order["rec"], order["st"], order["co"], order["salesPerson"], order["rush"], order["workbag"],
            order["currentStage"], order["stageDueDate"], order["vendor"], order["customerConfi"],
            order["item"], order["name"], order["saleDescription"]
        ))


    # Dummy customer data
    customers = [
        ("John", "Doe", "john.doe@example.com", "555-0101", "New York", "NY", "10001", "123 Broadway"),
        ("Jane", "Smith", "jane.smith@example.com", "555-0102", "Los Angeles", "CA", "90001", "456 Hollywood Blvd"),
        ("Michael", "Johnson", "mike.j@example.com", "555-0103", "Chicago", "IL", "60601", "789 Wacker Dr"),
        ("Emily", "Davis", "emily.d@example.com", "555-0104", "Houston", "TX", "77001", "321 Main St"),
        ("David", "Brown", "david.b@example.com", "555-0105", "Phoenix", "AZ", "85001", "654 Desert Way"),
        ("Sarah", "Wilson", "sarah.w@example.com", "555-0106", "Philadelphia", "PA", "19101", "987 Liberty Ave"),
        ("James", "Moore", "james.m@example.com", "555-0107", "San Antonio", "TX", "78201", "147 Alamo St"),
        ("Jessica", "Taylor", "jessica.t@example.com", "555-0108", "San Diego", "CA", "92101", "258 Ocean Blvd"),
        ("William", "Anderson", "william.a@example.com", "555-0109", "Dallas", "TX", "75201", "369 Texas Ave"),
        ("Ashley", "Thomas", "ashley.t@example.com", "555-0110", "San Jose", "CA", "95101", "159 Tech Blvd"),
        ("Robert", "Jackson", "robert.j@example.com", "555-0111", "Austin", "TX", "73301", "753 Music Ave"),
        ("Jennifer", "White", "jennifer.w@example.com", "555-0112", "Jacksonville", "FL", "32099", "951 Beach Rd"),
        ("Richard", "Harris", "richard.h@example.com", "555-0113", "Fort Worth", "TX", "76101", "357 Cowboy Way"),
        ("Lisa", "Martin", "lisa.m@example.com", "555-0114", "Columbus", "OH", "43201", "456 Buckeye Cir"),
        ("Charles", "Thompson", "charles.t@example.com", "555-0115", "Charlotte", "NC", "28201", "789 Queen City Dr")
    ]

    cursor.executemany('''
        INSERT INTO Customers (firstName, lastName, email, mobile, city, stateName, zipCode, addressLine)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', customers)

    # Dummy vendor data
    vendors = [
        ("DAA0001", "AARTA Ltd", "", "", "", "", ""),
        ("DACC001", "Accar LTD., INC.", "", "Miami", "FL", "33132", ""),
        ("DAN0001", "Anila Gems", "", "", "", "", ""),
        ("DAS0001", "Aspire Designs Ltd", "", "", "", "", ""),
        ("DAV0001", "Ava Jewels Limited", "", "", "", "", ""),
        ("DAV0002", "Avance Jewels Ltd", "", "", "", "", ""),
        ("DBAPA01", "Bapalal Keshavlal", "", "Hughes Road", "Mumbai", "400", ""),
        ("DBC0001", "BC Jain", "", "", "", "", ""),
        ("DBE0001", "Beauty Jewels", "", "", "", "", ""),
        ("DBE0002", "Belgium Jewellery Inc", "", "", "", "", ""),
        ("DBGEX01", "BG EXPORTS", "", "", "", "", ""),
        ("DBU0001", "Butani Jewellers", "", "", "", "", ""),
        ("DCF0001", "C&F Jewellery MFR Ltd", "", "", "", "", ""),
        ("DCH0001", "Cheerful Jewelry Ltd", "", "", "", "", ""),
        ("DCR0001", "Crown Ring", "", "", "", "", ""),
        ("DDI0001", "Divine Jewels", "", "", "", "", ""),
        ("DDK0001", "DKN Jewellery Co LTD", "", "", "", "", ""),
        ("DDY0001", "Dynasty Jewellery", "", "", "", "", "")
    ]

    cursor.executemany('''
        INSERT INTO Vendors (code, name, phone, city, state, zip, email)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', vendors)

    # Dummy stone codes data
    stone_codes = [
        ("AX", "AXDT", "G"),
        ("PA", "AMTY", "P"),
        ("GA", "AMTY", "G"),
        ("AQB", "AQMN", "B"),
        ("BC", "CTRN", "B"),
        ("GC", "CTRN", "G"),
        ("WD", "DIAM", "W"),
        ("FCD", "DIAM", "F"),
        ("YD", "DIAM", "Y"),
        ("Black Diamond", "DIAM", "B"),
        ("GD", "DIAM", "G"),
        ("EM", "EMRL", "G"),
        ("ND", "DIAM", "G"),
        ("BD", "DIAM", "B"),
        ("KD", "DIAM", "K"),
        ("Tpz", "TOPZ", "Y")
    ]

    cursor.executemany('''
        INSERT INTO StoneCodes (code, stoneType, color)
        VALUES (?, ?, ?)
    ''', stone_codes)

    conn.commit()
    conn.close()
    print(f"Database {DB_FILE} created successfully with {len(customers)} dummy customers.")

if __name__ == "__main__":
    init_db()
