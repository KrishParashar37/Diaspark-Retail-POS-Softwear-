import sys

with open('src/components/CustomOrderDetailModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if 'import CustomerComponentModal from' not in content:
    content = content.replace(
        "import StoneCodeLookupModal from './StoneCodeLookupModal';",
        "import StoneCodeLookupModal from './StoneCodeLookupModal';\nimport CustomerComponentModal from './CustomerComponentModal';"
    )

# 2. Add state
if 'const [showCustomerComponentModal' not in content:
    content = content.replace(
        "const [showStoneLookupRowId, setShowStoneLookupRowId] = useState(null);",
        "const [showStoneLookupRowId, setShowStoneLookupRowId] = useState(null);\n  const [showCustomerComponentModal, setShowCustomerComponentModal] = useState(false);"
    )

# 3. Add link below Item Price
link_html = """              <div className="custom-form-row right-align" style={{marginTop: '10px'}}>
                 <label>Item Price</label>
                 <input type="text" style={{width: '100px'}} />
              </div>
              <div style={{ marginTop: '15px', textAlign: 'right' }}>
                 <span onClick={() => setShowCustomerComponentModal(true)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>Customer Component</span>
              </div>"""

if "Customer Component" not in content:
    content = content.replace(
        """              <div className="custom-form-row right-align" style={{marginTop: '10px'}}>
                 <label>Item Price</label>
                 <input type="text" style={{width: '100px'}} />
              </div>""",
        link_html
    )

# 4. Render modal at the bottom
modal_html = """        />
      )}
      
      {showCustomerComponentModal && (
        <CustomerComponentModal 
          onClose={() => setShowCustomerComponentModal(false)}
        />
      )}
    </div>
  );
}"""

if "CustomerComponentModal onClose" not in content:
    content = content.replace(
        """        />
      )}
    </div>
  );
}""",
        modal_html
    )

with open('src/components/CustomOrderDetailModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated CustomOrderDetailModal.jsx")
