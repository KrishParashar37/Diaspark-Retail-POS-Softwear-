import sys

with open('src/components/SalesPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix gridTemplateColumns for Repair
content = content.replace(
    "selectedOption === 'Repair' ? { gridTemplateColumns: '2fr 4fr 1fr' } :",
    "selectedOption === 'Repair' ? { gridTemplateColumns: '1fr 2fr 0.5fr 0.5fr 1fr 1fr' } :"
)

# Fix Repair grid headers
content = content.replace(
    """                  {selectedOption === 'Repair' ? (
                    <div style={{ textAlign: 'right' }}>Estimate</div>
                  ) : (selectedOption === 'Cancel Order' || selectedOption === 'Payment (Open Order)' || selectedOption === 'Finalize Sale' || selectedOption === 'Layaway' || selectedOption === 'Sales') ? (""",
    """                  {selectedOption === 'Repair' ? (
                    <>
                      <div style={{ textAlign: 'center' }}>Qty</div>
                      <div style={{ textAlign: 'center' }}>Wt</div>
                      <div style={{ textAlign: 'center' }}>SKU Price</div>
                      <div style={{ textAlign: 'right' }}>Value</div>
                    </>
                  ) : (selectedOption === 'Cancel Order' || selectedOption === 'Payment (Open Order)' || selectedOption === 'Finalize Sale' || selectedOption === 'Layaway' || selectedOption === 'Sales') ? ("""
)

with open('src/components/SalesPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated SalesPage.jsx Repair grid header')
