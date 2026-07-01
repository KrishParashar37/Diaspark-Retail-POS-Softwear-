from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import customers, sales, wishlist, return_exchange, trade_in, void_transactions

app = FastAPI(title="Diaspark Retail API", version="1.0.0")

# ── CORS — allow React frontend ────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ─────────────────────────────────────────────────────────
app.include_router(customers.router,          prefix="/api/customers",          tags=["Customers"])
app.include_router(sales.router,              prefix="/api/sales",              tags=["Sales"])
app.include_router(wishlist.router,           prefix="/api/wishlist",           tags=["Wishlist"])
app.include_router(return_exchange.router,    prefix="/api/return-exchange",    tags=["Return/Exchange"])
app.include_router(trade_in.router,           prefix="/api/trade-in",           tags=["Trade In"])
app.include_router(void_transactions.router,  prefix="/api/void-transactions",  tags=["Void Transactions"])

@app.get("/")
def root():
    return {"message": "Diaspark Retail Python API running", "db": "POSDB @ DBSRV2025"}
