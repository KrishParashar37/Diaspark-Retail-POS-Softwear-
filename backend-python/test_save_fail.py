import requests

data = {
  "customerId": 1,
  "salesperson": "Shopify, Jacob Levy, WILLIAM SCHILDEI",
  "totalAmount": 9489.63,
  "status": "Completed",
  "transactionType": "Sales",
  "salesCategory": "InHouse",
  "department": "POS",
  "cashier": "Diaspark Admin(ADMIN)",
  "items": [{"sku": "DPA7480", "price": 0}, {"sku": "SN-10003", "price": 8900}],
  "payments": [{"type": "Credit Card", "amount": 9489.63}]
}

res = requests.post("http://localhost:5001/api/transactions", json=data)
print(res.status_code)
print(res.text)
