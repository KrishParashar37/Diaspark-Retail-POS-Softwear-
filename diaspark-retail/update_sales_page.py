import sys

with open('src/components/SalesPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if 'import CustomerComponentModal from' not in content:
    content = content.replace(
        "import ShippingAddressModal from './ShippingAddressModal'",
        "import ShippingAddressModal from './ShippingAddressModal'\nimport CustomerComponentModal from './CustomerComponentModal'"
    )

# 2. Add state
if 'const [showCustomerComponentModal' not in content:
    content = content.replace(
        "const [showPrintModal, setShowPrintModal] = useState(false);",
        "const [showPrintModal, setShowPrintModal] = useState(false);\n  const [showCustomerComponentModal, setShowCustomerComponentModal] = useState(false);"
    )

# 3. Add link above data-grid-section
link_html = """
          {selectedOption === 'Custom Order' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '20px', marginBottom: '5px' }}>
              <span 
                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => setShowCustomerComponentModal(true)}
              >
                Customer Component
              </span>
            </div>
          )}
          {/* Data Grid Section */}
"""
if "Customer Component" not in content and "CustomerComponentModal(true)" not in content:
    content = content.replace(
        "{/* Data Grid Section */}",
        link_html
    )

# 4. Render modal at the bottom
modal_html = """      {showPrintModal && (
        <PrintModal 
          onClose={() => setShowPrintModal(false)}
          invoiceId={lastSavedInvoiceId}
          transNo={lastSavedTransNo}
        />
      )}
      {showCustomerComponentModal && (
        <CustomerComponentModal 
          onClose={() => setShowCustomerComponentModal(false)}
        />
      )}"""
if "CustomerComponentModal onClose" not in content:
    content = content.replace(
        """      {showPrintModal && (
        <PrintModal 
          onClose={() => setShowPrintModal(false)}
          invoiceId={lastSavedInvoiceId}
          transNo={lastSavedTransNo}
        />
      )}""",
        modal_html
    )

with open('src/components/SalesPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated SalesPage.jsx")
