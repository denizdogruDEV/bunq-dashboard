import React from 'react';
import { IS_TEST_MODE } from '../services/bunqApi';

const TestModeIndicator: React.FC = () => {
  if (!IS_TEST_MODE) {
    return null;
  }
  
  return (
    <div className="test-mode-indicator">
      ⚠️ Using mock data - Test Mode Active
    </div>
  );
};

export default TestModeIndicator;