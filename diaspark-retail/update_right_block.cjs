const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/SalesPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetRightBlock = `          <div className="right-form-block">
            {(selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card') && (
              <div className="form-group">
                <label>Salesperson</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="form-input-with-icon" style={{ border: '1px solid #ccc', width: '250px', height: '22px' }}>
                    <input type="text" style={{ width: '100%', padding: '0 4px' }} value={salesperson} onChange={(e) => setSalesperson(e.target.value)} />
                    <div className="form-input-icon" onClick={() => setShowSalespersonModal(true)}>
                      <BookIcon />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {(selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card') && (
              <div className="form-group">
                <label>Cashier</label>
                <select className="sales-select" style={{ width: '250px' }}>
                  <option>Diaspark Admin(ADMIN)</option>
                    <option>Vinod Jain(Vinod)</option>
                    <option>Dave Rodies(dave)</option>
                    <option>Ghad Slim(ghad)</option>
                    <option>Marry Disuja(Marry)</option>
                  <option>Vinod Jain(Vinod)</option>
                  <option>Dave Rodies(dave)</option>
                </select>
              </div>
            )}
            {(selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card') && (
              <div className="form-group">
                <label>{(selectedOption === 'Layaway' || selectedOption === 'Finalize Sale' || selectedOption === 'Special Order' || selectedOption === 'Custom Order' || selectedOption === 'Repair') ? 'Department' : 'Terminal'}</label>
                <input type="text" value="POS" readOnly className="sales-select" style={{ width: '250px', backgroundColor: '#e5e5e5' }} />
              </div>
            )}
            {(selectedOption !== 'Void Transactions' && selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card' && selectedOption !== 'Repair') && (
              <div className="form-group">
                <label>Online Review</label>
                <select className="sales-select" style={{ width: '250px' }}>
                  <option></option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            )}
            {(selectedOption !== 'Void Transactions' && selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card') && (
              <div className="form-group" style={{ position: 'relative' }}>
                <label>Ref#/Date</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input type="text" className="sales-select" style={{ width: '145px' }} />
                  <div className="form-input-with-icon" style={{ width: '95px' }}>
                    <input type="text" style={{ width: '100%' }} value={\`\${String(selectedDate.getMonth() + 1).padStart(2, '0')}/\${String(selectedDate.getDate()).padStart(2, '0')}/\${selectedDate.getFullYear()}\`} readOnly />
                    <div className="form-input-icon gray" style={{ padding: '0 2px' }} onClick={() => setShowDatePicker(!showDatePicker)}>
                      <CalendarIcon />
                    </div>
                  </div>
                </div>`;

const newRightBlock = `          <div className="right-form-block" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            {(selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card') && (
              <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                <label style={{ minWidth: '100px', textAlign: 'right', marginRight: '5px' }}>Salesperson</label>
                <div className="form-input-with-icon" style={{ borderColor: '#aaa', width: '250px', height: '22px' }}>
                  <input type="text" style={{ width: '100%', border: 'none', outline: 'none', padding: '0 4px' }} value={salesperson} onChange={(e) => setSalesperson(e.target.value)} />
                  <div 
                    className="form-input-icon" 
                    style={{ 
                      background: 'linear-gradient(to bottom, #7ca0e6, #507bce)', 
                      borderLeft: '1px solid #aaa',
                      cursor: 'pointer',
                      color: 'white',
                      padding: '0 6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => setShowSalespersonModal(true)}
                  >
                    <BookIcon />
                  </div>
                </div>
              </div>
            )}
            {(selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card') && (
              <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                <label style={{ minWidth: '100px', textAlign: 'right', marginRight: '5px' }}>Cashier</label>
                <select className="sales-select" style={{ width: '250px' }}>
                  <option>Diaspark Admin(ADMIN)</option>
                  <option>Vinod Jain(Vinod)</option>
                  <option>Dave Rodies(dave)</option>
                  <option>Ghad Slim(ghad)</option>
                  <option>Marry Disuja(Marry)</option>
                </select>
              </div>
            )}
            {(selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card') && (
              <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                <label style={{ minWidth: '100px', textAlign: 'right', marginRight: '5px' }}>{(selectedOption === 'Layaway' || selectedOption === 'Finalize Sale' || selectedOption === 'Special Order' || selectedOption === 'Custom Order' || selectedOption === 'Repair') ? 'Department' : 'Terminal'}</label>
                <input type="text" value="POS" readOnly className="sales-select" style={{ width: '250px', backgroundColor: '#e5e5e5' }} />
              </div>
            )}
            {(selectedOption !== 'Void Transactions' && selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card' && selectedOption !== 'Repair') && (
              <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                <label style={{ minWidth: '100px', textAlign: 'right', marginRight: '5px' }}>Online Review</label>
                <select className="sales-select" style={{ width: '250px' }}>
                  <option></option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            )}
            {(selectedOption !== 'Void Transactions' && selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card') && (
              <div className="form-group" style={{ justifyContent: 'flex-end', position: 'relative' }}>
                <label style={{ minWidth: '100px', textAlign: 'right', marginRight: '5px' }}>Ref#/Date</label>
                <div style={{ display: 'flex', gap: '5px', width: '250px' }}>
                  <input type="text" className="sales-select" style={{ flex: 1 }} />
                  <div className="form-input-with-icon" style={{ width: '100px' }}>
                    <input type="text" style={{ width: '100%' }} value={\`\${String(selectedDate.getMonth() + 1).padStart(2, '0')}/\${String(selectedDate.getDate()).padStart(2, '0')}/\${selectedDate.getFullYear()}\`} readOnly />
                    <div className="form-input-icon gray" style={{ padding: '0 2px', cursor: 'pointer' }} onClick={() => setShowDatePicker(!showDatePicker)}>
                      <CalendarIcon />
                    </div>
                  </div>
                </div>`;

content = content.replace(targetRightBlock, newRightBlock);
fs.writeFileSync(filePath, content, 'utf8');
console.log("Replaced successfully!");
