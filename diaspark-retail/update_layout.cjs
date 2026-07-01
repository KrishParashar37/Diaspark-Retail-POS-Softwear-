const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/SalesPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetLayout = `              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '20px', marginRight: '20px' }}>
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
              </div>`;

const newLayout = `              <div style={{ display: 'flex', gap: '20px', marginLeft: '20px', marginRight: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {(selectedOption !== 'Payment On Account' && selectedOption !== 'Payment (Open Order)' && selectedOption !== 'Appraisal' && selectedOption !== 'Gift Certificate' && selectedOption !== 'Gift Card') && (
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
                  )}
                </div>

                {(selectedOption === 'Layaway' || selectedOption === 'Special Order' || selectedOption === 'Custom Order' || selectedOption === 'Repair') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
                  </div>
                )}
              </div>`;

content = content.replace(targetLayout, newLayout);

const targetTabs = `                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 15px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc', fontSize: '11px', fontWeight: 'bold', color: 'blue' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div onClick={() => setGridData([...gridData, { serial: '', description: '', qty: 1, wt: '', price: 0, extPrice: 0 }])} style={{ cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', color: '#00008b', lineHeight: '10px', fontFamily: 'monospace' }}>+</div>
                        <div onClick={() => gridData.length > 0 && setGridData(gridData.slice(0, -1))} style={{ cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', color: '#cc0000', lineHeight: '10px', fontFamily: 'monospace' }}>-</div>
                      </div>
                      {selectedOption === 'Repair' && (
                        <div className="form-group" style={{ margin: '0 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <label style={{ minWidth: '85px', fontWeight: 'bold', color: 'black' }}>Transaction #</label>
                          <div className="form-input-with-icon" style={{ display: 'flex' }}>
                            <input type="text" style={{ width: '120px', height: '20px', fontSize: '12px', border: '1px solid #ccc' }} value={customTransNo} onChange={e => setCustomTransNo(e.target.value)} />
                            <div className="form-input-icon" style={{ height: '20px', width: '20px', backgroundColor: '#5c7ec4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookIcon /></div>
                          </div>
                        </div>
                      )}
                      <span onClick={() => setShowItemDetailModal(true)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{selectedOption === 'Repair' ? 'Repair Detail' : 'Serial #/Order Detail'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', paddingRight: '20px' }}>
                      <span onClick={() => setShowCustomerComponentModal(true)} style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue', fontWeight: 'bold' }}>Customer Component</span>
                      {selectedOption === 'Repair' && <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Alerts</span>}
                      <span onClick={() => setShowNotesModal(true)} style={{ fontSize: '18px', color: '#555', cursor: 'pointer', display: 'inline-block' }}>📎</span>
                    </div>
                  </div>`;

const newTabs = `                  <div style={{ display: 'flex', alignItems: 'center', padding: '5px 15px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc', fontSize: '11px', fontWeight: 'bold', color: 'blue' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '350px' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <div onClick={() => setGridData([...gridData, { serial: '', description: '', qty: 1, wt: '', price: 0, extPrice: 0 }])} style={{ cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', color: '#00008b', lineHeight: '10px', fontFamily: 'monospace' }}>+</div>
                        <div onClick={() => gridData.length > 0 && setGridData(gridData.slice(0, -1))} style={{ cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', color: '#cc0000', lineHeight: '10px', fontFamily: 'monospace' }}>-</div>
                      </div>
                      {selectedOption === 'Repair' && (
                        <div className="form-group" style={{ margin: '0 10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <label style={{ minWidth: '85px', fontWeight: 'bold', color: 'black' }}>Transaction #</label>
                          <div className="form-input-with-icon" style={{ display: 'flex' }}>
                            <input type="text" style={{ width: '120px', height: '20px', fontSize: '12px', border: '1px solid #ccc' }} value={customTransNo} onChange={e => setCustomTransNo(e.target.value)} />
                            <div className="form-input-icon" style={{ height: '20px', width: '20px', backgroundColor: '#5c7ec4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookIcon /></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                      <span onClick={() => setShowItemDetailModal(true)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{selectedOption === 'Repair' ? 'Repair Detail' : 'Serial #/Order Detail'}</span>
                      <span onClick={() => setShowCustomerComponentModal(true)} style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue', fontWeight: 'bold' }}>Customer Component</span>
                      {selectedOption === 'Repair' && <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Alerts</span>}
                    </div>

                    <div style={{ minWidth: '100px', display: 'flex', justifyContent: 'flex-end', paddingRight: '20px' }}>
                      <span onClick={() => setShowNotesModal(true)} style={{ fontSize: '18px', color: '#555', cursor: 'pointer', display: 'inline-block' }}>📎</span>
                    </div>
                  </div>`;

content = content.replace(targetTabs, newTabs);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Replaced successfully!");
