from fastapi import APIRouter, HTTPException
from database import get_db
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class WishlistCreate(BaseModel):
    customer_name: str
    product_name:  str
    sku:           Optional[str] = ""
    price:         Optional[float] = 0.0
    notes:         Optional[str] = ""


# ── GET all wishlist items ─────────────────────────────────────────
@router.get("/")
def get_wishlist():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Wishlist ORDER BY addedAt DESC")
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


# ── GET by customer ────────────────────────────────────────────────
@router.get("/customer/{customer_name}")
def get_by_customer(customer_name: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Wishlist WHERE customerName LIKE ?", f"%{customer_name}%")
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


# ── ADD to wishlist ────────────────────────────────────────────────
@router.post("/", status_code=201)
def add_to_wishlist(data: WishlistCreate):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO Wishlist (customerName, productName, sku, price, notes, addedAt)
               VALUES (?, ?, ?, ?, ?, GETDATE())""",
            data.customer_name, data.product_name, data.sku, data.price, data.notes
        )
        cursor.execute("SELECT @@IDENTITY")
        new_id = int(cursor.fetchone()[0])
    return {"id": new_id, "message": "Added to wishlist"}


# ── REMOVE from wishlist ───────────────────────────────────────────
@router.delete("/{item_id}")
def remove_from_wishlist(item_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM Wishlist WHERE id = ?", item_id)
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Wishlist item not found")
        cursor.execute("DELETE FROM Wishlist WHERE id = ?", item_id)
    return {"message": f"Item {item_id} removed"}
