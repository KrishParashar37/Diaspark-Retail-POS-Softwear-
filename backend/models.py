from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Product(Base):
    __tablename__ = "products"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(200), nullable=False)
    sku         = Column(String(100), unique=True, index=True)
    price       = Column(Float, default=0.0)
    stock       = Column(Integer, default=0)
    category    = Column(String(100))
    description = Column(Text)
    created_at  = Column(DateTime, default=datetime.utcnow)


class Customer(Base):
    __tablename__ = "customers"
    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(200), nullable=False)
    email      = Column(String(200), unique=True, index=True)
    phone      = Column(String(20))
    address    = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Sale(Base):
    __tablename__ = "sales"
    id           = Column(Integer, primary_key=True, index=True)
    invoice_no   = Column(String(50), unique=True, index=True)
    customer_id  = Column(Integer, ForeignKey("customers.id"), nullable=True)
    customer_name= Column(String(200))
    total_amount = Column(Float, default=0.0)
    discount     = Column(Float, default=0.0)
    tax          = Column(Float, default=0.0)
    payment_mode = Column(String(50), default="Cash")  # Cash, Card, etc.
    status       = Column(String(50), default="Completed")
    notes        = Column(Text)
    created_at   = Column(DateTime, default=datetime.utcnow)
    items        = relationship("SaleItem", back_populates="sale", cascade="all, delete")


class SaleItem(Base):
    __tablename__ = "sale_items"
    id          = Column(Integer, primary_key=True, index=True)
    sale_id     = Column(Integer, ForeignKey("sales.id"))
    product_id  = Column(Integer, ForeignKey("products.id"), nullable=True)
    product_name= Column(String(200))
    sku         = Column(String(100))
    quantity    = Column(Integer, default=1)
    unit_price  = Column(Float, default=0.0)
    total_price = Column(Float, default=0.0)
    sale        = relationship("Sale", back_populates="items")


class WishlistItem(Base):
    __tablename__ = "wishlist"
    id           = Column(Integer, primary_key=True, index=True)
    customer_id  = Column(Integer, ForeignKey("customers.id"), nullable=True)
    customer_name= Column(String(200))
    product_id   = Column(Integer, ForeignKey("products.id"), nullable=True)
    product_name = Column(String(200))
    sku          = Column(String(100))
    price        = Column(Float, default=0.0)
    notes        = Column(Text)
    added_at     = Column(DateTime, default=datetime.utcnow)


class ReturnExchange(Base):
    __tablename__ = "return_exchange"
    id             = Column(Integer, primary_key=True, index=True)
    rma_no         = Column(String(50), unique=True, index=True)
    original_invoice= Column(String(50))
    customer_name  = Column(String(200))
    type           = Column(String(20), default="Return")  # Return or Exchange
    reason         = Column(Text)
    product_name   = Column(String(200))
    sku            = Column(String(100))
    quantity       = Column(Integer, default=1)
    refund_amount  = Column(Float, default=0.0)
    status         = Column(String(50), default="Pending")  # Pending, Approved, Rejected
    created_at     = Column(DateTime, default=datetime.utcnow)


class TradeIn(Base):
    __tablename__ = "trade_in"
    id             = Column(Integer, primary_key=True, index=True)
    trade_no       = Column(String(50), unique=True, index=True)
    customer_name  = Column(String(200))
    customer_phone = Column(String(20))
    item_name      = Column(String(200))
    item_description= Column(Text)
    condition      = Column(String(50))  # Excellent, Good, Fair, Poor
    offered_value  = Column(Float, default=0.0)
    final_value    = Column(Float, default=0.0)
    status         = Column(String(50), default="Pending")  # Pending, Approved, Completed
    notes          = Column(Text)
    created_at     = Column(DateTime, default=datetime.utcnow)


class VoidTransaction(Base):
    __tablename__ = "void_transactions"
    id             = Column(Integer, primary_key=True, index=True)
    void_no        = Column(String(50), unique=True, index=True)
    original_invoice= Column(String(50))
    customer_name  = Column(String(200))
    amount         = Column(Float, default=0.0)
    reason         = Column(Text)
    voided_by      = Column(String(100), default="POS")
    status         = Column(String(50), default="Voided")
    created_at     = Column(DateTime, default=datetime.utcnow)
