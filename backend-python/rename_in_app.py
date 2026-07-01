with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all occurrences of pos_orders with pos_order
content = content.replace('pos_orders', 'pos_order')

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated app.py to use pos_order instead of pos_orders.")
