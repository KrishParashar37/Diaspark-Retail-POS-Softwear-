from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ─────────────────────────────────────────────────────────────────
# Apna SQL Server / MySQL / PostgreSQL connection string yahan lagao
# ─────────────────────────────────────────────────────────────────

# SQL Server (MSSQL) example:
# SQLALCHEMY_DATABASE_URL = "mssql+pyodbc://username:password@server_name/database_name?driver=ODBC+Driver+17+for+SQL+Server"

# MySQL example:
# SQLALCHEMY_DATABASE_URL = "mysql+pymysql://username:password@localhost:3306/database_name"

# PostgreSQL example:
# SQLALCHEMY_DATABASE_URL = "postgresql://username:password@localhost:5432/database_name"

# ── Yahan apni connection string daalo ──
import urllib
# Using urllib to quote password because it contains '@'
params = urllib.parse.quote_plus("Driver={SQL Server Native Client 11.0};Server=DBSRV2025;Database=POSDB;UID=retail;PWD=retail@1234;")
SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc:///?odbc_connect={params}"

# ─────────────────────────────────────────────────────────────────
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency — har route mein use karo
def get_db():
    # Return raw connection because routers use conn.cursor()
    conn = engine.raw_connection()
    try:
        yield conn
    finally:
        conn.close()
