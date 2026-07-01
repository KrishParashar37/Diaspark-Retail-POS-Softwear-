import re

file_path = r'c:\Users\test\Desktop\DIASPARK UI\diaspark-retail\src\components\CustomerLookupModal.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add salespersonsList state
state_match = "const [searchParams, setSearchParams] = useState({"
new_state = """const [salespersonsList, setSalespersonsList] = useState([]);
  const [searchParams, setSearchParams] = useState({"""
content = content.replace(state_match, new_state)

# Add fetch salespersons inside useEffect
useEffect_old = """  useEffect(() => {
    fetchCustomers();
  }, []);"""
useEffect_new = """  useEffect(() => {
    fetchCustomers();
    fetch('http://localhost:5001/api/salespersons')
      .then(res => res.json())
      .then(data => setSalespersonsList(data))
      .catch(err => console.error("Error fetching salespersons:", err));
  }, []);"""
content = content.replace(useEffect_old, useEffect_new)

# Replace the select options
select_pattern = re.compile(r'<select name="salesperson" value=\{searchParams\.salesperson\} onChange=\{handleInputChange\} className="search-select" style=\{\{width: \'130px\'\}\}>.*?</select>', re.DOTALL)

select_new = """<select name="salesperson" value={searchParams.salesperson} onChange={handleInputChange} className="search-select" style={{width: '130px'}}>
            <option value="" disabled>Salesperson Code</option>
            {salespersonsList.map(sp => (
              <option key={sp.code} value={sp.code}>{sp.name}({sp.code})</option>
            ))}
          </select>"""

content = select_pattern.sub(select_new, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CustomerLookupModal.jsx successfully.")
