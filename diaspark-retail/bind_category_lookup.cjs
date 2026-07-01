const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/RepairDetailModal.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state for categoryNo
if (!content.includes("const [categoryNo, setCategoryNo]")) {
  content = content.replace(
    "const [activeTab, setActiveTab] = useState('Merchandise Description');",
    "const [activeTab, setActiveTab] = useState('Merchandise Description');\n  const [categoryNo, setCategoryNo] = useState('');"
  );
}

// 2. Update the input field to use categoryNo
const targetInput = `<label style={{ minWidth: '60px' }}>Category #</label>
                  <input type="text" className="repair-input" style={{ width: '100px' }} />`;
const replaceInput = `<label style={{ minWidth: '60px' }}>Category #</label>
                  <input type="text" className="repair-input" style={{ width: '100px' }} value={categoryNo} onChange={(e) => setCategoryNo(e.target.value)} />`;

if (content.includes(targetInput)) {
  content = content.replace(targetInput, replaceInput);
}

// 3. Update the CategoryLookupModal call to pass onSelect
const targetModal = `<CategoryLookupModal onClose={() => setShowCategoryLookup(false)} />`;
const replaceModal = `<CategoryLookupModal onClose={() => setShowCategoryLookup(false)} onSelect={(data) => setCategoryNo(data.code)} />`;

if (content.includes(targetModal)) {
  content = content.replace(targetModal, replaceModal);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully bound CategoryLookupModal to Category # input field');
