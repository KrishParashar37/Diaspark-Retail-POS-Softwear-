const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/SalesPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the line with the Repair Transaction # icon
// It looks like:
// <div className="form-input-icon" style={{ height: '20px', width: '20px', backgroundColor: '#5c7ec4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookIcon /></div>

const searchString = '<div className="form-input-icon" style={{ height: \'20px\', width: \'20px\', backgroundColor: \'#5c7ec4\', color: \'white\', display: \'flex\', alignItems: \'center\', justifyContent: \'center\' }}><BookIcon /></div>';
const replaceString = '<div className="form-input-icon" onClick={() => setShowTransactionLookup(true)} style={{ height: \'20px\', width: \'20px\', backgroundColor: \'#5c7ec4\', color: \'white\', display: \'flex\', alignItems: \'center\', justifyContent: \'center\', cursor: \'pointer\' }}><BookIcon /></div>';

if (content.includes(searchString)) {
  content = content.replace(searchString, replaceString);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully added onClick to Repair Transaction # icon!");
} else {
  console.log("Could not find the target string!");
}
