const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/RepairDetailModal.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Wrap the existing Merchandise Description content
const targetTabContentStart = `          <div className="repair-tab-content">
            <div className="repair-stone-grid">`;
const replaceTabContentStart = `          <div className="repair-tab-content">
            {activeTab === 'Merchandise Description' && (
              <div className="repair-stone-grid">`;

if (content.includes(targetTabContentStart)) {
  content = content.replace(targetTabContentStart, replaceTabContentStart);
}

const targetTabContentEnd = `              <div className="repair-form-row">
                <label style={{ minWidth: '100px' }}>Item Description</label>
                <textarea className="repair-textarea" defaultValue="40MM S/YG SUBMARINER"></textarea>
              </div>
              <div className="repair-form-row">
                <label style={{ minWidth: '100px' }}>Repair Instruction</label>
                <textarea className="repair-textarea" defaultValue="Jewelry Repair"></textarea>
              </div>
              <div className="repair-form-row">
                <label style={{ minWidth: '100px' }}>Item Condition</label>
                <textarea className="repair-textarea"></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <div className="repair-modal-footer">`;

const replaceTabContentEnd = `              <div className="repair-form-row">
                <label style={{ minWidth: '100px' }}>Item Description</label>
                <textarea className="repair-textarea" defaultValue="40MM S/YG SUBMARINER"></textarea>
              </div>
              <div className="repair-form-row">
                <label style={{ minWidth: '100px' }}>Repair Instruction</label>
                <textarea className="repair-textarea" defaultValue="Jewelry Repair"></textarea>
              </div>
              <div className="repair-form-row">
                <label style={{ minWidth: '100px' }}>Item Condition</label>
                <textarea className="repair-textarea"></textarea>
              </div>
            </div>
            </div>
            )}
            
            {activeTab === 'Repair Detail' && (
              <div className="repair-detail-grid" style={{ padding: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', color: '#333' }}>+</span>
                  <span style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', color: '#c00' }}>-</span>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', fontWeight: 'bold' }}>
                      <th style={{ padding: '5px' }}>Labor Group</th>
                      <th style={{ padding: '5px' }}>Labor Category</th>
                      <th style={{ padding: '5px' }}>Labor #</th>
                      <th style={{ padding: '5px' }}>Description</th>
                      <th style={{ padding: '5px', textAlign: 'right' }}>Retail Price</th>
                      <th style={{ padding: '5px', textAlign: 'right' }}>Unit Discount</th>
                      <th style={{ padding: '5px', textAlign: 'right' }}>Price</th>
                      <th style={{ padding: '5px', textAlign: 'right' }}>Qty</th>
                      <th style={{ padding: '5px', textAlign: 'right' }}>Ext. Price</th>
                      <th style={{ padding: '5px', textAlign: 'center' }}>Taxable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '5px' }}>
                        <div style={{ display: 'flex' }}>
                          <input type="text" defaultValue="JR" className="repair-input" style={{ width: '40px' }} />
                          <div className="repair-icon-btn"><BookIcon /></div>
                        </div>
                      </td>
                      <td style={{ padding: '5px' }}>
                        <div style={{ display: 'flex' }}>
                          <input type="text" defaultValue="JR" className="repair-input" style={{ width: '50px' }} />
                          <div className="repair-icon-btn"><BookIcon /></div>
                        </div>
                      </td>
                      <td style={{ padding: '5px' }}>
                        <div style={{ display: 'flex' }}>
                          <input type="text" defaultValue="JR" className="repair-input" style={{ width: '50px' }} />
                          <div className="repair-icon-btn"><BookIcon /></div>
                        </div>
                      </td>
                      <td style={{ padding: '5px' }}>
                        <input type="text" defaultValue="Jewelry Repair" className="repair-input" style={{ width: '150px' }} />
                      </td>
                      <td style={{ padding: '5px' }}>
                        <input type="text" defaultValue="0.00" className="repair-input" style={{ width: '60px', textAlign: 'right' }} />
                      </td>
                      <td style={{ padding: '5px' }}>
                        <input type="text" defaultValue="0.00" className="repair-input" style={{ width: '60px', textAlign: 'right' }} />
                      </td>
                      <td style={{ padding: '5px' }}>
                        <input type="text" defaultValue="0.00" className="repair-input" style={{ width: '60px', textAlign: 'right' }} />
                      </td>
                      <td style={{ padding: '5px' }}>
                        <input type="text" defaultValue="1" className="repair-input" style={{ width: '30px', textAlign: 'right' }} />
                      </td>
                      <td style={{ padding: '5px' }}>
                        <input type="text" defaultValue="0.00" className="repair-input" style={{ width: '60px', textAlign: 'right', backgroundColor: '#ebebeb', color: '#666' }} readOnly />
                      </td>
                      <td style={{ padding: '5px', textAlign: 'center' }}>
                        <input type="checkbox" defaultChecked />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'Reasons' && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                Reasons content will go here.
              </div>
            )}
          </div>
        </div>
        
        <div className="repair-modal-footer">`;

if (content.includes(targetTabContentEnd)) {
  content = content.replace(targetTabContentEnd, replaceTabContentEnd);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated tab rendering in RepairDetailModal.');
