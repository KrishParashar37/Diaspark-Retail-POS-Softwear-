const fs = require('fs');
const path = require('path');
const dir = 'src/components';
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    // Replace help button onClick
    const target1 = '<button className="help-btn">Help</button>';
    if (content.includes(target1)) {
        content = content.replaceAll(target1, '<button className="help-btn" onClick={() => alert(\\\'Opening Help Documentation...\\\')}>Help</button>');
        changed = true;
    }
    
    // Some buttons are multiline like:
    /*
          }}>Help</button>
    */
    const target2 = '}}>Help</button>';
    if (content.includes(target2)) {
        // Need a regex for finding `<button className="help-btn" ... >Help</button>`
        // Let's just do a simple replacement for the exact string if we can.
    }
    
    // Instead of string replace, let's use regex
    const regex = /<button\s+className="help-btn"(?!.*onClick)[^>]*>Help<\/button>/g;
    if (regex.test(content)) {
        content = content.replace(regex, (match) => {
            return match.replace('>', ' onClick={() => alert(\\\'Opening Help Documentation...\\\')}>');
        });
        changed = true;
    }

    if (changed) {
      fs.writeFileSync(fullPath, content);
      console.log('Updated:', file);
    }
  }
});
