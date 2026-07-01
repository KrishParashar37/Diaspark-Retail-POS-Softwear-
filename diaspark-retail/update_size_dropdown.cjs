const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/RepairDetailModal.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetSize = `<label style={{ minWidth: 'auto', marginRight: '5px', marginLeft: '10px' }}>Size</label>
                  <select className="repair-select" style={{ width: '60px' }}></select>`;

const replaceSize = `<label style={{ minWidth: 'auto', marginRight: '5px', marginLeft: '10px' }}>Size</label>
                  <select className="repair-select" style={{ width: '60px' }}>
                    <option></option>
                    {Array.from({ length: 61 }, (_, i) => 1 + i * 0.25).map(size => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>`;

if (content.includes(targetSize)) {
  content = content.replace(targetSize, replaceSize);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated Size dropdown.');
} else {
  console.log('Target string not found.');
}
