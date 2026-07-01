const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/RepairDetailModal.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetState = `  const [activeTab, setActiveTab] = useState('Merchandise Description');`;
const replaceState = `  const [activeTab, setActiveTab] = useState('Merchandise Description');

  const colorOptions = ['', 'Color Stone', 'Diamond', 'Other', 'Black', 'Blue', 'Brown', 'Colorless', 'Green', 'Multi Color', 'Orange', 'Purple', 'Red', 'White', 'Yellow'];
  const shapeOptions = ['', 'Asscher', 'Bagutte', 'Cushion', 'Emerald', 'Heart', 'Marquise', 'Mixed Shape', 'Oval', 'Pear', 'Princess', 'Radiant', 'Round', 'Vilandi Diamond'];
`;

if (content.includes(targetState) && !content.includes('colorOptions')) {
  content = content.replace(targetState, replaceState);
}

const targetMap = `              {['Color', 'Shape', 'Type', 'Quantity', 'MM Size', 'Carat', 'Damage', 'Grade Report #'].map((label, index) => (
                <div className="repair-stone-row" key={label} style={{ marginBottom: '3px' }}>
                  <div className="repair-stone-label">{label}</div>
                  <div className="repair-stone-col">
                    {index < 3 ? (
                      <select className="repair-select" style={{ width: '100%' }}></select>
                    ) : (
                      <input type="text" className="repair-input" style={{ width: '100%' }} />
                    )}
                  </div>
                  <div className="repair-stone-col">
                    {index < 3 ? (
                      <select className="repair-select" style={{ width: '100%' }}></select>
                    ) : (
                      <input type="text" className="repair-input" style={{ width: '100%' }} />
                    )}
                  </div>
                  <div className="repair-stone-col">
                    {index < 3 ? (
                      <select className="repair-select" style={{ width: '100%' }}></select>
                    ) : (
                      <input type="text" className="repair-input" style={{ width: '100%' }} />
                    )}
                  </div>
                </div>
              ))}`;

const replaceMap = `              {['Color', 'Shape', 'Type', 'Quantity', 'MM Size', 'Carat', 'Damage', 'Grade Report #'].map((label, index) => (
                <div className="repair-stone-row" key={label} style={{ marginBottom: '3px' }}>
                  <div className="repair-stone-label">{label}</div>
                  <div className="repair-stone-col">
                    {index < 3 ? (
                      <select className="repair-select" style={{ width: '100%' }}>
                        {label === 'Color' && colorOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                        {label === 'Shape' && shapeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                        {label === 'Type' && <option></option>}
                      </select>
                    ) : (
                      <input type="text" className="repair-input" style={{ width: '100%' }} />
                    )}
                  </div>
                  <div className="repair-stone-col">
                    {index < 3 ? (
                      <select className="repair-select" style={{ width: '100%' }}>
                        {label === 'Color' && colorOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                        {label === 'Shape' && shapeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                        {label === 'Type' && <option></option>}
                      </select>
                    ) : (
                      <input type="text" className="repair-input" style={{ width: '100%' }} />
                    )}
                  </div>
                  <div className="repair-stone-col">
                    {index < 3 ? (
                      <select className="repair-select" style={{ width: '100%' }}>
                        {label === 'Color' && colorOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                        {label === 'Shape' && shapeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                        {label === 'Type' && <option></option>}
                      </select>
                    ) : (
                      <input type="text" className="repair-input" style={{ width: '100%' }} />
                    )}
                  </div>
                </div>
              ))}`;

if (content.includes(targetMap)) {
  content = content.replace(targetMap, replaceMap);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated Color and Shape dropdowns.');
