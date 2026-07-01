import sys

with open('src/components/SpecialOrderDetailModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if 'import CustomerComponentModal from' not in content:
    content = content.replace(
        "import LaborLookupModal from './LaborLookupModal';",
        "import LaborLookupModal from './LaborLookupModal';\nimport CustomerComponentModal from './CustomerComponentModal';"
    )

# 2. Add state
if 'const [showCustomerComponentModal' not in content:
    content = content.replace(
        "const [subTab, setSubTab] = useState('Enter Components');",
        "const [subTab, setSubTab] = useState('Enter Components');\n  const [showCustomerComponentModal, setShowCustomerComponentModal] = useState(false);"
    )

# 3. Add link below the calc-row (quantity X quote = total)
link_html = """                  <span style={{ width: '10px', textAlign: 'center' }}>=</span>
                  <label style={{ width: '35px', textAlign: 'right', fontWeight: 'bold' }}>Total</label>
                  <input type="text" value={total} onChange={e => setTotal(e.target.value)} style={{ width: '65px', flex: 'none' }} />
                </div>
                <div style={{ marginTop: '15px', textAlign: 'right' }}>
                   <span onClick={() => setShowCustomerComponentModal(true)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}>Customer Component</span>
                </div>"""

if "Customer Component" not in content:
    content = content.replace(
        """                  <span style={{ width: '10px', textAlign: 'center' }}>=</span>
                  <label style={{ width: '35px', textAlign: 'right', fontWeight: 'bold' }}>Total</label>
                  <input type="text" value={total} onChange={e => setTotal(e.target.value)} style={{ width: '65px', flex: 'none' }} />
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

with open('src/components/SpecialOrderDetailModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated SpecialOrderDetailModal.jsx")
