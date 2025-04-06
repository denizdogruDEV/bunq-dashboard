import React, { useState } from 'react';
import { AuthProvider } from './components/Auth/AuthContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import TestModeIndicator from './components/TestModeIndicator';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  return (
    <AuthProvider>
      <div className="app">
        {!isAuthenticated ? (
          <Login onLogin={() => setIsAuthenticated(true)} />
        ) : (
          <Dashboard />
        )}
        <TestModeIndicator />
      </div>
    </AuthProvider>
  );
};

export default App;