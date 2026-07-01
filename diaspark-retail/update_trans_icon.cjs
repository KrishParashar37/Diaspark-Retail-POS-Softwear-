const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/SalesPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const target = `                      {selectedOption === 'Repair' && (
                        <div className="form-group" style={{ margin: '0 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <label style={{ minWidth: '85px', fontWeight: 'bold', color: 'black' }}>Transaction #</label>
                          <div className="form-input-with-icon" style={{ display: 'flex' }}>
                            <input type="text" style={{ width: '120px', height: '20px', fontSize: '12px', border: '1px solid #ccc' }} value={customTransNo} onChange={e => setCustomTransNo(e.target.value)} />
                            <div className="form-input-icon" style={{ height: '20px', width: '20px', backgroundColor: '#5c7ec4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookIcon /></div>
                          </div>
                        </div>
                      )}`;

const replacement = `                      {selectedOption === 'Repair' && (
                        <div className="form-group" style={{ margin: '0 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <label style={{ minWidth: '85px', fontWeight: 'bold', color: 'black' }}>Transaction #</label>
                          <div className="form-input-with-icon" style={{ display: 'flex' }}>
                            <input type="text" style={{ width: '120px', height: '20px', fontSize: '12px', border: '1px solid #ccc' }} value={customTransNo} onChange={e => setCustomTransNo(e.target.value)} />
                            <div className="form-input-icon" onClick={() => setShowTransactionLookup(true)} style={{ height: '20px', width: '20px', backgroundColor: '#5c7ec4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                              <span style={{ fontSize: '18px', lineHeight: '18px', paddingBottom: '3px' }}>-</span>
                            </div>
                          </div>
                        </div>
                      )}`;

content = content.replace(target, replacement);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Replaced successfully');
