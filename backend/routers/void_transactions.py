from fastapi import APIRouter, HTTPException
from database import get_db
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()


class VoidCreate(BaseModel):
    original_invoice: str
    customer_name:    Optional[str] = ""
    amount:           float
    reason:           str
    voided_by:        Optional[str] = "POS"


# ── GET all void transactions ──────────────────────────────────────
@router.get("/")
def get_all():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM VoidTransactions ORDER BY createdAt DESC")
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


# ── GET single ────────────────────────────────────────────────────
@router.get("/{void_id}")
def get_one(void_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM VoidTransactions WHERE id = ?", void_id)
        columns = [col[0] for col in cursor.description]
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Void transaction not found")
        return dict(zip(columns, row))


# ── VOID a transaction ─────────────────────────────────────────────
@router.post("/", status_code=201)
def void_transaction(data: VoidCreate):
    with get_db() as conn:
        cursor = conn.cursor()
        # Check duplicate
        cursor.execute(
            "SELECT id, voidNo FROM VoidTransactions WHERE originalInvoice = ?",
            data.original_invoice
        )
        existing = cursor.fetchone()
        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"Invoice {data.original_invoice} already voided (Void No: {existing[1]})"
            )
        void_no = f"VD-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        cursor.execute(
            """INSERT INTO VoidTransactions (voidNo, originalInvoice, customerName, amount, reason, voidedBy, status, createdAt)
               VALUES (?, ?, ?, ?, ?, ?, 'Voided', GETDATE())""",
            void_no, data.original_invoice, data.customer_name,
            data.amount, data.reason, data.voided_by
        )
        cursor.execute("SELECT @@IDENTITY")
        new_id = int(cursor.fetchone()[0])
    return {"id": new_id, "void_no": void_no, "status": "Voided"}


# ── TODAY summary ──────────────────────────────────────────────────
@router.get("/filter/today")
def today_voids():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """SELECT COUNT(*) as cnt, ISNULL(SUM(amount),0) as total
               FROM VoidTransactions
               WHERE CAST(createdAt AS DATE) = CAST(GETDATE() AS DATE)"""
        )
        row = cursor.fetchone()
        return {"total_voided": row[0], "total_amount": round(row[1], 2)}
