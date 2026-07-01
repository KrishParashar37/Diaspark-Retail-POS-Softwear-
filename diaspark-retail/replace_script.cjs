const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/SalesPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');
let lines = content.split('\n');

const startIdx = 749; // Line 750
const endIdx = 903; // Line 904

const newBlock = `              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '20px', marginRight: '20px' }}>
                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', minWidth: '70px', justifyContent: 'flex-end', marginRight: '5px' }}>
                    <input type="checkbox" style={{ margin: '0 5px 0 0' }} checked={isShipToChecked} onChange={(e) => setIsShipToChecked(e.target.checked)} />
                    <label style={{ minWidth: 'auto', marginRight: '0', paddingTop: '1px' }}>Ship To</label>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="form-input-with-icon" style={{ borderColor: '#aaa', width: '200px' }}>
                      <input type="text" value={shippingAddress ? \`\${shippingAddress.firstName} \${shippingAddress.lastName} - \${shippingAddress.address1}\` : ''} style={{ backgroundColor: isShipToChecked ? '#fff' : '#e5e5e5', width: '100%', border: 'none', outline: 'none', padding: '2px 5px' }} readOnly />
                      <div 
                        className="form-input-icon" 
                        style={{ 
                          background: isShipToChecked ? 'linear-gradient(to bottom, #7ca0e6, #507bce)' : '#f0f0f0', 
                          borderLeft: '1px solid #aaa',
                          cursor: isShipToChecked ? 'pointer' : 'default',
                          color: isShipToChecked ? 'white' : '#888',
                          padding: '0 6px'
                        }}
                        onClick={() => isShipToChecked && setShowShippingModal(true)}
                      >
                        <BookIcon />
                      </div>
                    </div>
                    {customer && (
                      <div style={{ fontSize: '12px', marginTop: '2px', lineHeight: '1.4', fontWeight: 'bold' }}>
                        <div>{customer.firstName} {customer.lastName}</div>
                      </div>
                    )}
                  </div>
                </div>

                {(selectedOption === 'Layaway' || selectedOption === 'Special Order' || selectedOption === 'Custom Order' || selectedOption === 'Repair') && (
                  <>
                    {selectedOption !== 'Repair' && (
                      <div className="form-group" style={{ justifyContent: 'flex-end', marginTop: '5px' }}>
                        <label style={{ minWidth: 'auto', marginRight: '5px' }}>Hard Ship Date</label>
                        <input type="checkbox" defaultChecked />
                      </div>
                    )}
                    <div className="form-group" style={{ justifyContent: 'flex-end', position: 'relative' }}>
                      <label style={{ minWidth: 'auto', marginRight: '5px' }}>
                        {selectedOption === 'Repair' ? 'Approx Compl. Date' : 'Ship Date'}
                      </label>
                      <div className="form-input-with-icon" style={{ width: '100px' }}>
                        <input type="text" style={{ width: '100%' }} value={\`\${String(shipSelectedDate.getMonth() + 1).padStart(2, '0')}/\${String(shipSelectedDate.getDate()).padStart(2, '0')}/\${shipSelectedDate.getFullYear()}\`} readOnly />
                        <div className="form-input-icon gray" style={{ padding: '0 2px', cursor: 'pointer' }} onClick={() => setShowShipDatePicker(!showShipDatePicker)}>
                          <CalendarIcon />
                        </div>
                      </div>
                      {showShipDatePicker && (
                        <div className="date-picker-popup">
                          <div className="date-picker-header">
                            <button onClick={() => setShipCurrentMonth(new Date(shipCurrentMonth.getFullYear(), shipCurrentMonth.getMonth() - 1, 1))}>◀</button>
                            <div className="date-picker-month-year">
                              {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][shipCurrentMonth.getMonth()]} <span>{shipCurrentMonth.getFullYear()}</span>
                              <span style={{ fontSize: '10px' }}>↕</span>
                            </div>
                            <button onClick={() => setShipCurrentMonth(new Date(shipCurrentMonth.getFullYear(), shipCurrentMonth.getMonth() + 1, 1))}>▶</button>
                          </div>
                          <div className="date-picker-grid">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="date-picker-day-name">{d}</div>)}
                            {[...Array(new Date(shipCurrentMonth.getFullYear(), shipCurrentMonth.getMonth(), 1).getDay())].map((_, i) => <div key={\`empty-\${i}\`}></div>)}
                            {[...Array(new Date(shipCurrentMonth.getFullYear(), shipCurrentMonth.getMonth() + 1, 0).getDate())].map((_, i) => {
                              const day = i + 1;
                              const isSelected = shipSelectedDate.getDate() === day && shipSelectedDate.getMonth() === shipCurrentMonth.getMonth() && shipSelectedDate.getFullYear() === shipCurrentMonth.getFullYear();
                              return (
                                <div 
                                  key={day} 
                                  className={\`date-picker-day \${isSelected ? 'selected' : ''}\`}
                                  onClick={() => {
                                    setShipSelectedDate(new Date(shipCurrentMonth.getFullYear(), shipCurrentMonth.getMonth(), day));
                                    setShowShipDatePicker(false);
                                  }}
                                >
                                  {day}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    {selectedOption === 'Layaway' ? (
                      <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                        <label style={{ minWidth: 'auto', marginRight: '5px' }}>Next Due Date</label>
                        <div className="form-input-with-icon" style={{ width: '100px' }}>
                          <input type="text" style={{ width: '100%' }} />
                          <div className="form-input-icon gray" style={{ padding: '0 2px' }}>
                            <CalendarIcon />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                          <label style={{ minWidth: 'auto', marginRight: '5px' }}>Rush Order</label>
                          <input type="checkbox" />
                        </div>
                        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                          <label style={{ minWidth: 'auto', marginRight: '5px' }}>Christmas Order</label>
                          <input type="checkbox" />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}
          
          <div className="right-form-block">
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
            )}`;

lines.splice(startIdx, endIdx - startIdx + 1, newBlock);
fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log("Successfully replaced lines.");
