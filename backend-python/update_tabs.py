import re

file_path = 'c:\\Users\\test\\Desktop\\DIASPARK UI\\diaspark-retail\\src\\components\\EditCustomerModal.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

tabs_info = [
    ('Appraisal', 14, ['row.transNo', 'row.date', 'row.type', 'row.category', 'row.department', 'row.styleSku', 'row.serialNo', 'row.description', 'row.salesperson', 'row.qty', 'row.price', 'row.discount', 'row.extPrice']),
    ('Receivables', 10, ['row.storeNo', 'row.transBk', 'row.transNo', 'row.transDate', 'row.dueDate', 'row.rewardType', 'row.netAmt', 'row.balanceAmt', 'row.description']),
    ('Wishlist', 9, ['row.date', 'row.description', 'row.salesperson', 'row.retailPrice', 'row.storeInvn', 'row.otherStoreInvn', 'row.interestLevel', '""']),
    ('Order', 8, ['row.transactionNo', 'row.dueDate', 'row.description', 'row.salesperson', 'row.qty', 'row.price', '""']),
    ('Repair', 8, ['row.transactionNo', 'row.dueDate', 'row.description', 'row.salesperson', 'row.repairCharge', 'row.orderStatus', 'row.approved']),
    ('Family', 9, ['row.firstName', 'row.lastName', 'row.birthDate', 'row.anniversary', 'row.significantOtherName', 'row.significantOtherBirthDate', 'row.phone', 'row.email']),
    ('Family Transaction', 8, ['row.customerId', 'row.transactionNo', 'row.description', 'row.salesperson', 'row.qty', 'row.price', 'row.extPrice']),
    ('Gift Card', 5, ['row.value', 'row.balanceAmt', 'row.chargeValue', 'row.status']),
    ('Gift Certificate', 5, ['row.value', 'row.expiryDate', 'row.remarks', 'row.status'])
]

for tab, cols, fields in tabs_info:
    pattern = r"\{activeTopTab === '" + tab + r"' && \(\s*<div className=\"edit-customer-purchase-container\">\s*<table className=\"edit-customer-purchase-table\">\s*<thead>(.*?)</thead>\s*<tbody>(.*?)</tbody>\s*</table>\s*</div>\s*\)"
    
    tds = "<td>📷</td>" if tab not in ['Receivables', 'Family', 'Gift Card', 'Gift Certificate'] else ""
    if tab == 'Family':
         tds = "<td>{row.customerId}</td>"
    elif tab in ['Gift Card', 'Gift Certificate']:
         tds = "<td>{row.id}</td>"
    elif tab == 'Receivables':
         tds = "<td>{row.customerId}</td>"

    for fld in fields:
        tds += f"<td>{{{fld}}}</td>"

    replacement = f"""{{activeTopTab === '{tab}' && (
            <div className="edit-customer-purchase-container">
              {{isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Loading {tab.lower()}...</div>
              ) : (
                <table className="edit-customer-purchase-table">
                  <thead>\\1</thead>
                  <tbody>
                    {{tabData.length > 0 ? (
                      tabData.map((row, i) => (
                        <tr key={{i}}>
                          {tds}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="{cols}" style={{ textAlign: 'center' }}>No {tab.lower()} data found.</td>
                      </tr>
                    )}}
                  </tbody>
                </table>
              )}}
            </div>
          )"""
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated JSX successfully")
