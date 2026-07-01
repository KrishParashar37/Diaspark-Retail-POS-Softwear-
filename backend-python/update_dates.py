import re

file_path = 'c:\\Users\\test\\Desktop\\DIASPARK UI\\diaspark-retail\\src\\components\\EditCustomerModal.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add months and days array near the top of the component
if "const months =" not in content:
    content = content.replace("const topTabs =", "const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];\n  const days = ['', ...Array.from({ length: 31 }, (_, i) => i + 1)];\n\n  const topTabs =")

# Customer Birth Date
content = content.replace(
    '<select className="edit-customer-select" style={{ width: \'45px\' }}><option>Jun</option></select>\n                  <input className="edit-customer-input" value="13" style={{ width: \'30px\' }} />',
    '<select className="edit-customer-select" style={{ width: \'55px\' }}>{months.map(m => <option key={m}>{m}</option>)}</select>\n                  <select className="edit-customer-select" style={{ width: \'50px\' }}>{days.map(d => <option key={d}>{d}</option>)}</select>'
)

# Significant Other Birth Date
content = content.replace(
    '<select className="edit-customer-select" style={{ width: \'45px\' }}></select>\n                  <input className="edit-customer-input" style={{ width: \'30px\' }} />',
    '<select className="edit-customer-select" style={{ width: \'55px\' }}>{months.map(m => <option key={m}>{m}</option>)}</select>\n                  <select className="edit-customer-select" style={{ width: \'50px\' }}>{days.map(d => <option key={d}>{d}</option>)}</select>'
)

# Engagement Date
content = content.replace(
    '<select className="edit-customer-select" style={{ width: \'45px\' }}></select>\n                  <input className="edit-customer-input" style={{ width: \'30px\' }} />\n                  <input className="edit-customer-input" style={{ width: \'50px\' }} />',
    '<select className="edit-customer-select" style={{ width: \'55px\' }}>{months.map(m => <option key={m}>{m}</option>)}</select>\n                  <select className="edit-customer-select" style={{ width: \'50px\' }}>{days.map(d => <option key={d}>{d}</option>)}</select>\n                  <input className="edit-customer-input" style={{ width: \'50px\' }} />'
)

# Anniversary Date
content = content.replace(
    '<select className="edit-customer-select" style={{ width: \'45px\' }}><option>Apr</option></select>\n                  <input className="edit-customer-input" value="29" style={{ width: \'30px\' }} />\n                  <input className="edit-customer-input" style={{ width: \'50px\' }} />',
    '<select className="edit-customer-select" style={{ width: \'55px\' }}>{months.map(m => <option key={m}>{m}</option>)}</select>\n                  <select className="edit-customer-select" style={{ width: \'50px\' }}>{days.map(d => <option key={d}>{d}</option>)}</select>\n                  <input className="edit-customer-input" style={{ width: \'50px\' }} />'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated date dropdowns.")
