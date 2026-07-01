import API_BASE_URL from '../config.js';
import React, { useState, useEffect } from 'react';
import './DatabaseViewer.css';

const tables = [
  { name: 'POS Invoices (Real Sales)', endpoint: '/api/pos_invoices' },
  { name: 'POS Payments (Real Data)', endpoint: '/api/pos_invoice_payments' },
  { name: 'Repair Orders', endpoint: '/api/db/repair_orders' },
  { name: 'Repair Order Lines', endpoint: '/api/db/repair_lines' },
  { name: 'Repair Order Payments', endpoint: '/api/db/repair_payments' },
  { name: 'Customers', endpoint: '/api/customers' },
  { name: 'Employees', endpoint: '/api/employees' },
  { name: 'Branches', endpoint: '/api/branches' },
  { name: 'Accounts', endpoint: '/api/accounts' },
  { name: 'Transactions', endpoint: '/api/transactions' },
  { name: 'Students', endpoint: '/api/students' },
  { name: 'Grades', endpoint: '/api/grades' },
  { name: 'Owns', endpoint: '/api/owns' }
];

const DatabaseViewer = () => {
  const [activeTab, setActiveTab] = useState(tables[0].name);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      setError(null);
      const activeTableInfo = tables.find(t => t.name === activeTab);
      
      try {
        const response = await fetch(`${API_BASE_URL}${activeTableInfo.endpoint}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [activeTab]);

  return (
    <div className="database-viewer">
      <div className="db-tabs">
        {tables.map(table => (
          <button 
            key={table.name} 
            className={`db-tab ${activeTab === table.name ? 'active' : ''}`}
            onClick={() => setActiveTab(table.name)}
          >
            {table.name}
          </button>
        ))}
      </div>

      <div className="db-content">
        <h2>{activeTab} Data</h2>
        {loading && <p>Loading data...</p>}
        {error && <p className="error-text">Error fetching data: {error}</p>}
        
        {!loading && !error && data.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(data[0]).map(key => (
                    <th key={key}>{key.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, cellIdx) => (
                      <td key={cellIdx}>{val !== null && val !== undefined ? String(val) : 'NULL'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && !error && data.length === 0 && (
          <p className="no-data">No data available in this table.</p>
        )}
      </div>
    </div>
  );
};

export default DatabaseViewer;
