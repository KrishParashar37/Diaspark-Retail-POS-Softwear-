const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/SalesPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import AlertsModal
if (!content.includes("import AlertsModal")) {
  content = content.replace(
    "import TransactionLookupModal from './TransactionLookupModal'",
    "import TransactionLookupModal from './TransactionLookupModal'\nimport AlertsModal from './AlertsModal'"
  );
}

// 2. Add State
if (!content.includes("const [showAlertsModal")) {
  content = content.replace(
    "const [showTransactionLookup, setShowTransactionLookup] = useState(false);",
    "const [showTransactionLookup, setShowTransactionLookup] = useState(false);\n  const [showAlertsModal, setShowAlertsModal] = useState(false);"
  );
}

// 3. Update onClick
const targetSpan = "{selectedOption === 'Repair' && <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Alerts</span>}";
const replaceSpan = "{selectedOption === 'Repair' && <span onClick={() => setShowAlertsModal(true)} style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue', fontWeight: 'bold' }}>Alerts</span>}";
if (content.includes(targetSpan)) {
  content = content.replace(targetSpan, replaceSpan);
}

// 4. Render modal at the bottom
const targetRender = "{showTransactionLookup && (";
const replaceRender = `{showAlertsModal && (
        <AlertsModal onClose={() => setShowAlertsModal(false)} />
      )}
      {showTransactionLookup && (`

if (!content.includes("<AlertsModal")) {
  content = content.replace(targetRender, replaceRender);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully added AlertsModal to SalesPage.jsx');
