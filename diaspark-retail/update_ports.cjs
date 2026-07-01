const fs = require('fs');
const path = require('path');
const dir = 'src/components';
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('http://localhost:5000')) {
      content = content.replaceAll('http://localhost:5000', 'http://localhost:5001');
      fs.writeFileSync(fullPath, content);
      console.log('Updated port in:', file);
    }
  }
});
