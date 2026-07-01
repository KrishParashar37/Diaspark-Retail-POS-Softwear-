from fastapi import APIRouter, HTTPException
from database import get_db
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()


class ReturnExchangeCreate(BaseModel):
    original_invoice: str
    customer_name:    str
    type:             Optional[str] = "Return"   # Return or Exchange
    reason:           str
    product_name:     str
    sku:              Optional[str] = ""
    quantity:         Optional[int] = 1
    refund_amount:    Optional[float] = 0.0


# ── GET all ────────────────────────────────────────────────────────
@router.get("/")
def get_all():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ReturnExchange ORDER BY createdAt DESC")
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


# ── GET single ────────────────────────────────────────────────────
@router.get("/{rma_id}")
def get_one(rma_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM ReturnExchange WHERE id = ?", rma_id)
        columns = [col[0] for col in cursor.description]
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Record not found")
        return dict(zip(columns, row))


# ── CREATE ─────────────────────────────────────────────────────────
@router.post("/", status_code=201)
def create_return(data: ReturnExchangeCreate):
    rma_no = f"RMA-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO ReturnExchange (rmaNo, originalInvoice, customerName, type, reason, productName, sku, quantity, refundAmount, status, createdAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', GETDATE())""",
            rma_no, data.original_invoice, data.customer_name, data.type,
            data.reason, data.product_name, data.sku, data.quantity, data.refund_amount
        )
        cursor.execute("SELECT @@IDENTITY")
        new_id = int(cursor.fetchone()[0])
    return {"id": new_id, "rma_no": rma_no, "status": "Pending"}


# ── APPROVE ────────────────────────────────────────────────────────
@router.patch("/{rma_id}/approve")
def approve(rma_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE ReturnExchange SET status = 'Approved' WHERE id = ?", rma_id)
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Record not found")
    return {"id": rma_id, "status": "Approved"}


# ── REJECT ─────────────────────────────────────────────────────────
@router.patch("/{rma_id}/reject")
def reject(rma_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE ReturnExchange SET status = 'Rejected' WHERE id = ?", rma_id)
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Record not found")
    return {"id": rma_id, "status": "Rejected"}
