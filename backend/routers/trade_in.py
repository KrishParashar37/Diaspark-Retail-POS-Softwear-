from fastapi import APIRouter, HTTPException
from database import get_db
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()


class TradeInCreate(BaseModel):
    customer_name:    str
    customer_phone:   Optional[str] = ""
    item_name:        str
    item_description: Optional[str] = ""
    condition:        Optional[str] = "Good"   # Excellent/Good/Fair/Poor
    offered_value:    Optional[float] = 0.0
    notes:            Optional[str] = ""

class TradeInUpdate(BaseModel):
    final_value: Optional[float] = None
    status:      Optional[str] = None


# ── GET all ────────────────────────────────────────────────────────
@router.get("/")
def get_all():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM TradeIn ORDER BY createdAt DESC")
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


# ── GET single ────────────────────────────────────────────────────
@router.get("/{trade_id}")
def get_one(trade_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM TradeIn WHERE id = ?", trade_id)
        columns = [col[0] for col in cursor.description]
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Trade-in not found")
        return dict(zip(columns, row))


# ── CREATE ─────────────────────────────────────────────────────────
@router.post("/", status_code=201)
def create_tradein(data: TradeInCreate):
    trade_no = f"TRD-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO TradeIn (tradeNo, customerName, customerPhone, itemName, itemDescription, condition, offeredValue, finalValue, notes, status, createdAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, 0.0, ?, 'Pending', GETDATE())""",
            trade_no, data.customer_name, data.customer_phone, data.item_name,
            data.item_description, data.condition, data.offered_value, data.notes
        )
        cursor.execute("SELECT @@IDENTITY")
        new_id = int(cursor.fetchone()[0])
    return {"id": new_id, "trade_no": trade_no, "status": "Pending"}


# ── UPDATE final value / status ────────────────────────────────────
@router.patch("/{trade_id}")
def update_tradein(trade_id: int, data: TradeInUpdate):
    with get_db() as conn:
        cursor = conn.cursor()
        if data.final_value is not None:
            cursor.execute("UPDATE TradeIn SET finalValue = ? WHERE id = ?", data.final_value, trade_id)
        if data.status is not None:
            if data.status not in ["Pending", "Approved", "Completed", "Rejected"]:
                raise HTTPException(status_code=400, detail="Invalid status")
            cursor.execute("UPDATE TradeIn SET status = ? WHERE id = ?", data.status, trade_id)
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Trade-in not found")
    return {"id": trade_id, "message": "Updated"}


# ── APPROVE ────────────────────────────────────────────────────────
@router.patch("/{trade_id}/approve")
def approve(trade_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE TradeIn SET status = 'Approved' WHERE id = ?", trade_id)
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Trade-in not found")
    return {"id": trade_id, "status": "Approved"}


# ── COMPLETE ───────────────────────────────────────────────────────
@router.patch("/{trade_id}/complete")
def complete(trade_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT status FROM TradeIn WHERE id = ?", trade_id)
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Trade-in not found")
        if row[0] != "Approved":
            raise HTTPException(status_code=400, detail="Must be Approved first")
        cursor.execute("UPDATE TradeIn SET status = 'Completed' WHERE id = ?", trade_id)
    return {"id": trade_id, "status": "Completed"}
