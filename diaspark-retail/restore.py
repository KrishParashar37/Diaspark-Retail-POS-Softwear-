import json
import re

log_path = r"C:\Users\test\.gemini\antigravity-ide\brain\3ce60f29-f2e4-4b02-83d1-e02fac0ad51f\.system_generated\logs\transcript.jsonl"
file_path = r"c:\Users\test\Desktop\DIASPARK UI\diaspark-retail\src\components\EditCustomerModal.jsx"

found_content = None

with open(log_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    
# We want to find the last time the file was fully intact.
# The previous turn had a multi_replace_file_content response.
# Actually, the user's message itself has the diff.
# Let's extract the user's message from the last step.
for line in reversed(lines):
    data = json.loads(line)
    if data.get('type') == 'USER_INPUT':
        content = data.get('content', '')
        if '[diff_block_start]' in content and 'EditCustomerModal.jsx' in content:
            diff_start = content.find('[diff_block_start]')
            diff_end = content.find('[diff_block_end]')
            diff_text = content[diff_start:diff_end]
            
            # extract lines starting with '-'
            restored_lines = []
            for dline in diff_text.split('\n'):
                if dline.startswith('-'):
                    restored_lines.append(dline[1:])
                elif dline.startswith(' ') or dline.startswith('+'):
                    continue
            
            # The diff might be the deletion diff
            if len(restored_lines) > 500:
                with open(file_path, 'w', encoding='utf-8') as out:
                    out.write('\n'.join(restored_lines))
                print(f"Restored {len(restored_lines)} lines.")
                break
