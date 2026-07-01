from fastapi import APIRouter, HTTPException, Query
from database import get_db
from typing import Optional

router = APIRouter()


# ── GET all customers ──────────────────────────────────────────────
@router.get("/")
def get_customers():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Customers")
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
        return [dict(zip(columns, row)) for row in rows]


# ── SEARCH customers ───────────────────────────────────────────────
@router.get("/search")
def search_customers(
    keywords:  Optional[str] = Query(None),
    firstName: Optional[str] = Query(None),
    lastName:  Optional[str] = Query(None),
    city:      Optional[str] = Query(None),
    state:     Optional[str] = Query(None),
    zip:       Optional[str] = Query(None),
    address:   Optional[str] = Query(None),
    email:     Optional[str] = Query(None),
    phone:     Optional[str] = Query(None),
):
    conditions = []
    params = []

    if keywords:
        conditions.append(
            "(firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR mobile LIKE ?)"
        )
        kw = f"%{keywords}%"
        params += [kw, kw, kw, kw]
    if firstName:
        conditions.append("firstName LIKE ?")
        params.append(f"%{firstName}%")
    if lastName:
        conditions.append("lastName LIKE ?")
        params.append(f"%{lastName}%")
    if city:
        conditions.append("city LIKE ?")
        params.append(f"%{city}%")
    if state:
        conditions.append("stateName LIKE ?")
        params.append(f"%{state}%")
    if zip:
        conditions.append("zipCode LIKE ?")
        params.append(f"%{zip}%")
    if address:
        conditions.append("addressLine LIKE ?")
        params.append(f"%{address}%")
    if email:
        conditions.append("email LIKE ?")
        params.append(f"%{email}%")
    if phone:
        conditions.append("mobile LIKE ?")
        params.append(f"%{phone}%")

    query = "SELECT * FROM Customers"
    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
        return [dict(zip(columns, row)) for row in rows]


# ── GET single customer ────────────────────────────────────────────
@router.get("/{customer_id}")
def get_customer(customer_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Customers WHERE customerId = ?", customer_id)
        columns = [col[0] for col in cursor.description]
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Customer not found")
        return dict(zip(columns, row))
