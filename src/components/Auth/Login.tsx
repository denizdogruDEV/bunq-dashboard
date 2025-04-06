import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { IS_TEST_MODE } from '../../services/bunqApi';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { login, error, loading } = useAuth();
  const [apiKey, setApiKey] = useState<string>('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (IS_TEST_MODE) {
      // In test mode, any value (or even empty) will work
      const success = await login();
      if (success) {
        onLogin();
      }
    } else {
      // In real mode, require API key
      if (!apiKey.trim()) {
        return;
      }
      
      // Store API key (in a real application, you'd want to handle this more securely)
      localStorage.setItem('bunq_api_key', apiKey);
      
      const success = await login();
      if (success) {
        onLogin();
      }
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h1>bunq Dashboard</h1>
        {IS_TEST_MODE && (
          <div className="test-mode-banner">
            Test Mode Active - Using Mock Data
          </div>
        )}
        <p>
          {IS_TEST_MODE 
            ? 'This is a demo version with mock data. Click "Enter Demo" to continue.' 
            : 'Connect to your bunq account to view your financial information'
          }
        </p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          {!IS_TEST_MODE && (
            <div className="form-group">
              <label htmlFor="apiKey">bunq API Key</label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your bunq API key"
                required
              />
              <small>
                You can create an API key in the bunq app or on the bunq website.
              </small>
            </div>
          )}
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading || (!IS_TEST_MODE && !apiKey.trim())}
          >
            {loading ? 'Connecting...' : (IS_TEST_MODE ? 'Enter Demo' : 'Connect to bunq')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;