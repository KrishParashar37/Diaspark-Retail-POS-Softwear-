import API_BASE_URL from '../config.js';
import React, { useState } from 'react';
import './LoginPage.css';

// We removed the real Google Client ID dependency so you can test the flow!

export default function LoginPage({ onLogin }) {
  const [companyName, setCompanyName] = useState('Demosparkle');
  const [store, setStore] = useState('Edison');
  const [terminal, setTerminal] = useState('Pos');
  const [email, setEmail] = useState('admin@diaspark.com'); // changed from loginId
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStandardLogin = async () => {
    if (!email || !password) {
      setError("Please enter both Email and Password.");
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        onLogin();
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async () => {
    // ════════ SIMULATED GOOGLE LOGIN ════════
    // Since we don't have a real Client ID, we will ask you for an email to simulate Google logging you in.
    const userEmail = prompt("SIMULATING GOOGLE LOGIN: Please enter any Google email address to test the flow:");
    if (!userEmail) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/login/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      
      const data = await response.json();
      if (data.success) {
        onLogin();
      } else {
        setError(data.error || "Google Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to process Google Login.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCompanyName('');
    setStore('');
    setTerminal('');
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
      <div className="login-page">
        <div className="login-top-bar">
          <div className="login-logo">
            <span className="logo-blue">DIASPARK</span><span className="logo-black"> Retail</span>
          </div>
        </div>

        <div className="login-content">
          <div className="login-box-wrapper">
            <div className="login-box">
              {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
              
              <div className="login-row">
                <label>Company Short Name</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
              <div className="login-row">
                <label>Store#</label>
                <input type="text" value={store} onChange={e => setStore(e.target.value)} />
              </div>
              <div className="login-row">
                <label>Terminal Name</label>
                <input type="text" value={terminal} onChange={e => setTerminal(e.target.value)} />
              </div>
              <div className="login-row">
                <label>Email ID</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="login-row">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              
              <div className="login-actions">
                <button className="login-btn" onClick={handleStandardLogin} disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <label className="remember-me">
                  <input type="checkbox" defaultChecked /> Remember Me
                </label>
              </div>

              <div className="google-login-container" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <button 
                  onClick={handleGoogleLoginSuccess} 
                  disabled={loading}
                  style={{
                    backgroundColor: 'white', color: 'black', padding: '10px 20px', 
                    border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer',
                    fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px'
                  }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" style={{width: '20px'}}/>
                  Sign in with Google (Simulated)
                </button>
              </div>

            </div>
            <div className="reset-tab" onClick={handleReset}>
              Reset
            </div>
          </div>
        </div>

        <div className="login-bottom-wave"></div>
      </div>
  );
}
