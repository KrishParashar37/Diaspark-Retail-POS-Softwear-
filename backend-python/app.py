from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
import pyodbc
import sqlite3
import pyodbc
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

def get_db_connection():
    # Connect to SQL Server
    conn_str = (
        "Driver={SQL Server Native Client 11.0};"
        "Server=DBSRV2025;"
        "Database=POSDB;"
        "UID=retail;"
        "PWD=retail@1234;"
    )
    return pyodbc.connect(conn_str)
def get_table_schema(cursor, table_name):
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
        if col == 'id':
            continue
        columns.append(col)
        placeholders.append('?')
        
        matching_key = next((k for k in data.keys() if k.lower() == col.lower()), None)
        if matching_key and data[matching_key] is not None:
            val = data[matching_key]
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
        cursor.execute(query, tuple(values))


# ─── Helper: rows to list of dicts ───
def rows_to_dicts(cursor):
    columns = [col[0] for col in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


# ════════════════════════════════════════
#  AUTHENTICATION & EMAIL NOTIFICATIONS
# ════════════════════════════════════════

def send_login_notification(user_email, login_type):
    # To use this in production, replace with your actual SMTP credentials!
    # For example, using Gmail:
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "krishparashar609@gmail.com"
    sender_password = "yaqk lbqr xkka wawk"
    
    receiver_email = "krishparashar609@gmail.com"
    
    subject = "New User Login Notification"
    body = f"Hello,\n\nA user just logged in to the DIASPARK UI.\n\nUser Details:\nEmail: {user_email}\nLogin Method: {login_type}\n\nThanks,\nDiaspark System"
    
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = receiver_email
    
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        print(f"Login notification email sent to {receiver_email}")
    except Exception as e:
        print(f"Warning: Could not send email. Please configure SMTP credentials. Error: {e}")

@app.route("/api/login", methods=["POST"])
def login_email():
    data = request.json
    email = data.get("email", "")
    password = data.get("password", "")
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if the user exists
        cursor.execute("SELECT * FROM Users WHERE email=?", (email,))
        user = cursor.fetchone()
        
        if user:
            # User exists, verify password
            if user[2] == password:
                send_login_notification(email, "Standard Email/Password")
                return jsonify({"success": True, "message": "Login successful", "user": {"email": email}}), 200
            else:
                return jsonify({"success": False, "error": "Invalid email or password"}), 401
        else:
            # User does NOT exist, auto-register them!
            cursor.execute("INSERT INTO Users (email, passwordHash, fullName) VALUES (?, ?, ?)", (email, password, 'New User'))
            conn.commit()
            send_login_notification(email, "New Auto-Registration (Email/Password)")
            return jsonify({"success": True, "message": "Account created and logged in", "user": {"email": email}}), 200
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals():
            conn.close()

@app.route("/api/login/google", methods=["POST"])
def login_google():
    data = request.json
    email = data.get("email", "")
    
    try:
        if not email:
            return jsonify({"success": False, "error": "No email provided by Google"}), 400
            
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM Users WHERE email=?", (email,))
        user = cursor.fetchone()
        
        if not user:
            # Auto-register Google user
            cursor.execute("INSERT INTO Users (email, fullName) VALUES (?, ?)", (email, 'Google User'))
            conn.commit()
            send_login_notification(email, "New Auto-Registration (Google)")
        else:
            send_login_notification(email, "Google Sign-In")
        
        return jsonify({"success": True, "message": "Google Login successful", "user": {"email": email}}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if 'conn' in locals():
            conn.close()

# ════════════════════════════════════════
#  STONE CODES
# ════════════════════════════════════════

@app.route("/api/stonecodes", methods=["GET"])
def get_stonecodes():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Search by optional query params
        code = request.args.get("code", "").strip()
        stone_type = request.args.get("stoneType", "").strip()
        color = request.args.get("color", "").strip()

        query = "SELECT * FROM StoneCodes WHERE 1=1"
        params = []

        if code:
            query += " AND code LIKE ?"
            params.append(f"%{code}%")
        if stone_type:
            query += " AND stoneType LIKE ?"
            params.append(f"%{stone_type}%")
        if color:
            query += " AND color LIKE ?"
            params.append(f"%{color}%")

        cursor.execute(query, params)
        data = rows_to_dicts(cursor)
        conn.close()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ════════════════════════════════════════
#  CUSTOMERS
# ════════════════════════════════════════

@app.route("/api/customers", methods=["GET"])
def get_customers():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Customers")
        data = rows_to_dicts(cursor)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/customers", methods=["POST"])
def create_customer():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO Customers (
                firstName, lastName, email, mobile, 
                city, stateName, zipCode, addressLine
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('firstName', ''), data.get('lastName', ''),
            data.get('email', ''), data.get('mobile', ''),
            data.get('city', ''), data.get('stateName', ''),
            data.get('zipCode', ''), data.get('addressLine', '')
        ))
        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        
        return jsonify({"message": "Customer created successfully", "customerId": new_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/customers/<int:customer_id>", methods=["PUT"])
def update_customer(customer_id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE Customers SET 
                firstName = ?, lastName = ?, email = ?, mobile = ?, 
                city = ?, stateName = ?, zipCode = ?, addressLine = ?
            WHERE customerId = ?
        ''', (
            data.get('firstName', ''), data.get('lastName', ''),
            data.get('email', ''), data.get('mobile', ''),
            data.get('city', ''), data.get('stateName', ''),
            data.get('zipCode', ''), data.get('addressLine', ''),
            customer_id
        ))
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Customer updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/customers/search", methods=["GET"])
def search_customers():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        keywords = request.args.get("keywords", "").strip()
        first_name = request.args.get("firstName", "").strip()
        last_name = request.args.get("lastName", "").strip()
        city = request.args.get("city", "").strip()
        state = request.args.get("state", "").strip()
        zip_code = request.args.get("zip", "").strip()
        address = request.args.get("address", "").strip()
        email = request.args.get("email", "").strip()
        phone = request.args.get("phone", "").strip()
        salesperson = request.args.get("salesperson", "").strip()

        query = "SELECT * FROM Customers WHERE 1=1"
        params = []

        if keywords:
            query += """ AND (firstName LIKE ? OR lastName LIKE ? OR CONCAT(firstName, ' ', lastName) LIKE ? OR CONCAT(lastName, ' ', firstName) LIKE ?
                         OR email LIKE ? OR mobile LIKE ? OR city LIKE ? OR stateName LIKE ? 
                         OR zipCode LIKE ? OR addressLine LIKE ? OR CAST(customerId AS VARCHAR) LIKE ?"""
            kw = f"%{keywords}%"
            params.extend([kw] * 11)
            
            import re
            digits = re.sub(r'\D', '', keywords)
            if digits and len(digits) > 0:
                try:
                    cust_id_val = int(digits)
                    query += " OR customerId = ?"
                    params.append(cust_id_val)
                except ValueError:
                    pass
            query += ")"
        if first_name:
            query += " AND firstName LIKE ?"
            params.append(f"%{first_name}%")
        if last_name:
            query += " AND lastName LIKE ?"
            params.append(f"%{last_name}%")
        if city:
            query += " AND city LIKE ?"
            params.append(f"%{city}%")
        if state:
            query += " AND stateName LIKE ?"
            params.append(f"%{state}%")
        if zip_code:
            query += " AND zipCode LIKE ?"
            params.append(f"%{zip_code}%")
        if address:
            query += " AND addressLine LIKE ?"
            params.append(f"%{address}%")
        if email:
            query += " AND email LIKE ?"
            params.append(f"%{email}%")
        if phone:
            query += " AND mobile LIKE ?"
            params.append(f"%{phone}%")
        if salesperson:
            query += " AND customerId IN (SELECT customer_id FROM pos_invoices WHERE salesperson_code LIKE ?)"
            params.append(f"%{salesperson}%")

        cursor.execute(query, params)
        data = rows_to_dicts(cursor)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ════════════════════════════════════════
#  SKUs (hardcoded data matching SkuLookupModal)
# ════════════════════════════════════════

SKU_DATA = [
    {"category": "HUBLOT", "sku": "DHU-601.NM.0177123", "itemType": "Watch", "description": "Spirit of Big Bang 50MM Titani", "vendor": "HUBLOT", "vendorStyle": "DHU-601.NM.0177123", "onHand": 1},
    {"category": "HUBLOT", "sku": "DHU-361.PX.1280.RX.7143", "itemType": "Watch", "description": "Big Bang Gold Diamonds 38MM", "vendor": "HUBLOT", "vendorStyle": "DHU-361.PX.1280.RX.7143", "onHand": 1},
    {"category": "TAGHEUER", "sku": "DTH-CAT2010-BA7250", "itemType": "Watch", "description": "CHRG LINK4 AUTO MG STEEL DI BLACK BR ST", "vendor": "TAGHEUER", "vendorStyle": "DTH-CAT2010-BA7250", "onHand": 1},
    {"category": "TAGHEUER", "sku": "DTH-CAW2111-FC7264", "itemType": "Watch", "description": "CHRG MONRD AUTO MN STEEL DI BLUE BR AI", "vendor": "TAGHEUER", "vendorStyle": "DTH-CAW2111-FC7264", "onHand": 2},
    {"category": "TAGHEUER", "sku": "DTH-CV2119-FC7274", "itemType": "Watch", "description": "CHRG CARRE AUTO MN STEEL DI GREY BR LEA", "vendor": "TAGHEUER", "vendorStyle": "DTH-CV2119-FC7274", "onHand": 1},
    {"category": "TAGHEUER", "sku": "DTH-CAR2110-BA7332", "itemType": "Watch", "description": "CHRG CARRE AUTO MN STEEL DI BLACK BR ST", "vendor": "TAGHEUER", "vendorStyle": "DTH-CAR2110-BA7332", "onHand": 1},
    {"category": "PANERAI", "sku": "DPA7437", "itemType": "Watch", "description": "Luminor 44 Gmt Aut Ste All Bk", "vendor": "PANERAI", "vendorStyle": "DPA7437", "onHand": 1},
    {"category": "PANERAI", "sku": "DPA7439", "itemType": "Watch", "description": "Luminor 44 Marina Aut Ste All Bk", "vendor": "PANERAI", "vendorStyle": "DPA7439", "onHand": 1},
    {"category": "PANERAI", "sku": "DPA7480", "itemType": "Watch", "description": "LUM 44 MARINA P5000 RG ALL", "vendor": "PANERAI", "vendorStyle": "DPA7480", "onHand": 1},
    {"category": "PANERAI", "sku": "DPA7486", "itemType": "Watch", "description": "Um 1950 42 Marina P9000 Ste All Wh", "vendor": "PANERAI", "vendorStyle": "DPA7486", "onHand": 1},
    {"category": "PANERAI", "sku": "DPA7487", "itemType": "Watch", "description": "RAD 1940 42 P999 RG ALL BN", "vendor": "PANERAI", "vendorStyle": "DPA7487", "onHand": 1},
    {"category": "PANERAI", "sku": "DPA-7539", "itemType": "Watch", "description": "LUM 1950 44 GMT PR P9012 STE ALL BK", "vendor": "PANERAI", "vendorStyle": "DPA-7539", "onHand": 1},
    {"category": "TUDOR", "sku": "DTU-56000-3G-S7633", "itemType": "Watch", "description": "39MM S/S GLAMOUR DATE-DAY DOUBLE BEZE", "vendor": "TUDOR", "vendorStyle": "DTU-56000-3G-S7633", "onHand": 1},
    {"category": "TUDOR", "sku": "DTU-79220-30-7647", "itemType": "Watch", "description": "41MM S/S BLACK BAY BLUE BEZEL", "vendor": "TUDOR", "vendorStyle": "DTU-79220-30-7647", "onHand": 1},
    {"category": "TUDOR", "sku": "DTU-79620-07-S7685", "itemType": "Watch", "description": "42MM S/TITANIUM HERITAGE ADVISOR STL", "vendor": "TUDOR", "vendorStyle": "DTU-79620-07-S7685", "onHand": 3},
    {"category": "TUDOR", "sku": "DTU-79910-37-S7701", "itemType": "Watch", "description": "41MM S/S RANGER STL BEZEL", "vendor": "TUDOR", "vendorStyle": "DTU-79910-37-S7701", "onHand": 1},
    {"category": "BANGLE", "sku": "DBAN-1084", "itemType": "Jewelry", "description": "1 Pair of 18K Y G Dia Ladies Bangles with Dia", "vendor": "DAA0001", "vendorStyle": "DBAN-6036", "onHand": 1},
    {"category": "EARRING", "sku": "DER-1136", "itemType": "Jewelry", "description": "18K WG Dia Earrings with Dia:1.27ct Prl:12.4", "vendor": "DTR0001", "vendorStyle": "DER-6038", "onHand": 1},
]

@app.route("/api/skus", methods=["GET"])
def get_skus():
    return jsonify(SKU_DATA)


@app.route("/api/skus/search", methods=["GET"])
def search_skus():
    category = request.args.get("category", "").strip().lower()
    sku = request.args.get("sku", "").strip().lower()
    item_type = request.args.get("itemType", "").strip().lower()
    description = request.args.get("description", "").strip().lower()
    vendor = request.args.get("vendor", "").strip().lower()
    vendor_style = request.args.get("vendorStyle", "").strip().lower()

    results = SKU_DATA
    if category:
        results = [item for item in results if category in item["category"].lower()]
    if sku:
        results = [item for item in results if sku in item["sku"].lower()]
    if item_type:
        results = [item for item in results if item_type in item["itemType"].lower()]
    if description:
        results = [item for item in results if description in item["description"].lower()]
    if vendor:
        results = [item for item in results if vendor in item["vendor"].lower()]
    if vendor_style:
        results = [item for item in results if vendor_style in item["vendorStyle"].lower()]

    return jsonify(results)


# ════════════════════════════════════════
#  ITEMS (sample data matching ItemLookupModal columns)
# ════════════════════════════════════════

ITEM_DATA = [
    {"serial": "SN-10001", "sku": "DHU-601.NM.0177123", "description": "Spirit of Big Bang 50MM", "category": "HUBLOT", "detailDescription": "Titanium case, black dial, rubber strap", "vendor": "HUBLOT", "vendorStyle": "601.NM.0173", "size": "50MM", "retailPrice": 18500.00, "onHand": 1, "location": "A1"},
    {"serial": "SN-10002", "sku": "DTH-CAT2010-BA7250", "description": "CHRG LINK4 AUTO MG STEEL", "category": "TAGHEUER", "detailDescription": "Steel case, black dial, steel bracelet", "vendor": "TAGHEUER", "vendorStyle": "CAT2010.BA0725", "size": "43MM", "retailPrice": 4950.00, "onHand": 1, "location": "B2"},
    {"serial": "SN-10003", "sku": "DPA7437", "description": "Luminor 44 GMT", "category": "PANERAI", "detailDescription": "Automatic, steel, all black", "vendor": "PANERAI", "vendorStyle": "PAM00535", "size": "44MM", "retailPrice": 8900.00, "onHand": 1, "location": "C1"},
    {"serial": "SN-10004", "sku": "DTU-79220-30-7647", "description": "Black Bay Blue Bezel", "category": "TUDOR", "detailDescription": "41MM S/S with blue bezel, automatic", "vendor": "TUDOR", "vendorStyle": "79220B", "size": "41MM", "retailPrice": 3750.00, "onHand": 1, "location": "D3"},
    {"serial": "SN-10005", "sku": "DBAN-1084", "description": "18K YG Diamond Bangles", "category": "BANGLE", "detailDescription": "1 Pair 18K Yellow Gold Diamond Ladies Bangles", "vendor": "DAA0001", "vendorStyle": "DBAN-6036", "size": "7.5", "retailPrice": 12500.00, "onHand": 1, "location": "E1"},
    {"serial": "SN-10006", "sku": "DER-1136", "description": "18K WG Diamond Earrings", "category": "EARRING", "detailDescription": "18K White Gold, Dia:1.27ct, Pearl:12.4mm", "vendor": "DTR0001", "vendorStyle": "DER-6038", "size": "-", "retailPrice": 6800.00, "onHand": 1, "location": "F2"},
    {"serial": "SN-10007", "sku": "DHU-361.PX.1280.RX.7143", "description": "Big Bang Gold Diamonds 38MM", "category": "HUBLOT", "detailDescription": "Gold case, diamond bezel, 38mm", "vendor": "HUBLOT", "vendorStyle": "361.PX.1280", "size": "38MM", "retailPrice": 25900.00, "onHand": 1, "location": "A2"},
    {"serial": "SN-10008", "sku": "DTH-CAW2111-FC7264", "description": "CHRG MONRD AUTO MN STEEL", "category": "TAGHEUER", "detailDescription": "Monaco, steel, blue dial, alligator strap", "vendor": "TAGHEUER", "vendorStyle": "CAW2111.FC6183", "size": "39MM", "retailPrice": 6150.00, "onHand": 2, "location": "B1"},
    {"serial": "SN-10009", "sku": "DPA7480", "description": "LUM 44 MARINA P5000 RG", "category": "PANERAI", "detailDescription": "Luminor Marina, Rose Gold, P.5000 movement", "vendor": "PANERAI", "vendorStyle": "PAM00511", "size": "44MM", "retailPrice": 22400.00, "onHand": 1, "location": "C2"},
    {"serial": "SN-10010", "sku": "DTU-79620-07-S7685", "description": "Heritage Advisor STL", "category": "TUDOR", "detailDescription": "42MM Titanium, Heritage Advisor, alarm function", "vendor": "TUDOR", "vendorStyle": "79620T", "size": "42MM", "retailPrice": 4200.00, "onHand": 3, "location": "D1"},
]

@app.route("/api/items", methods=["GET"])
def get_items():
    return jsonify(ITEM_DATA)


@app.route("/api/items/search", methods=["GET"])
def search_items():
    keywords = request.args.get("keywords", "").strip().lower()
    serial = request.args.get("serial", "").strip().lower()
    sku = request.args.get("sku", "").strip().lower()
    department = request.args.get("department", "").strip().lower()
    category = request.args.get("category", "").strip().lower()
    vendor = request.args.get("vendor", "").strip().lower()
    description = request.args.get("description", "").strip().lower()

    results = ITEM_DATA
    if keywords:
        results = [item for item in results if keywords in item["serial"].lower() or keywords in item["sku"].lower() or keywords in (item.get("description") or "").lower() or keywords in item["category"].lower() or keywords in item["vendor"].lower()]
    if serial:
        results = [item for item in results if serial in item["serial"].lower()]
    if sku:
        results = [item for item in results if sku in item["sku"].lower()]
    if category:
        results = [item for item in results if category in item["category"].lower()]
    if vendor:
        results = [item for item in results if vendor in item["vendor"].lower()]
    if description:
        results = [item for item in results if description in (item.get("description") or "").lower() or description in (item.get("detailDescription") or "").lower()]

    return jsonify(results)


# ════════════════════════════════════════
#  CATEGORIES & VENDORS
# ════════════════════════════════════════

@app.route("/api/categories", methods=["GET"])
def get_categories():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT code, name FROM Categories")
        results = [{"code": row[0], "name": row[1]} for row in cursor.fetchall()]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals(): conn.close()

@app.route("/api/engagements", methods=["GET"])
def get_engagements():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT code, name FROM PointsOfEngagement")
        results = [{"code": row[0], "name": row[1]} for row in cursor.fetchall()]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals(): conn.close()

@app.route("/api/languages", methods=["GET"])
def get_languages():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT code, name FROM Languages")
        results = [{"code": row[0], "name": row[1]} for row in cursor.fetchall()]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals(): conn.close()

@app.route("/api/demographics", methods=["GET"])
def get_demographics():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT code, name FROM ClientDemographics")
        results = [{"code": row[0], "name": row[1]} for row in cursor.fetchall()]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals(): conn.close()

@app.route("/api/categories/search", methods=["GET"])
def search_categories():
    code = request.args.get("code", "").strip()
    name = request.args.get("name", "").strip()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "SELECT categoryName, categoryName FROM Categories WHERE 1=1"
        params = []
        if code:
            query += " AND categoryName LIKE ?"
            params.append(f"%{code}%")
        if name:
            query += " AND categoryName LIKE ?"
            params.append(f"%{name}%")
        cursor.execute(query, params)
        results = [{"code": row[0], "name": row[1]} for row in cursor.fetchall()]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals(): conn.close()

@app.route("/api/vendors", methods=["GET"])
def get_vendors():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT vendorId, vendorName, phone, city, email FROM Vendors")
        results = [{"code": str(row[0]), "name": row[1] or "", "phone": row[2] or "", "city": row[3] or "", "state": "", "zip": "", "email": row[4] or ""} for row in cursor.fetchall()]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals(): conn.close()

@app.route("/api/vendors/search", methods=["GET"])
def search_vendors():
    keywords = request.args.get("keywords", "").strip()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "SELECT vendorId, vendorName, phone, city, email FROM Vendors WHERE 1=1"
        params = []
        if keywords:
            query += " AND (CAST(vendorId AS VARCHAR) LIKE ? OR vendorName LIKE ? OR city LIKE ?)"
            params.extend([f"%{keywords}%"] * 3)
        cursor.execute(query, params)
        results = [{"code": str(row[0]), "name": row[1] or "", "phone": row[2] or "", "city": row[3] or "", "state": "", "zip": "", "email": row[4] or ""} for row in cursor.fetchall()]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals(): conn.close()

@app.route("/api/labor", methods=["GET"])
def get_labor():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT laborNum, description, price FROM Labor")
        results = [{"laborNum": row[0], "desc": row[1], "price": str(row[2])} for row in cursor.fetchall()]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals(): conn.close()

@app.route("/api/diamondstones", methods=["GET"])
def get_diamondstones():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT sku, lot, name, stone, type, shape, shade, size, clarity, color, pcs, wt, price, cert, ownership, remarks, orderNum, loc FROM DiamondStones")
        results = [{"sku": r[0], "lot": r[1], "name": r[2], "stone": r[3], "type": r[4], "shape": r[5], "shade": r[6], "size": r[7], "clarity": r[8], "color": r[9], "pcs": r[10], "wt": r[11], "price": r[12], "cert": r[13], "ownership": r[14], "remarks": r[15], "order": r[16], "loc": r[17]} for r in cursor.fetchall()]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals(): conn.close()

@app.route("/api/giftcertificates", methods=["GET"])
def get_giftcertificates():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT gcNumber, value, expiryDate FROM GiftCertificates")
        results = [{"gcNumber": row[0], "value": float(row[1]), "expiryDate": row[2]} for row in cursor.fetchall()]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals(): conn.close()

@app.route("/api/terms", methods=["GET"])
def get_terms():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT code, name FROM Terms")
        results = [{"code": row[0], "name": row[1]} for row in cursor.fetchall()]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals(): conn.close()


# ════════════════════════════════════════
#  SALESPERSONS
# ════════════════════════════════════════

SALESPERSON_DATA = [
    {"code": "DEMO", "name": "Demo", "fullName": "Demo User"},
    {"code": "GHAD", "name": "Ghada Slim", "fullName": "Ghada Slim"},
    {"code": "JACOBLEV", "name": "Jacob Levy", "fullName": "Jacob Levy"},
    {"code": "MARTIN", "name": "MARTIN", "fullName": "MARTIN"},
    {"code": "HARRY", "name": "HARRY FERNANDEZ", "fullName": "HARRY FERNANDEZ"},
    {"code": "HEMAN", "name": "HEMAN TRAN", "fullName": "HEMAN TRAN"},
    {"code": "WILLIAM", "name": "WILLIAM SCHILDER", "fullName": "WILLIAM SCHILDER"}
]

@app.route("/api/orders", methods=["GET"])
def get_orders():
    order_type = request.args.get("orderType", "").strip()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # JOIN pos_order with pos_order_lines and Customers
        query = '''
            SELECT 
                o.id,
                o.order_no as special,
                c.customerId as customerId,
                c.lastName as lastName,
                c.firstName as firstName,
                c.email as email,
                c.mobile as phone,
                c.city as city,
                c.stateName as state,
                c.zipCode as zip,
                c.addressLine as address,
                CONVERT(varchar, o.order_date, 101) as orderDate,
                o.salesperson_code as salesPerson,
                o.order_status as currentStage,
                l.sku as item,
                l.item_description as saleDescription,
                l.vendor as vendor
            FROM pos_orders o
            LEFT JOIN pos_order_lines l ON o.id = l.order_id
            LEFT JOIN Customers c ON o.customer_id = c.customerId
            
            UNION ALL
            
            SELECT 
                i.id,
                i.trans_no as special,
                c.customerId as customerId,
                c.lastName as lastName,
                c.firstName as firstName,
                c.email as email,
                c.mobile as phone,
                c.city as city,
                c.stateName as state,
                c.zipCode as zip,
                c.addressLine as address,
                CONVERT(varchar, i.trans_date, 101) as orderDate,
                i.salesperson_code as salesPerson,
                CASE 
                    WHEN i.trans_type = 'S' THEN 'Sales Receipt'
                    WHEN i.trans_type = 'T' THEN 'Trade In'
                    WHEN i.trans_type = 'L' THEN 'Layaway'
                    WHEN i.trans_type = 'E' THEN 'Exchange'
                    WHEN i.trans_type = 'R' THEN 'Refund Misc'
                    ELSE 'Sales Receipt' 
                END as currentStage,
                l.catalog_item_code as item,
                l.item_description as saleDescription,
                '' as vendor
            FROM pos_invoices i
            LEFT JOIN pos_invoice_lines l ON i.id = l.pos_invoice_id
            LEFT JOIN Customers c ON i.customer_id = c.customerId
            ORDER BY id DESC
        '''
        cursor.execute(query)
        
        columns = [column[0] for column in cursor.description]
        data = []
        for row in cursor.fetchall():
            row_dict = dict(zip(columns, row))
            data.append(row_dict)
            
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route("/api/orders/<int:order_id>/finalize", methods=["PUT"])
def finalize_order(order_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE Orders SET currentStage = 'CO' WHERE id = ?", (order_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Order finalized successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/orders/search", methods=["GET"])
def search_orders():
    special = request.args.get("special", "").strip().lower()
    last_name = request.args.get("lastName", "").strip().lower()
    first_name = request.args.get("firstName", "").strip().lower()
    sales_person = request.args.get("salesPerson", "").strip().lower()
    vendor = request.args.get("vendor", "").strip().lower()
    stage = request.args.get("stage", "").strip().lower()

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM Orders WHERE 1=1"
        params = []
        if special:
            query += " AND LOWER(special) LIKE ?"
            params.append(f"%{special}%")
        if last_name:
            query += " AND LOWER(lastName) LIKE ?"
            params.append(f"%{last_name}%")
        if first_name:
            query += " AND LOWER(firstName) LIKE ?"
            params.append(f"%{first_name}%")
        if sales_person:
            query += " AND LOWER(salesPerson) LIKE ?"
            params.append(f"%{sales_person}%")
        if vendor:
            query += " AND LOWER(vendor) LIKE ?"
            params.append(f"%{vendor}%")
        if stage:
            query += " AND LOWER(currentStage) LIKE ?"
            params.append(f"%{stage}%")

        cursor.execute(query, params)
        data = rows_to_dicts(cursor)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ════════════════════════════════════════
#  CASHIERS
# ════════════════════════════════════════

CASHIER_DATA = [
    {"code": "ADMIN", "name": "Diaspark Admin"},
    {"code": "Vinod", "name": "Vinod Jain"},
    {"code": "dave", "name": "Dave Rodies"},
]

@app.route("/api/cashiers", methods=["GET"])
def get_cashiers():
    return jsonify(CASHIER_DATA)


# ════════════════════════════════════════
#  SERVER TIME
# ════════════════════════════════════════

@app.route("/api/time", methods=["GET"])
def get_time():
    now = datetime.now()
    return jsonify({
        "dateString": now.strftime("%a %b %d %Y"),
        "timeString": now.strftime("%I:%M:%S %p"),
        "iso": now.isoformat()
    })


# ════════════════════════════════════════
#  LEGACY /data endpoint (same as Node.js)
# ════════════════════════════════════════

@app.route("/data", methods=["GET"])
def get_data():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM dbo.temp_May_all_05")
        data = rows_to_dicts(cursor)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ════════════════════════════════════════
#  SALESPERSONS
# ════════════════════════════════════════
SALESPERSONS_DATA = [
    {"code": "NA", "name": "NA", "store": "Edison", "primary": ""},
    {"code": "RYAN", "name": "Ryan G.", "store": "Montana", "primary": ""},
    {"code": "SHOPIFY", "name": "Shopify", "store": "Edison", "primary": ""},
    {"code": "CARLOS", "name": "Carlos Galstyan", "store": "Edison", "primary": ""},
    {"code": "DAVE", "name": "Dave", "store": "Edison", "primary": ""},
    {"code": "DEMO", "name": "Demo", "store": "Edison", "primary": ""},
    {"code": "GHAD", "name": "Ghada Slim", "store": "Edison", "primary": ""},
    {"code": "JACOBLEVY", "name": "Jacob Levy", "store": "Edison", "primary": ""},
    {"code": "MARTIN", "name": "MARTIN", "store": "Edison", "primary": ""},
    {"code": "HARRY", "name": "HARRY FERNANDEZ", "store": "NewYork", "primary": ""},
    {"code": "HEMAN", "name": "HEMAN TRAN", "store": "NewYork", "primary": ""},
    {"code": "WILLIAM", "name": "WILLIAM SCHILDER", "store": "NewYork", "primary": ""},
    {"code": "MARY", "name": "Mary Desuza", "store": "Montana", "primary": ""}
]

@app.route("/api/salespersons", methods=["GET"])
def get_salespersons():
    return jsonify(SALESPERSONS_DATA)

# ════════════════════════════════════════
#  CATALOG ITEMS (from pos_invoice_lines)
# ════════════════════════════════════════

@app.route("/api/catalog-items", methods=["GET"])
def get_catalog_items():
    """Fetch distinct items with prices from pos_invoice_lines for item dropdown"""
    try:
        search = request.args.get('search', '')
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if search:
            cursor.execute("""
                SELECT TOP 50
                    catalog_item_code, 
                    item_description, 
                    MAX(item_price) as item_price,
                    MAX(serial_no) as serial_no
                FROM pos_invoice_lines 
                WHERE item_description IS NOT NULL 
                  AND item_description != ''
                  AND (item_description LIKE ? OR catalog_item_code LIKE ? OR serial_no LIKE ?)
                GROUP BY catalog_item_code, item_description
                ORDER BY item_description
            """, (f'%{search}%', f'%{search}%', f'%{search}%'))
        else:
            cursor.execute("""
                SELECT TOP 50
                    catalog_item_code, 
                    item_description, 
                    MAX(item_price) as item_price,
                    MAX(serial_no) as serial_no
                FROM pos_invoice_lines 
                WHERE item_description IS NOT NULL 
                  AND item_description != ''
                GROUP BY catalog_item_code, item_description
                ORDER BY item_description
            """)
        
        items = []
        for row in cursor.fetchall():
            items.append({
                "code": row[0] or '',
                "description": row[1] or '',
                "price": float(row[2]) if row[2] else 0,
                "serial": row[3] or ''
            })
        
        conn.close()
        return jsonify(items)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ════════════════════════════════════════
#  CUSTOMER SALES
# ════════════════════════════════════════

@app.route("/api/customer-sales/<int:customer_id>", methods=["GET"])
def get_customer_sales(customer_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT SUM(net_amt) as total_sales
            FROM pos_invoices
            WHERE customer_id = ?
        """, (customer_id,))
        
        row = cursor.fetchone()
        total_sales = float(row[0]) if row and row[0] else 0.0
        
        conn.close()
        return jsonify({"totalSalesAmount": total_sales})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ════════════════════════════════════════
#  TRANSACTIONS
# ════════════════════════════════════════

@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Fetch latest 100 transactions
        cursor.execute('''
            SELECT 
                t.transactionId as id, t.transactionId as trans_no, t.customerId as customer_id, t.createdAt as trans_date, t.totalAmount as net_amt,
                COALESCE(c.firstName, '') || ' ' || COALESCE(c.lastName, '') as customerName
            FROM Transactions t
            LEFT JOIN Customers c ON t.customerId = c.customerId
            ORDER BY t.createdAt DESC, t.transactionId DESC
            LIMIT 100
        ''')
        
        results = []
        for row in cursor.fetchall():
            results.append({
                "trans": str(row.trans_no).strip() if row.trans_no else str(row.id),
                "customer": f"CUST-{row.customer_id}" if row.customer_id else "Walk-in",
                "name": row.customerName.strip() if row.customerName else "Walk-in Customer",
                "transBk": "SI04",
                "transDate": row.trans_date.strftime("%m/%d/%Y") if row.trans_date else "",
                "netAmt": f"{row.net_amt:,.2f}" if row.net_amt else "0.00"
            })
            
        conn.close()
        return jsonify(results), 200
    except Exception as e:
        print("Error fetching transactions:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/api/transactions/next", methods=["GET"])
def get_next_transaction_id():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(id) FROM pos_invoices")
        max_id = cursor.fetchone()[0]
        conn.close()
        next_id = (max_id or 10000) + 1
        return jsonify({"nextId": next_id})
    except Exception as e:
        print("Error fetching next transaction id:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/api/send_email", methods=["POST"])
def send_email():
    try:
        data = request.json
        email_to = data.get('emailTo')
        invoice_id = data.get('invoiceId')
        
        # Here we would normally use SMTP to send the email with the receipt attached
        print(f"--- MOCK EMAIL SENT to {email_to} for Invoice {invoice_id} ---")
        
        return jsonify({"message": f"Receipt {invoice_id} successfully emailed to {email_to}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/transactions", methods=["POST"])
def create_transaction():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        raw_customer_id = data.get('customerId')
        try:
            customer_id = int(raw_customer_id)
        except (ValueError, TypeError):
            customer_id = None
            
        salesperson = str(data.get('salesperson', ''))[:25]
        cashier = str(data.get('cashier', 'ADMIN'))[:50]
        items = data.get('items', [])
        payments = data.get('payments', [])
        trans_type = data.get('transactionType', 'Sales')
        department = str(data.get('department', 'POS'))[:50]
        sales_category = str(data.get('salesCategory', 'InHouse'))[:50]
        
        now = datetime.now()
        trans_date = now.strftime("%Y-%m-%d %H:%M:%S")

        # Calculate totals from items
        total_item_amt = 0
        total_qty = 0
        for item in items:
            try:
                qty = float(item.get('qty', 1))
            except:
                qty = 1.0
            try:
                price = float(item.get('price', 0))
            except:
                price = 0.0
            total_item_amt += qty * price
            total_qty += qty
        
        tax_per = 6.625
        total_tax_amt = total_item_amt * (tax_per / 100)
        net_amt = total_item_amt + total_tax_amt
        
        # Calculate paid amount from payments
        paid_amt = 0
        for payment in payments:
            try:
                paid_amt += float(payment.get('amount', 0))
            except:
                pass

        # Map trans_type to 1 char
        mapped_trans_type = trans_type[0].upper() if trans_type else 'S'
        mapped_sales_status = 'C' if paid_amt >= net_amt else 'P'

        if trans_type in ['Special Order', 'Repair', 'Quick Repair']:
            # Insert into pos_order instead of pos_invoices
            cursor.execute(
                '''INSERT INTO pos_orders (customer_id, salesperson_code, item_amt, tax_amt, net_amt, paid_amt, balance_amt, order_date, order_status)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (customer_id, salesperson, total_item_amt, total_tax_amt, net_amt, paid_amt, max(0, net_amt - paid_amt), trans_date, 'Pending' if trans_type == 'Special Order' else 'REPAIR')
            )
            order_id = cursor.lastrowid
            custom_trans_no = data.get('transNo')
            if custom_trans_no:
                final_trans_no = str(custom_trans_no)
            else:
                prefix = 'SO' if trans_type == 'Special Order' else 'REP'
                final_trans_no = f"{prefix}-{order_id}"
            cursor.execute("UPDATE pos_orders SET order_no = ?, trans_no = ? WHERE id = ?", (final_trans_no, final_trans_no, order_id))

            for item in items:
                try:
                    qty = float(item.get('qty', 1))
                except:
                    qty = 1.0
                try:
                    price = float(item.get('price', 0))
                except:
                    price = 0.0
                
                details = item.get('specialOrderDetails') or item.get('repairDetails') or {}
                metal_type = str(details.get('metal_type') or details.get('metalType') or '')[:100]
                metal_color = str(details.get('metal_color') or details.get('metalColor') or '')[:100]
                repair_rows = details.get('repairRows')
                if repair_rows:
                    for r_row in repair_rows:
                        r_qty = float(r_row.get('qty', 1))
                        r_price = float(r_row.get('price', 0))
                        cursor.execute(
                            '''INSERT INTO pos_order_lines (order_id, sku, serial_no, item_description, item_qty, item_price, subtotal, category, metal_type, metal_color, purity, finish, ring_size, vendor, trans_no)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                            (order_id, str(r_row.get('laborNo') or item.get('sku', ''))[:100], str(item.get('serial', ''))[:100], 
                             str(r_row.get('desc') or item.get('description', ''))[:max(0, len(str(r_row.get('desc') or item.get('description', ''))))], 
                             r_qty, r_price, r_qty * r_price, 
                             str(r_row.get('category') or item.get('category', ''))[:100],
                             metal_type, metal_color,
                             str(details.get('purity', ''))[:50], str(details.get('finish', ''))[:50],
                             str(details.get('ring_size', ''))[:50], str(details.get('vendor', ''))[:100], final_trans_no)
                        )
                else:
                    cursor.execute(
                        '''INSERT INTO pos_order_lines (order_id, sku, serial_no, item_description, item_qty, item_price, subtotal, category, metal_type, metal_color, purity, finish, ring_size, vendor, trans_no)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                        (order_id, str(item.get('sku', ''))[:100], str(item.get('serial', ''))[:100], 
                         str(item.get('description', ''))[:max(0, len(str(item.get('description', ''))))], 
                         qty, price, qty * price, 
                         str(item.get('category', ''))[:100],
                         metal_type, metal_color,
                         str(details.get('purity', ''))[:50], str(details.get('finish', ''))[:50],
                         str(details.get('ring_size', ''))[:50], str(details.get('vendor', ''))[:100], final_trans_no)
                    )

            for payment in payments:
                try:
                    p_amt = float(payment.get('amount', 0))
                except:
                    p_amt = 0.0
                p_type = 'DEPOSIT' if trans_type in ['Repair', 'Quick Repair'] else str(payment.get('type', 'Cash'))[:100]
                cursor.execute(
                    '''INSERT INTO pos_order_payments (order_id, payment_type, payment_amt, payment_date, trans_no)
                       VALUES (?, ?, ?, ?, ?)''',
                    (order_id, p_type, p_amt, trans_date, final_trans_no)
                )

            conn.commit()
            conn.close()
            return jsonify({
                'message': f'{trans_type} saved successfully in pos_orders',
                'transactionId': order_id,
                'transNo': final_trans_no,
                'itemAmount': total_item_amt,
                'taxAmount': total_tax_amt,
                'netAmount': net_amt,
                'paidAmount': paid_amt
            }), 201
            
        # 1. Insert into pos_invoices
        invoice_data = {
            'company_id': 1,
            'customer_id': customer_id,
            'salesperson_name': salesperson,
            'item_amt': total_item_amt,
            'tax_amt': total_tax_amt,
            'net_amt': net_amt,
            'paid_amt': paid_amt,
            'balance_amt': max(0, net_amt - paid_amt),
            'trans_date': trans_date,
            'sales_status': mapped_sales_status,
            'trans_type': mapped_trans_type,
            'history_flag': 0
        }
        transaction_id = execute_dynamic_insert(cursor, 'pos_invoices', invoice_data, trans_date)
        
        final_trans_no = str(transaction_id)
        cursor.execute("UPDATE pos_invoices SET trans_no = ? WHERE id = ?", (final_trans_no, transaction_id))
        
        # 2. Insert into pos_invoice_lines
        for item in items:
            try:
                qty = float(item.get('qty', 1))
            except:
                qty = 1.0
            try:
                price = float(item.get('price', 0))
            except:
                price = 0.0
                
            line_data = {
                'company_id': 1,
                'pos_invoice_id': transaction_id,
                'sku': str(item.get('sku', '')),
                'item_description': str(item.get('description', '')),
                'item_qty': qty,
                'item_price': price,
                'net_amt': qty * price,
                'trans_date': trans_date,
                'trans_no': final_trans_no,
                'history_flag': 0
            }
            execute_dynamic_insert(cursor, 'pos_invoice_lines', line_data, trans_date)

        # 3. Insert into pos_invoice_payments
        for payment in payments:
            try:
                p_amt = float(payment.get('amount', 0))
            except:
                p_amt = 0.0
            
            payment_data = {
                'company_id': 1,
                'pos_invoice_id': transaction_id,
                'payment_type': str(payment.get('type', 'Cash')),
                'payment_amt': p_amt,
                'payment_date': trans_date,
                'trans_no': final_trans_no,
                'history_flag': 0
            }
            execute_dynamic_insert(cursor, 'pos_invoice_payments', payment_data, trans_date)

        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Transaction saved successfully in POSDB',
            'transactionId': transaction_id,
            'transNo': final_trans_no,
            'itemAmount': total_item_amt,
            'taxAmount': total_tax_amt,
            'netAmount': net_amt,
            'paidAmount': paid_amt
        }), 201
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ════════════════════════════════════════
#  SCHEMA DUMPER
# ════════════════════════════════════════
@app.route("/api/schema", methods=["GET"])
def get_schema():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        tables = ['pos_invoices', 'pos_invoice_lines', 'pos_invoice_payments']
        schema = {}
        for t in tables:
            cursor.execute(f"SELECT TOP 1 * FROM {t}")
            columns = [col[0] for col in cursor.description]
            schema[t] = columns
        return jsonify(schema), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ════════════════════════════════════════
#  REPORTS
# ════════════════════════════════════════

@app.route('/api/reports/split-sales-summary', methods=['GET'])
def split_sales_summary():
    try:
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        report_type = request.args.get('reportType', 'Sales Person')

        conn = get_db_connection()
        cursor = conn.cursor()

        # Determine grouping column based on reportType
        if report_type == 'Clerk':
            group_col_select = "i.cashier_code as GroupName"
            group_col = "i.cashier_code"
        elif report_type == 'Item':
            group_col_select = "l.item_name as GroupName"
            group_col = "l.item_name"
        elif report_type == 'State':
            group_col_select = "i.tax_state as GroupName"
            group_col = "i.tax_state"
        else: # Default to Sales Person
            group_col_select = "i.salesperson_name as GroupName"
            group_col = "i.salesperson_name"

        query = f"""
            SELECT 
                {group_col_select},
                SUM(l.net_amt) as NetSales,
                SUM(l.net_amt - COALESCE(l.item_cost, 0)*COALESCE(l.item_qty, 1)) as Margin
            FROM pos_invoices i
            JOIN pos_invoice_lines l ON i.id = l.pos_invoice_id
            WHERE 1=1
        """
        params = []

        if start_date:
            query += " AND CAST(i.trans_date as DATE) >= ?"
            params.append(start_date)
        if end_date:
            query += " AND CAST(i.trans_date as DATE) <= ?"
            params.append(end_date)

        query += f" GROUP BY {group_col} ORDER BY NetSales DESC"

        cursor.execute(query, params)
        columns = [column[0] for column in cursor.description]
        data = []
        for row in cursor.fetchall():
            row_dict = dict(zip(columns, row))
            group_name = row_dict['GroupName'] if row_dict['GroupName'] else 'UNKNOWN'
            net_sales = float(row_dict['NetSales']) if row_dict['NetSales'] is not None else 0.0
            margin = float(row_dict['Margin']) if row_dict['Margin'] is not None else 0.0
            margin_pct = (margin / net_sales * 100) if net_sales > 0 else 0.0
            
            data.append({
                'GroupName': group_name,
                'NetSales': round(net_sales, 2),
                'Margin': round(margin, 2),
                'MarginPct': round(margin_pct, 2)
            })

        conn.close()
        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        print(f"Error generating split sales summary: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/reports/tender-summary', methods=['GET'])
def tender_summary():
    try:
        target_date = request.args.get('date')
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "SELECT payment_type, SUM(payment_amt) as total FROM pos_invoice_payments WHERE 1=1"
        params = []
        if target_date:
            query += " AND CAST(paid_date as DATE) = ?"
            params.append(target_date)
        query += " GROUP BY payment_type"
        cursor.execute(query, params)
        data = [dict(zip(['payment_type', 'total'], row)) for row in cursor.fetchall()]
        conn.close()
        return jsonify({'status': 'success', 'data': data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/reports/tender-details', methods=['GET'])
def tender_details():
    try:
        payment_type = request.args.get('payment_type')
        target_date = request.args.get('date')
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
        SELECT trans_no, paid_date as trans_date, payment_amt, 
               payment_customer_code as customer_code, 'Sophie Bielders' as customer_name,
               ref_trans_no, ref_trans_date
        FROM pos_invoice_payments 
        WHERE 1=1
        """
        params = []
        if payment_type:
            query += " AND payment_type = ?"
            params.append(payment_type)
        if target_date:
            query += " AND CAST(paid_date as DATE) = ?"
            params.append(target_date)
            
        cursor.execute(query, params)
        columns = [column[0] for column in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        # Format the dates if needed
        for row in data:
            if row.get('trans_date'):
                row['trans_date'] = row['trans_date'].strftime('%m/%d/%Y') if hasattr(row['trans_date'], 'strftime') else row['trans_date']
            if row.get('ref_trans_date'):
                row['ref_trans_date'] = row['ref_trans_date'].strftime('%m/%d/%Y') if hasattr(row['ref_trans_date'], 'strftime') else row['ref_trans_date']
                
        conn.close()
        return jsonify({'status': 'success', 'data': data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ════════════════════════════════════════
#  RUN SERVER
# ════════════════════════════════════════


@app.route('/api/pos_invoices', methods=['GET'])
def get_pos_invoices_raw():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT TOP 50 id, trans_date, customer_id, salesperson, net_amt FROM pos_invoices ORDER BY id DESC')
        columns = [column[0] for column in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conn.close()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/pos_invoice_payments', methods=['GET'])
def get_pos_invoice_payments_raw():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT TOP 50 id, pos_invoice_id, payment_type, payment_amt, credit_card_last_four_digits, check_no FROM pos_invoice_payments ORDER BY id DESC')
        columns = [column[0] for column in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conn.close()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/special-orders', methods=['POST'])
def create_special_order():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Insert main special order
        cursor.execute(
            """
            INSERT INTO pos_special_orders 
            (invoice_id, trans_no, sku, serial, description, price, qty, category, metal_type, metal_color, purity, finish, ring_size, status, vendor, special_instructions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                data.get('invoice_id'), data.get('trans_no'), data.get('sku'), data.get('serial'), 
                data.get('description'), data.get('price', 0.0), data.get('qty', 1), data.get('category'),
                data.get('metal_type'), data.get('metal_color'), data.get('purity'), data.get('finish'),
                data.get('ring_size'), data.get('status'), data.get('vendor'), data.get('special_instructions')
            )
        )
        so_id = cursor.lastrowid
        
        # Insert components
        components = data.get('components', [])
        for comp in components:
            c_price = float(comp.get('price') or 0.0)
            c_qty = int(comp.get('qty') or 1)
            c_total = float(comp.get('total_price') or 0.0)
            
            cursor.execute(
                """
                INSERT INTO pos_special_order_components
                (special_order_id, component_type, component_desc, qty, price, total_price)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    so_id, comp.get('type'), comp.get('desc'), c_qty, 
                    c_price, c_total
                )
            )
            
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Special order created successfully', 'id': so_id}), 201
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/repairs', methods=['POST'])
def save_repair():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()

        order_date = datetime.now()
        
        # Use existing order_no if provided, otherwise generate one
        order_no = data.get('order_no', f"REP-{int(order_date.timestamp())}")
        
        # We will use order_no as the trans_no across all tables for repairs
        trans_no = data.get('trans_no') or order_no

        cursor.execute(
            """
            INSERT INTO pos_orders
            (order_no, customer_id, salesperson_code, item_amt, tax_amt, net_amt, paid_amt, balance_amt, order_date, order_status, special_instructions, created_at, trans_no)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                order_no,
                data.get('customer_id', 1),
                data.get('salesperson', 'DEMO'),
                float(data.get('item_amt', 0)),
                float(data.get('tax_amt', 0)),
                float(data.get('net_amt', 0)),
                float(data.get('paid_amt', 0)),
                float(data.get('balance_amt', 0)),
                order_date,
                'REPAIR',
                data.get('special_instructions', ''),
                order_date,
                trans_no
            )
        )
        order_id = cursor.lastrowid

        repair_rows = data.get('repairRows', [])
        for row in repair_rows:
            cursor.execute(
                """
                INSERT INTO pos_order_lines
                (order_id, sku, item_description, item_qty, item_price, subtotal, category, vendor, metal_type, metal_color, purity, finish, ring_size, trans_no)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    order_id,
                    row.get('laborNo', 'REPAIR')[:100],
                    row.get('desc', 'Repair Labor')[:100],
                    int(row.get('qty', 1)),
                    float(row.get('price', 0)),
                    float(row.get('ext', 0)),
                    row.get('category', '')[:100],
                    data.get('vendor', '')[:100],
                    data.get('metal_type', '')[:100],
                    data.get('metal_color', '')[:100],
                    data.get('purity', '')[:50],
                    data.get('finish', '')[:50],
                    data.get('ring_size', '')[:50],
                    trans_no[:100]
                )
            )

        cursor.execute(
            """
            INSERT INTO pos_order_payments
            (order_id, payment_type, payment_amt, payment_date, trans_no)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                order_id,
                'DEPOSIT',
                float(data.get('paid_amt', 0)),
                order_date,
                trans_no[:100]
            )
        )

        conn.commit()
        conn.close()
        return jsonify({'message': 'Repair saved successfully', 'order_id': order_id, 'trans_no': trans_no}), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/db/repair_orders', methods=['GET'])
def get_repair_orders():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM pos_orders WHERE order_status = 'REPAIR'")
        data = rows_to_dicts(cursor)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/db/repair_lines', methods=['GET'])
def get_repair_lines():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT l.* FROM pos_order_lines l JOIN pos_orders o ON l.order_id = o.id WHERE o.order_status = 'REPAIR'")
        data = rows_to_dicts(cursor)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/db/repair_payments', methods=['GET'])
def get_repair_payments():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT p.id, p.order_id, p.payment_type, p.payment_amt, p.payment_date, p.trans_no, o.balance_amt FROM pos_order_payments p JOIN pos_orders o ON p.order_id = o.id WHERE o.order_status = 'REPAIR'")
        data = rows_to_dicts(cursor)
        conn.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500






@app.route('/api/reports/closed-sales', methods=['GET'])
def closed_sales_report():
    try:
        sales_start = request.args.get('salesStart')
        sales_end = request.args.get('salesEnd')
        customer_start = request.args.get('customerStart')
        customer_end = request.args.get('customerEnd')
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        report_type = request.args.get('reportType', 'Sales Report')

        conn = get_db_connection()
        cursor = conn.cursor()

        params = []
        if report_type == 'Sales With Breakup':
            query = """
                SELECT 
                    i.trans_no, 
                    CAST(i.trans_date AS DATE) as trans_date, 
                    i.customer_code, 
                    i.net_amt, 
                    i.tax_amt, 
                    (COALESCE(i.net_amt, 0) + COALESCE(i.tax_amt, 0)) as gross_amt,
                    p.payment_type, 
                    p.payment_amt
                FROM pos_invoices i
                LEFT JOIN pos_invoice_payments p ON i.id = p.pos_invoice_id
                WHERE 1=1
            """
        else:
            query = """
                SELECT 
                    i.trans_no, 
                    CAST(i.trans_date AS DATE) as trans_date, 
                    i.customer_code, 
                    i.net_amt, 
                    i.tax_amt, 
                    (COALESCE(i.net_amt, 0) + COALESCE(i.tax_amt, 0)) as gross_amt
                FROM pos_invoices i
                WHERE 1=1
            """

        if sales_start and sales_end:
            query += " AND i.trans_no >= ? AND i.trans_no <= ?"
            params.extend([sales_start, sales_end])
            
        if customer_start and customer_end:
            query += " AND i.customer_code >= ? AND i.customer_code <= ?"
            params.extend([customer_start, customer_end])

        if start_date and end_date:
            query += " AND CAST(i.trans_date as DATE) >= ? AND CAST(i.trans_date as DATE) <= ?"
            params.extend([start_date, end_date])

        query += " ORDER BY i.trans_no DESC"

        cursor.execute(query, params)
        columns = [column[0] for column in cursor.description]
        data = []
        for row in cursor.fetchall():
            row_dict = dict(zip(columns, row))
            # Format numbers properly
            for k in ['net_amt', 'tax_amt', 'gross_amt', 'payment_amt']:
                if k in row_dict:
                    row_dict[k] = float(row_dict[k]) if row_dict[k] is not None else 0.0
            
            # Format dates
            if 'trans_date' in row_dict and row_dict['trans_date']:
                row_dict['trans_date'] = row_dict['trans_date'].strftime('%Y-%m-%d')
                
            data.append(row_dict)

        conn.close()
        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        print(f"Error generating closed sales report: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


# PAYMENT REPORT
# ════════════════════════════════════════

@app.route('/api/reports/payments', methods=['GET'])
def payments_report():
    try:
        start_date = request.args.get('startDate')
        end_date = request.args.get('endDate')
        report_type = request.args.get('reportType', 'Summary')

        conn = get_db_connection()
        cursor = conn.cursor()

        # Helper mapping from raw DB type to Friendly Type
        def map_friendly_type(raw_type):
            raw = str(raw_type).upper()
            if raw == 'CASH': return 'Cash'
            if raw in ('CHCK', 'CHECK'): return 'Check'
            if raw in ('CC', 'CREDIT CARD'): return 'Credit Card'
            if raw == 'GIFT CARD': return 'Gift Certificate'
            if raw == 'FINANCE': return 'Finance'
            if raw == 'ONAC': return 'Store Credit'
            return str(raw_type)

        # Mapping from Friendly Type to tuple of raw DB types for filtering
        type_filters = {
            'Cash': ('CASH',),
            'Check': ('CHCK', 'Check'),
            'Credit Card': ('CC', 'Credit Card'),
            'Gift Certificate': ('Gift Card',),
            'Finance': ('Finance',),
            'Store Credit': ('ONAC',)
        }

        params = []
        base_where = "WHERE 1=1"
        if start_date:
            base_where += " AND CAST(trans_date as DATE) >= ?"
            params.append(start_date)
        if end_date:
            base_where += " AND CAST(trans_date as DATE) <= ?"
            params.append(end_date)

        if report_type == 'Summary':
            # Group by payment_type
            query = f"SELECT payment_type, SUM(payment_amt) as TotalAmount FROM pos_invoice_payments {base_where} GROUP BY payment_type"
            cursor.execute(query, params)
            data = []
            
            # Since multiple raw types can map to one friendly type, we aggregate them in python
            summary_dict = {}
            for row in cursor.fetchall():
                raw_type = row[0]
                amount = float(row[1]) if row[1] else 0.0
                friendly = map_friendly_type(raw_type)
                if friendly not in summary_dict:
                    summary_dict[friendly] = 0.0
                summary_dict[friendly] += amount
            
            for k, v in summary_dict.items():
                data.append({'PaymentType': k, 'TotalAmount': round(v, 2)})
            
            data.sort(key=lambda x: x['TotalAmount'], reverse=True)

        else:
            # Detail or Specific Type
            if report_type != 'Detail' and report_type in type_filters:
                allowed_types = type_filters[report_type]
                placeholders = ','.join(['?'] * len(allowed_types))
                base_where += f" AND payment_type IN ({placeholders})"
                params.extend(allowed_types)

            query = f"SELECT trans_no, trans_date, pos_invoice_id, payment_type, payment_amt, payment_customer_id FROM pos_invoice_payments {base_where} ORDER BY trans_date DESC"
            cursor.execute(query, params)
            columns = [column[0] for column in cursor.description]
            data = []
            for row in cursor.fetchall():
                row_dict = dict(zip(columns, row))
                
                trans_date_str = ""
                if row_dict['trans_date']:
                    trans_date_str = row_dict['trans_date'].strftime('%Y-%m-%d')
                
                data.append({
                    'TransNo': row_dict['trans_no'] or '',
                    'TransDate': trans_date_str,
                    'InvoiceNo': row_dict['pos_invoice_id'] or '',
                    'PaymentType': map_friendly_type(row_dict['payment_type']),
                    'Amount': round(float(row_dict['payment_amt'] or 0.0), 2),
                    'CustomerNo': row_dict['payment_customer_id'] or ''
                })

        conn.close()
        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        print("Error in payments_report:", str(e))
        return jsonify({'status': 'error', 'message': str(e)}), 500


# TAX REPORT
# ════════════════════════════════════════

@app.route('/api/reports/tax', methods=['GET'])
def tax_report():
    try:
        store_start = request.args.get('storeStart')
        store_end = request.args.get('storeEnd')
        ac_start = request.args.get('acPeriodStart')
        ac_end = request.args.get('acPeriodEnd')
        sales_date_start = request.args.get('salesDateStart')
        sales_date_end = request.args.get('salesDateEnd')
        sales_no_start = request.args.get('salesNoStart')
        sales_no_end = request.args.get('salesNoEnd')
        customer_start = request.args.get('customerStart')
        customer_end = request.args.get('customerEnd')
        report_format = request.args.get('reportFormat', 'By TaxLocation')

        conn = get_db_connection()
        cursor = conn.cursor()

        params = []
        base_where = "WHERE 1=1"
        
        # Store #
        if store_start and store_end:
            base_where += " AND store_code >= ? AND store_code <= ?"
            params.extend([store_start, store_end])
            
        # Sales Date
        if sales_date_start and sales_date_end:
            base_where += " AND CAST(trans_date as DATE) >= ? AND CAST(trans_date as DATE) <= ?"
            params.extend([sales_date_start, sales_date_end])
            
        # Sales # (trans_no)
        if sales_no_start and sales_no_end and sales_no_end != 'zzzz':
            base_where += " AND trans_no >= ? AND trans_no <= ?"
            params.extend([sales_no_start, sales_no_end])
            
        # Customer #
        if customer_start and customer_end and customer_end != 'zzzz':
            base_where += " AND customer_code >= ? AND customer_code <= ?"
            params.extend([customer_start, customer_end])

        if report_format == 'By TaxLocation':
            query = f"""
                SELECT 
                    tax_state, 
                    tax_code, 
                    SUM(net_amt) as NetSales, 
                    SUM(tax_amt) as TaxAmount
                FROM pos_invoices 
                {base_where} 
                GROUP BY tax_state, tax_code
                ORDER BY tax_state, tax_code
            """
            cursor.execute(query, params)
            data = []
            for row in cursor.fetchall():
                t_state = row[0] if row[0] else ''
                t_code = row[1] if row[1] else ''
                net_sales = float(row[2]) if row[2] else 0.0
                tax_amt = float(row[3]) if row[3] else 0.0
                gross_amt = net_sales + tax_amt
                
                data.append({
                    'TaxState': t_state,
                    'TaxCode': t_code,
                    'NetSales': round(net_sales, 2),
                    'TaxAmount': round(tax_amt, 2),
                    'GrossAmount': round(gross_amt, 2)
                })

        conn.close()
        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        print("Error in tax_report:", str(e))
        return jsonify({'status': 'error', 'message': str(e)}), 500


# OPEN ORDER REPORT
# ════════════════════════════════════════

@app.route('/api/reports/open-orders', methods=['GET'])
def open_orders_report():
    try:
        order_start = request.args.get('orderStart')
        order_end = request.args.get('orderEnd')
        customer_start = request.args.get('customerStart')
        customer_end = request.args.get('customerEnd')
        trans_date_start = request.args.get('transDateStart')
        trans_date_end = request.args.get('transDateEnd')

        conn = get_db_connection()
        cursor = conn.cursor()

        params = []
        base_where = "WHERE 1=1"
        
        # Order #
        if order_start and order_end and order_end != 'zzzz':
            base_where += " AND order_no >= ? AND order_no <= ?"
            params.extend([order_start, order_end])
            
        # Customer #
        if customer_start and customer_end and customer_end != 'zzzz':
            base_where += " AND customer_id >= ? AND customer_id <= ?"
            params.extend([customer_start, customer_end])

        # Trans Date (order_date)
        if trans_date_start and trans_date_end:
            base_where += " AND CAST(order_date as DATE) >= ? AND CAST(order_date as DATE) <= ?"
            params.extend([trans_date_start, trans_date_end])
            
        query = f"""
            SELECT 
                order_no, 
                order_date, 
                customer_id, 
                salesperson_code, 
                net_amt, 
                balance_amt, 
                order_status
            FROM pos_orders 
            {base_where} 
            ORDER BY order_date DESC
        """
        cursor.execute(query, params)
        data = []
        for row in cursor.fetchall():
            o_date = row[1].strftime('%Y-%m-%d') if row[1] else ''
            net_amt = float(row[4]) if row[4] else 0.0
            bal_amt = float(row[5]) if row[5] else 0.0
            
            data.append({
                'OrderNo': row[0] or '',
                'OrderDate': o_date,
                'CustomerID': row[2] or '',
                'Salesperson': row[3] or '',
                'NetAmount': round(net_amt, 2),
                'BalanceAmount': round(bal_amt, 2),
                'Status': row[6] or ''
            })

        conn.close()
        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        print("Error in open_orders_report:", str(e))
        return jsonify({'status': 'error', 'message': str(e)}), 500


# CUSTOMER RANKING REPORT
# ════════════════════════════════════════

@app.route('/api/reports/customer-ranking', methods=['GET'])
def customer_ranking_report():
    try:
        req_date = request.args.get('date')
        report_format = request.args.get('reportFormat', 'Customer Ranking MTD')
        top_limit = int(request.args.get('top', 25))

        if not req_date:
            req_date = datetime.now().strftime('%Y-%m-%d')
            
        dt_obj = datetime.strptime(req_date, '%Y-%m-%d')

        if 'MTD' in report_format:
            start_date = dt_obj.replace(day=1).strftime('%Y-%m-%d')
            end_date = req_date
        else:
            # YTD
            start_date = dt_obj.replace(month=1, day=1).strftime('%Y-%m-%d')
            end_date = req_date

        conn = get_db_connection()
        cursor = conn.cursor()

        query = f"""
            SELECT TOP {top_limit} 
                customer_code,
                SUM(net_amt) as TotalSales
            FROM pos_invoices
            WHERE CAST(trans_date as DATE) >= ? AND CAST(trans_date as DATE) <= ?
            GROUP BY customer_code
            ORDER BY TotalSales DESC
        """
        
        cursor.execute(query, [start_date, end_date])
        data = []
        rank = 1
        for row in cursor.fetchall():
            c_code = row[0] if row[0] else 'Unknown'
            total_sales = float(row[1]) if row[1] else 0.0
            
            data.append({
                'Rank': rank,
                'CustomerCode': c_code,
                'TotalSales': round(total_sales, 2)
            })
            rank += 1

        conn.close()
        return jsonify({'status': 'success', 'data': data})

    except Exception as e:
        print("Error in customer_ranking_report:", str(e))
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/end-of-day-closeout', methods=['POST'])
def save_end_of_day_closeout():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
        INSERT INTO EndOfDayCloseout (
            date, total_100, total_50, total_20, total_10, total_5, total_1, 
            total_0_25, total_0_10, total_0_05, total_0_01, additional_cash, 
            total_cash, opening_amount, cash_deposit, check_deposit, 
            bank_deposit_total, over_short
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        from datetime import datetime
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        params = (
            current_date,
            data.get('d100', 0), data.get('d50', 0), data.get('d20', 0), data.get('d10', 0),
            data.get('d5', 0), data.get('d1', 0), data.get('c25', 0), data.get('c10', 0),
            data.get('c5', 0), data.get('c1', 0), data.get('additionalCash', 0),
            data.get('totalCash', 0), data.get('openingAmount', 0), data.get('cashDeposit', 0),
            data.get('checkDeposit', 0), data.get('bankDepositTotal', 0), data.get('overShort', 0)
        )
        
        cursor.execute(query, params)
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'message': 'End of Day Closeout saved successfully'})

    except Exception as e:
        print("Error saving closeout:", str(e))
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ════════════════════════════════════════
#  CUSTOMER TABS API ENDPOINTS
# ════════════════════════════════════════

def get_customer_tab_data(table_name, customer_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = f"SELECT * FROM {table_name} WHERE customerId = ?"
        cursor.execute(query, (customer_id,))
        data = rows_to_dicts(cursor)
        conn.close()
        return jsonify({"success": True, "data": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/customers/<customer_id>/purchases", methods=["GET"])
def get_customer_purchases(customer_id):
    return get_customer_tab_data('Purchases', customer_id)

@app.route("/api/customers/<customer_id>/appraisals", methods=["GET"])
def get_customer_appraisals(customer_id):
    return get_customer_tab_data('Appraisals', customer_id)

@app.route("/api/customers/<customer_id>/receivables", methods=["GET"])
def get_customer_receivables(customer_id):
    return get_customer_tab_data('Receivables', customer_id)

@app.route("/api/customers/<customer_id>/wishlist", methods=["GET"])
def get_customer_wishlist(customer_id):
    return get_customer_tab_data('Wishlists', customer_id)

@app.route("/api/customers/<customer_id>/orders", methods=["GET"])
def get_customer_orders(customer_id):
    # Using the existing Orders table but matching customer name if customerId doesn't exist
    # For simplicity here, assuming we created a specific Orders mapping or just using Orders table
    return get_customer_tab_data('Orders', customer_id)

@app.route("/api/customers/<customer_id>/repairs", methods=["GET"])
def get_customer_repairs(customer_id):
    return get_customer_tab_data('Repairs', customer_id)

@app.route("/api/customers/<customer_id>/family", methods=["GET"])
def get_customer_family(customer_id):
    return get_customer_tab_data('FamilyMembers', customer_id)

@app.route("/api/customers/<customer_id>/family-transactions", methods=["GET"])
def get_customer_family_transactions(customer_id):
    return get_customer_tab_data('FamilyTransactions', customer_id)

@app.route("/api/customers/<customer_id>/gift-cards", methods=["GET"])
def get_customer_gift_cards(customer_id):
    return get_customer_tab_data('GiftCards', customer_id)

@app.route("/api/customers/<customer_id>/gift-certificates", methods=["GET"])
def get_customer_gift_certificates(customer_id):
    return get_customer_tab_data('GiftCertificates', customer_id)


if __name__ == "__main__":
    print("=" * 50)
    print("  Diaspark Retail Python Backend")
    print("  Running on http://localhost:5001")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5001, debug=True)


@app.route("/api/interests", methods=["GET"])
def get_interests():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT code, name FROM Interests")
    rows = rows_to_dicts(cursor)
    conn.close()
    return jsonify(rows)
