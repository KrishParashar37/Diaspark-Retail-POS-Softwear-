with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all occurrences of pos_order back to pos_orders
# We need to be careful not to mess up pos_order_lines etc.
content = content.replace('INSERT INTO pos_order ', 'INSERT INTO pos_orders ')
content = content.replace("INTO pos_order (", "INTO pos_orders (")
content = content.replace("FROM pos_order ", "FROM pos_orders ")
content = content.replace("'message': 'Special Order saved successfully in pos_order'", "'message': 'Special Order saved successfully in pos_orders'")

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated app.py to use pos_orders instead of pos_order.")
