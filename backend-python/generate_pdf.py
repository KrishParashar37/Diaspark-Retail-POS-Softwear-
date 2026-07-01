import sqlite3
from fpdf import FPDF

def generate_database_pdf():
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    # Title
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(200, 10, txt="DIASPARK UI - Database Structure & Data", ln=True, align='C')
    pdf.ln(10)

    conn = sqlite3.connect('pos.db')
    cursor = conn.cursor()

    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    tables = [row[0] for row in cursor.fetchall()]

    for table in tables:
        # Table Header
        pdf.set_font("Arial", 'B', 14)
        pdf.set_text_color(0, 51, 102)
        pdf.cell(200, 10, txt=f"Table: {table}", ln=True)
        
        # Get schema
        cursor.execute(f"PRAGMA table_info({table})")
        columns = cursor.fetchall()
        
        pdf.set_font("Arial", 'B', 10)
        pdf.set_text_color(0, 0, 0)
        pdf.cell(200, 8, txt="Columns:", ln=True)
        pdf.set_font("Arial", '', 10)
        for col in columns:
            pdf.cell(200, 6, txt=f"   - {col[1]} ({col[2]})", ln=True)
            
        pdf.ln(5)
        
        # Get Data
        cursor.execute(f"SELECT * FROM {table}")
        rows = cursor.fetchall()
        
        pdf.set_font("Arial", 'B', 10)
        pdf.cell(200, 8, txt=f"Data ({len(rows)} records):", ln=True)
        pdf.set_font("Courier", '', 8)
        
        # Print a max of 20 rows per table to keep it clean
        for row in rows[:20]:
            row_str = " | ".join([str(val) if val is not None else "NULL" for val in row])
            # Handle long lines
            if len(row_str) > 90:
                row_str = row_str[:87] + "..."
            pdf.cell(200, 5, txt=row_str.encode('latin-1', 'replace').decode('latin-1'), ln=True)
            
        if len(rows) > 20:
            pdf.cell(200, 5, txt=f"   ... and {len(rows) - 20} more records.", ln=True)
            
        pdf.ln(10)

    conn.close()
    
    # Save the pdf
    output_path = "../Database_Documentation.pdf"
    pdf.output(output_path)
    print(f"PDF successfully generated at {output_path}")

if __name__ == '__main__':
    generate_database_pdf()
