import re

file_path = 'c:\\Users\\test\\Desktop\\DIASPARK UI\\diaspark-retail\\src\\components\\EditCustomerModal.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I want to find the start of the final fallback block:
# {activeTopTab !== 'Customer' && activeTopTab !== 'Purchase' ...

# and replace EVERYTHING from there to the end of the file.
pattern = re.compile(r"\{\s*activeTopTab !== 'Customer'.*", re.DOTALL)

replacement = """{activeTopTab !== 'Customer' && activeTopTab !== 'Purchase' && activeTopTab !== 'Appraisal' && activeTopTab !== 'Receivables' && activeTopTab !== 'Wishlist' && activeTopTab !== 'Order' && activeTopTab !== 'Repair' && activeTopTab !== 'Family' && activeTopTab !== 'Family Transaction' && activeTopTab !== 'Gift Card' && activeTopTab !== 'Gift Certificate' && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              {activeTopTab} tab contents would go here...
            </div>
          )}
          
          {activeTopTab === 'Customer' && activeSubTab !== 'Customer' && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              {activeSubTab} sub-tab contents would go here...
            </div>
          )}
        </div>

        <div className="edit-customer-footer">
          <button className="edit-customer-action-btn">Save</button>
          <button className="edit-customer-action-btn">Reset</button>
          <button className="edit-customer-action-btn" onClick={onClose}>Close</button>
        </div>
      </div>

      {showCategoryLookup && (
        <CategoryLookupModal 
          onClose={() => setShowCategoryLookup(false)}
          onSelect={(cat) => setSelectedCategory(cat.code)}
        />
      )}

      {showFamilyLookup && (
        <FamilyCustomerLookupModal 
          onClose={() => setShowFamilyLookup(false)}
          onSelect={(fam) => setFamilyId(fam.customerId)}
        />
      )}
    </div>
  );
}

export default EditCustomerModal;
"""

new_content = pattern.sub(replacement, content)

# Now inject FamilyCustomerLookupModal import if missing
if "import FamilyCustomerLookupModal" not in new_content:
    new_content = new_content.replace("import CategoryLookupModal from './CategoryLookupModal';", "import CategoryLookupModal from './CategoryLookupModal';\nimport FamilyCustomerLookupModal from './FamilyCustomerLookupModal';")

# Add showFamilyLookup and familyId state if missing
if "const [showFamilyLookup" not in new_content:
    new_content = new_content.replace("const [selectedCategory, setSelectedCategory] = useState('POS');", "const [selectedCategory, setSelectedCategory] = useState('POS');\n  const [showFamilyLookup, setShowFamilyLookup] = useState(false);\n  const [familyId, setFamilyId] = useState(customer?.customerId || '');")

# Update the Family # input and LU button
# original: <input className="edit-customer-input" value={customer?.customerId || ''} disabled style={{ width: '120px' }} />
#           <button className="edit-customer-lookup-btn">LU</button>

fam_pattern = re.compile(r'<div className="edit-customer-label" style=\{\{ width: \'60px\' \}\}>Family #</div>\s*<input className="edit-customer-input" value=\{customer\?\.customerId \|\| \'\'\} disabled style=\{\{ width: \'120px\' \}\} />\s*<button className="edit-customer-lookup-btn">LU</button>')

fam_replacement = """<div className="edit-customer-label" style={{ width: '60px' }}>Family #</div>
                  <input className="edit-customer-input" value={familyId} onChange={(e) => setFamilyId(e.target.value)} style={{ width: '120px' }} />
                  <button className="edit-customer-lookup-btn" onClick={() => setShowFamilyLookup(true)}>LU</button>"""

new_content = fam_pattern.sub(fam_replacement, new_content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("EditCustomerModal.jsx repaired and Family lookup hooked up.")
