import React, { useEffect, useState } from 'react';

function CashCheckSummaryReport({ date, format, onClose }) {
  const [tenderSummary, setTenderSummary] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5001/api/reports/tender-summary')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setTenderSummary(data.data);
      })
      .catch(err => console.error("Error", err));
  }, [date]);

  const totalForDay = tenderSummary.reduce((sum, ts) => sum + Number(ts.total), 0);
  const checkDeposit = tenderSummary.filter(ts => ts.payment_type.toUpperCase() === 'CHECK').reduce((sum, ts) => sum + Number(ts.total), 0);
  
  const totalCash = 0;
  const openingAmount = 0;
  const cashDeposit = 0;
  const bankDepositTotal = checkDeposit + cashDeposit;
  const overShort = bankDepositTotal - totalForDay;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'white',
      zIndex: 2000, overflow: 'auto', padding: '40px', fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={onClose} style={{ padding: '5px 15px', cursor: 'pointer', background: '#ccc', border: '1px solid #999' }}>Back to Closeout</button>
        <button onClick={() => window.print()} style={{ padding: '5px 15px', cursor: 'pointer', background: '#0055aa', color: 'white', border: 'none', fontWeight: 'bold' }}>
          {format === 'Excel' ? 'Download Excel' : 'Print / Save as PDF'}
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Demosparkle</h2>
          <h3 style={{ margin: '5px 0', fontSize: '16px' }}>Edison</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', fontWeight: 'bold' }}>
            <span>Terminal #: POS</span>
            <span style={{ fontSize: '15px' }}>Cash & Check Summary</span>
            <span>Tender date : {date}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', marginLeft: '50px' }}>
          <span style={{ width: '120px', textAlign: 'right' }}>Total for the day</span>
          <div style={{ backgroundColor: '#e5e5e5', padding: '2px 10px', width: '100px', textAlign: 'right' }}>${totalForDay.toFixed(2)}</div>
          <span style={{ fontSize: '13px' }}>(Auto Generated based on cash and check sales only )</span>
        </div>

        <div style={{ display: 'flex', gap: '50px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[100, 50, 20, 10, 5, 1].map(d => (
              <div key={d} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#e5e5e5', width: '50px', textAlign: 'right', padding: '2px 5px' }}>0</div>
                <div style={{ width: '30px', textAlign: 'right' }}>{d}</div>
                <div style={{ backgroundColor: '#e5e5e5', width: '80px', textAlign: 'right', padding: '2px 5px' }}>$0.00</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[0.25, 0.10, 0.05, 0.01].map(d => (
              <div key={d} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#e5e5e5', width: '50px', textAlign: 'right', padding: '2px 5px' }}>0</div>
                <div style={{ width: '30px', textAlign: 'right' }}>{d.toFixed(2)}</div>
                <div style={{ backgroundColor: '#e5e5e5', width: '80px', textAlign: 'right', padding: '2px 5px' }}>$0.00</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '110px', textAlign: 'right' }}>Total Cash</span>
            <div style={{ backgroundColor: '#e5e5e5', padding: '2px 10px', width: '100px', textAlign: 'right' }}>${totalCash.toFixed(2)}</div>
            <span style={{ fontSize: '13px' }}>(Sum of the cash that is physically in the</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '110px', textAlign: 'right' }}>Opening Amount</span>
            <div style={{ backgroundColor: '#e5e5e5', padding: '2px 10px', width: '100px', textAlign: 'right' }}>${openingAmount.toFixed(2)}</div>
            <span style={{ fontSize: '13px' }}>(Sales Person Enters amount Manually)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '110px', textAlign: 'right' }}>Cash Deposit</span>
            <div style={{ backgroundColor: '#e5e5e5', padding: '2px 10px', width: '100px', textAlign: 'right' }}>${cashDeposit.toFixed(2)}</div>
            <span style={{ fontSize: '13px' }}>(Total Cash - Opening Amount)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '110px', textAlign: 'right' }}>Check Deposit</span>
            <div style={{ backgroundColor: '#e5e5e5', padding: '2px 10px', width: '100px', textAlign: 'right' }}>${checkDeposit.toFixed(2)}</div>
            <span style={{ fontSize: '13px' }}>(Amount from Tender Summary)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <span style={{ width: '110px', textAlign: 'right' }}>BANK DEPOSIT TOTAL</span>
            <div style={{ backgroundColor: '#e5e5e5', padding: '2px 10px', width: '100px', textAlign: 'right' }}>${bankDepositTotal.toFixed(2)}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '110px', textAlign: 'right' }}>Over/Short</span>
            <div style={{ backgroundColor: '#e5e5e5', padding: '2px 10px', width: '100px', textAlign: 'right' }}>${overShort.toFixed(2)}</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CashCheckSummaryReport;
