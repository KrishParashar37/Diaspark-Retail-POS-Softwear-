import os
import re

SRC_DIR = r"c:\Users\test\Desktop\DIASPARK UI\diaspark-retail\src\components"

IMPORT_LINE = "import API_BASE_URL from '../config.js';\n"
OLD_URL = "http://localhost:5001"

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if OLD_URL not in content:
        return False

    # Add import at top if not already there
    if "from '../config.js'" not in content and "from './config.js'" not in content:
        content = IMPORT_LINE + content

    # Replace all occurrences of http://localhost:5001 with ${API_BASE_URL}
    # Strategy: find each occurrence, check if it's inside a template literal or regular string
    # We'll do a simple approach: replace all string forms

    # Replace `http://localhost:5001 (backtick strings - template literals)
    content = content.replace("`http://localhost:5001", "`${API_BASE_URL}")

    # Replace 'http://localhost:5001 (single quote strings) -> need backtick
    # We'll find all remaining occurrences with single/double quotes
    # Pattern: ('http://localhost:5001/path') -> (`${API_BASE_URL}/path`)
    # Pattern: ("http://localhost:5001/path") -> (`${API_BASE_URL}/path`)
    
    # Replace patterns like: 'http://localhost:5001/...'
    # This could be in: fetch('...'), let url = '...', etc.
    # Convert 'http://localhost:5001...' to `${API_BASE_URL}...`
    
    # Handle single quotes
    content = re.sub(r"'http://localhost:5001([^']*)'", r"`${API_BASE_URL}\1`", content)
    # Handle double quotes
    content = re.sub(r'"http://localhost:5001([^"]*)"', r'`${API_BASE_URL}\1`', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return True

count = 0
for fname in os.listdir(SRC_DIR):
    if fname.endswith('.jsx') or fname.endswith('.js'):
        fpath = os.path.join(SRC_DIR, fname)
        if fix_file(fpath):
            count += 1
            print(f"Fixed: {fname}")

print(f"\nTotal files fixed: {count}")
