import re
import sys

file_path = r'c:\Users\test\Desktop\DIASPARK UI\diaspark-retail\src\components\SalesPage.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add state
state_code = '''const [salesperson, setSalesperson] = useState('');
  const [salespersonsList, setSalespersonsList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/salespersons')
      .then(res => res.json())
      .then(data => setSalespersonsList(data))
      .catch(err => console.error("Error fetching salespersons:", err));
  }, []);'''
content = content.replace("const [salesperson, setSalesperson] = useState('');", state_code)

# Replace Salesperson blocks
pattern = re.compile(r'<label([^>]*)>Salesperson</label>\s*<div className="form-input-with-icon"([^>]*)>\s*<input type="text"([^>]*)>\s*<div className="form-input-icon[^"]*" onClick=\{\(\) => setShowSalespersonModal\(true\)\}[^>]*>\s*<BookIcon />\s*</div>\s*</div>', re.DOTALL)

def replacer(match):
    label_attrs = match.group(1)
    div_attrs = match.group(2)
    return f'''<label{label_attrs}>Salesperson</label>
                  <select className="sales-select"{div_attrs} value={{salesperson}} onChange={{(e) => setSalesperson(e.target.value)}}>
                    <option value=""></option>
                    {{salespersonsList.map(sp => (
                      <option key={{sp.code}} value={{sp.code}}>{{sp.name}}({{sp.code}})</option>
                    ))}}
                  </select>'''

content, count = pattern.subn(replacer, content)
print(f'Replaced {count} occurrences.')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
