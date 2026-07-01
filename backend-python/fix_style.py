import re

file_path = 'c:\\Users\\test\\Desktop\\DIASPARK UI\\diaspark-retail\\src\\components\\EditCustomerModal.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("style={ padding: '20px', textAlign: 'center' }", "style={{ padding: '20px', textAlign: 'center' }}")
content = content.replace("style={ textAlign: 'center' }", "style={{ textAlign: 'center' }}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed JSX style syntax errors.")
