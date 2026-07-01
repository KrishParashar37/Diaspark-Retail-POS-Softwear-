from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ─── SALE SCHEMAS ────────────────────────────────────────────────
class SaleItemIn(BaseModel):
    product_name: str
    sku: Optional[str] = ""
    quantity: int
    unit_price: float
    total_price: float

class SaleCreate(BaseModel):
    customer_name: Optional[str] = "Walk-in Customer"
    items: List[SaleItemIn]
    discount: Optional[float] = 0.0
    tax: Optional[float] = 0.0
    payment_mode: Optional[str] = "Cash"
    notes: Optional[str] = ""

class SaleOut(SaleCreate):
    id: int
    invoice_no: str
    total_amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── WISHLIST SCHEMAS ─────────────────────────────────────────────
class WishlistCreate(BaseModel):
    customer_name: str
    product_name: str
    sku: Optional[str] = ""
    price: Optional[float] = 0.0
    notes: Optional[str] = ""

class WishlistOut(WishlistCreate):
    id: int
    added_at: datetime

    class Config:
        from_attributes = True


# ─── RETURN / EXCHANGE SCHEMAS ────────────────────────────────────
class ReturnExchangeCreate(BaseModel):
    original_invoice: str
    customer_name: str
    type: Optional[str] = "Return"       # Return or Exchange
    reason: str
    product_name: str
    sku: Optional[str] = ""
    quantity: Optional[int] = 1
    refund_amount: Optional[float] = 0.0

class ReturnExchangeOut(ReturnExchangeCreate):
    id: int
    rma_no: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── TRADE IN SCHEMAS ─────────────────────────────────────────────
class TradeInCreate(BaseModel):
    customer_name: str
    customer_phone: Optional[str] = ""
    item_name: str
    item_description: Optional[str] = ""
    condition: Optional[str] = "Good"    # Excellent, Good, Fair, Poor
    offered_value: Optional[float] = 0.0
    notes: Optional[str] = ""

class TradeInUpdate(BaseModel):
    final_value: Optional[float] = None
    status: Optional[str] = None         # Pending, Approved, Completed

class TradeInOut(TradeInCreate):
    id: int
    trade_no: str
    final_value: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─── VOID TRANSACTION SCHEMAS ─────────────────────────────────────
class VoidCreate(BaseModel):
    original_invoice: str
    customer_name: Optional[str] = ""
    amount: float
    reason: str
    voided_by: Optional[str] = "POS"

class VoidOut(VoidCreate):
    id: int
    void_no: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
