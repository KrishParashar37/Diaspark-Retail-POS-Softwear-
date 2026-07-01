import sys

with open('src/components/SalesPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the existing link to point to CustomerComponentModal
content = content.replace(
    "<span onClick={() => setShowNotesModal(true)} style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue', fontWeight: 'bold' }}>Customer Component</span>",
    "<span onClick={() => setShowCustomerComponentModal(true)} style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue', fontWeight: 'bold' }}>Customer Component</span>"
)

# Remove the link I mistakenly added earlier
link_to_remove = """          {selectedOption === 'Custom Order' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '20px', marginBottom: '5px' }}>
              <span 
                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => setShowCustomerComponentModal(true)}
              >
                Customer Component
              </span>
            </div>
          )}"""

content = content.replace(link_to_remove, '')

with open('src/components/SalesPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed SalesPage.jsx")
