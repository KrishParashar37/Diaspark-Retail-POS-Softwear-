from fastapi import APIRouter, HTTPException
from database import get_db
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter()


class SaleItemIn(BaseModel):
    product_name: str
    sku:          Optional[str] = ""
    quantity:     int
    unit_price:   float
    total_price:  float

class SaleCreate(BaseModel):
    customer_name: Optional[str] = "Walk-in Customer"
    items:         List[SaleItemIn]
    discount:      Optional[float] = 0.0
    tax:           Optional[float] = 0.0
    payment_mode:  Optional[str] = "Cash"
    notes:         Optional[str] = ""


# ── GET all sales ──────────────────────────────────────────────────
@router.get("/")
def get_sales():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Sales ORDER BY createdAt DESC")
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
        return [dict(zip(columns, row)) for row in rows]


# ── GET single sale ────────────────────────────────────────────────
@router.get("/{sale_id}")
def get_sale(sale_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Sales WHERE id = ?", sale_id)
        columns = [col[0] for col in cursor.description]
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Sale not found")
        return dict(zip(columns, row))


# ── CREATE sale ────────────────────────────────────────────────────
@router.post("/", status_code=201)
def create_sale(data: SaleCreate):
    subtotal = sum(i.total_price for i in data.items)
    total    = round(subtotal - data.discount + data.tax, 2)
    invoice  = f"INV-{datetime.now().strftime('%Y%m%d%H%M%S')}"

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO Sales (invoiceNo, customerName, totalAmount, discount, tax, paymentMode, notes, status, createdAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, 'Completed', GETDATE())""",
            invoice, data.customer_name, total, data.discount, data.tax, data.payment_mode, data.notes
        )
        cursor.execute("SELECT @@IDENTITY")
        sale_id = int(cursor.fetchone()[0])

        for item in data.items:
            cursor.execute(
                """INSERT INTO SaleItems (saleId, productName, sku, quantity, unitPrice, totalPrice)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                sale_id, item.product_name, item.sku, item.quantity, item.unit_price, item.total_price
            )

    return {"id": sale_id, "invoice_no": invoice, "total_amount": total, "status": "Completed"}


# ── TODAY summary ──────────────────────────────────────────────────
@router.get("/summary/today")
def sales_summary():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT COUNT(*) as cnt, ISNULL(SUM(totalAmount),0) as total FROM Sales WHERE CAST(createdAt AS DATE) = CAST(GETDATE() AS DATE)"
        )
        row = cursor.fetchone()
        return {"total_sales": row[0], "total_amount": round(row[1], 2)}
