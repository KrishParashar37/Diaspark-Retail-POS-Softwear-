import requests

data = {
  "customerId": 1,
  "salesperson": "Ryan",
  "totalAmount": 2665.63,
  "status": "Completed",
  "transactionType": "Sales",
  "salesCategory": "InHouse",
  "department": "POS",
  "cashier": "Diaspark Admin(ADMIN)",
  "items": [{"sku": "CARE-PLAN", "price": 2500}],
  "payments": [{"type": "Credit Card", "amount": 2665.63}]
}

res = requests.post("http://localhost:5001/api/transactions", json=data)
print(res.status_code)
print(res.text)
