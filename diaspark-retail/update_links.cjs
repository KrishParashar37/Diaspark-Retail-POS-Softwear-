const fs = require('fs');
const path = require('path');
const dir = 'src/components';
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('>Remote Assistance<')) {
      content = content.replace(/<div style=\{\{ color: '#0055aa', cursor: 'pointer' \}\}>Remote Assistance<\/div>/g, 
      "<div style={{ color: '#0055aa', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); alert('Starting Remote Assistance session...'); }}>Remote Assistance</div>");
      fs.writeFileSync(fullPath, content);
      console.log('Updated ' + file);
    }
  }
});
