const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/RepairDetailModal.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import
if (!content.includes("import CategoryLookupModal")) {
  content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport CategoryLookupModal from './CategoryLookupModal';"
  );
}

// 2. Add state
if (!content.includes("const [showCategoryLookup")) {
  // Find where other states are declared, let's just put it at the beginning of the component
  content = content.replace(
    "const RepairDetailModal = ({ onClose }) => {",
    "const RepairDetailModal = ({ onClose }) => {\n  const [showCategoryLookup, setShowCategoryLookup] = useState(false);"
  );
}

// 3. Update onClick for the icon
const targetIcon = `<label style={{ minWidth: '60px' }}>Category #</label>
                  <input type="text" className="repair-input" style={{ width: '100px' }} />
                  <div className="repair-icon-btn"><BookIcon /></div>`;
const replaceIcon = `<label style={{ minWidth: '60px' }}>Category #</label>
                  <input type="text" className="repair-input" style={{ width: '100px' }} />
                  <div className="repair-icon-btn" onClick={() => setShowCategoryLookup(true)} style={{cursor: 'pointer'}}><BookIcon /></div>`;

if (content.includes(targetIcon)) {
  content = content.replace(targetIcon, replaceIcon);
}

// 4. Render modal at the bottom (before the last </div>)
const targetRender = `      </div>
    </div>
  );
};

export default RepairDetailModal;`;
const replaceRender = `      </div>
      {showCategoryLookup && <CategoryLookupModal onClose={() => setShowCategoryLookup(false)} />}
    </div>
  );
};

export default RepairDetailModal;`;

if (!content.includes("<CategoryLookupModal")) {
  content = content.replace(targetRender, replaceRender);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully added CategoryLookupModal to RepairDetailModal.jsx');
