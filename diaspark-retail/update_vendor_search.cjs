const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/VendorLookupModal.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state for filters and filtered data
const targetState = `  const [selectedRow, setSelectedRow] = useState(0);

  const handleSelect = () => {`;

const replaceState = `  const [selectedRow, setSelectedRow] = useState(0);
  const [filters, setFilters] = useState({ code: 'ROLEX', name: '', city: '', state: '', zip: '', email: '', phone: '' });
  const [filteredData, setFilteredData] = useState(dummyData.filter(item => item.code.toLowerCase().includes('rolex')));

  const handleSearch = () => {
    const result = dummyData.filter(item => {
      const matchCode = item.code.toLowerCase().includes(filters.code.toLowerCase());
      const matchName = item.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchCity = item.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchState = item.state.toLowerCase().includes(filters.state.toLowerCase());
      const matchZip = item.zip.toLowerCase().includes(filters.zip.toLowerCase());
      const matchEmail = item.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchPhone = item.phone.toLowerCase().includes(filters.phone.toLowerCase());
      
      // If code is provided, it must match. OR if other fields are provided, they must match.
      // Simply checking if all provided non-empty filters match.
      return (!filters.code || matchCode) &&
             (!filters.name || matchName) &&
             (!filters.city || matchCity) &&
             (!filters.state || matchState) &&
             (!filters.zip || matchZip) &&
             (!filters.email || matchEmail) &&
             (!filters.phone || matchPhone);
    });
    setFilteredData(result);
    setSelectedRow(result.length > 0 ? 0 : null);
  };

  const handleChange = (e, field) => {
    setFilters({ ...filters, [field]: e.target.value });
  };

  const handleSelect = () => {`;

if (content.includes(targetState)) {
  content = content.replace(targetState, replaceState);
}

// 2. Update inputs to use state
const targetInputs = `          <div className="vendor-filter-section">
            <input type="text" defaultValue="ROLEX" style={{ width: '120px' }} />
            <span style={{ margin: '0 10px', fontWeight: 'bold', fontSize: '13px' }}>OR</span>
            <input type="text" placeholder="Vendor Name" style={{ width: '150px' }} />
            <input type="text" placeholder="City" style={{ width: '100px', marginLeft: '5px' }} />
            <input type="text" placeholder="State" style={{ width: '60px', marginLeft: '5px' }} />
            <input type="text" placeholder="Zip" style={{ width: '70px', marginLeft: '5px' }} />
            <input type="text" placeholder="Email" style={{ width: '150px', marginLeft: '5px' }} />
            <input type="text" placeholder="Phone" style={{ width: '120px', marginLeft: '5px' }} />
            <button className="vendor-search-btn" style={{ marginLeft: '10px' }}>Search</button>
          </div>`;

const replaceInputs = `          <div className="vendor-filter-section">
            <input type="text" value={filters.code} onChange={(e) => handleChange(e, 'code')} placeholder="Code" style={{ width: '120px' }} />
            <span style={{ margin: '0 10px', fontWeight: 'bold', fontSize: '13px' }}>OR</span>
            <input type="text" value={filters.name} onChange={(e) => handleChange(e, 'name')} placeholder="Vendor Name" style={{ width: '150px' }} />
            <input type="text" value={filters.city} onChange={(e) => handleChange(e, 'city')} placeholder="City" style={{ width: '100px', marginLeft: '5px' }} />
            <input type="text" value={filters.state} onChange={(e) => handleChange(e, 'state')} placeholder="State" style={{ width: '60px', marginLeft: '5px' }} />
            <input type="text" value={filters.zip} onChange={(e) => handleChange(e, 'zip')} placeholder="Zip" style={{ width: '70px', marginLeft: '5px' }} />
            <input type="text" value={filters.email} onChange={(e) => handleChange(e, 'email')} placeholder="Email" style={{ width: '150px', marginLeft: '5px' }} />
            <input type="text" value={filters.phone} onChange={(e) => handleChange(e, 'phone')} placeholder="Phone" style={{ width: '120px', marginLeft: '5px' }} />
            <button className="vendor-search-btn" onClick={handleSearch} style={{ marginLeft: '10px' }}>Search</button>
          </div>`;

if (content.includes(targetInputs)) {
  content = content.replace(targetInputs, replaceInputs);
}

// 3. Update table mapping to use filteredData
const targetMap = `              <tbody>
                {dummyData.map((row, i) => (
                  <tr key={i} 
                      onClick={() => setSelectedRow(i)} 
                      onDoubleClick={handleSelect}
                      style={{ backgroundColor: selectedRow === i ? '#7bc0f7' : (i % 2 !== 0 ? '#fcfcfc' : 'white'), color: selectedRow === i ? 'white' : 'black', cursor: 'pointer' }}>
                    <td>{row.code}</td>
                    <td>{row.name}</td>
                    <td>{row.phone}</td>
                    <td>{row.city}</td>
                    <td>{row.state}</td>
                    <td>{row.zip}</td>
                    <td>{row.email}</td>
                  </tr>
                ))}
                {/* Add empty rows to fill space */}
                {[...Array(10)].map((_, i) => (
                  <tr key={\`empty-\${i}\`} style={{ backgroundColor: (i + dummyData.length) % 2 !== 0 ? '#fcfcfc' : 'white' }}>`;

const replaceMap = `              <tbody>
                {filteredData.map((row, i) => (
                  <tr key={i} 
                      onClick={() => setSelectedRow(i)} 
                      onDoubleClick={() => { setSelectedRow(i); if(onSelect) { onSelect(filteredData[i]); onClose(); } }}
                      style={{ backgroundColor: selectedRow === i ? '#7bc0f7' : (i % 2 !== 0 ? '#fcfcfc' : 'white'), color: selectedRow === i ? 'white' : 'black', cursor: 'pointer' }}>
                    <td>{row.code}</td>
                    <td>{row.name}</td>
                    <td>{row.phone}</td>
                    <td>{row.city}</td>
                    <td>{row.state}</td>
                    <td>{row.zip}</td>
                    <td>{row.email}</td>
                  </tr>
                ))}
                {/* Add empty rows to fill space */}
                {[...Array(10)].map((_, i) => (
                  <tr key={\`empty-\${i}\`} style={{ backgroundColor: (i + filteredData.length) % 2 !== 0 ? '#fcfcfc' : 'white' }}>`;

if (content.includes(targetMap)) {
  content = content.replace(targetMap, replaceMap);
}

// 4. Update handleSelect to use filteredData instead of dummyData
const targetHandleSelect = `  const handleSelect = () => {
    if (selectedRow !== null && onSelect) {
      onSelect(dummyData[selectedRow]);
    }
    onClose();
  };`;
const replaceHandleSelect = `  const handleSelect = () => {
    if (selectedRow !== null && onSelect && filteredData[selectedRow]) {
      onSelect(filteredData[selectedRow]);
    }
    onClose();
  };`;

if (content.includes(targetHandleSelect)) {
  content = content.replace(targetHandleSelect, replaceHandleSelect);
}


fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully added search logic to VendorLookupModal.');
