import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { User, MonetaryAccount, PaymentData, Balance } from '../types';

// Configuration for test/demo mode
const IS_TEST_MODE = true; // Set this to false when you have a real API key
const API_KEY = IS_TEST_MODE ? 'TEST_API_KEY' : 'YOUR_API_KEY';
const BASE_URL = 'https://api.bunq.com/v1';

// Create an axios instance with default configuration
const bunqApiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Bunq-Client-Authentication': API_KEY,
    'Content-Type': 'application/json',
    'User-Agent': 'BunqReactDashboard'
  }
});

// Request interceptor to add authentication headers
bunqApiClient.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem('bunq_session_token');
    if (token && config.headers) {
      config.headers['X-Bunq-Client-Authentication'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock data for test mode
const MOCK_DATA = {
  user: {
    UserPerson: {
      id: 1,
      display_name: 'Test User',
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com'
    }
  },
  accounts: [
    {
      MonetaryAccountBank: {
        id: 1,
        description: 'Main Account',
        balance: {
          value: '2458.32',
          currency: 'EUR'
        },
        alias: [
          {
            type: 'IBAN',
            value: 'NL00BUNQ0000000000',
            name: 'Test User'
          }
        ]
      }
    },
    {
      MonetaryAccountBank: {
        id: 2,
        description: 'Savings',
        balance: {
          value: '12789.54',
          currency: 'EUR'
        },
        alias: [
          {
            type: 'IBAN',
            value: 'NL00BUNQ0000000001',
            name: 'Test User'
          }
        ]
      }
    },
    {
      MonetaryAccountBank: {
        id: 3,
        description: 'Joint Account',
        balance: {
          value: '543.21',
          currency: 'EUR'
        },
        alias: [
          {
            type: 'IBAN',
            value: 'NL00BUNQ0000000002',
            name: 'Test User & Partner'
          }
        ]
      }
    }
  ],
  transactions: {
    1: generateMockTransactions(30, 1),
    2: generateMockTransactions(15, 2),
    3: generateMockTransactions(10, 3)
  }
};

// Helper function to generate random transactions
function generateMockTransactions(count: number, accountId: number): PaymentData[] {
  const counterparties = [
    'Supermarket', 'Coffee Shop', 'Gas Station', 'Online Store',
    'Restaurant', 'Mobile Provider', 'Utility Bill', 'Salary', 
    'Rent', 'Insurance', 'Streaming Service', 'Public Transport'
  ];
  
  const transactions: PaymentData[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const isIncoming = Math.random() > 0.7;
    const amount = isIncoming 
      ? (Math.random() * 1000 + 100).toFixed(2) 
      : (-1 * Math.random() * 100 - 10).toFixed(2);
    
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const counterparty = counterparties[Math.floor(Math.random() * counterparties.length)];
    const description = isIncoming 
      ? (counterparty === 'Salary' ? 'Monthly Salary' : `Refund from ${counterparty}`)
      : `Payment to ${counterparty}`;
    
    transactions.push({
      Payment: {
        id: accountId * 1000 + i,
        amount: {
          value: amount,
          currency: 'EUR'
        },
        counterparty_alias: {
          display_name: counterparty
        },
        description: description,
        created: date.toISOString()
      }
    });
  }
  
  return transactions;
}

// Map a monetary account to a simplified account format
function mapMonetaryAccountToAccount(monetaryAccount: MonetaryAccount) {
  if (!monetaryAccount.MonetaryAccountBank) {
    return null;
  }
  
  const account = monetaryAccount.MonetaryAccountBank;
  const ibanAlias = account.alias?.find(a => a.type === 'IBAN') || account.alias?.[0];
  
  return {
    id: account.id,
    description: account.description || 'Account',
    balance: account.balance.value,
    currency: account.balance.currency,
    iban: ibanAlias?.value || '',
    accountName: ibanAlias?.name || account.description || 'Account'
  };
}

// API methods
export const bunqApi = {
  // Authentication
  async authenticate(): Promise<{ success: boolean; error?: any }> {
    if (IS_TEST_MODE) {
      // For test mode, simulate a successful authentication
      localStorage.setItem('bunq_session_token', 'test_session_token');
      return { success: true };
    }
    
    try {
      // Real API implementation
      const installationResponse = await bunqApiClient.post('/installation', {
        client_public_key: 'YOUR_PUBLIC_KEY'
      });
      
      // Store the installation token
      const installationToken = installationResponse.data.Response[1].Token.token;
      localStorage.setItem('bunq_installation_token', installationToken);
      
      // Create a device server
      await bunqApiClient.post('/device-server', {
        description: 'React Dashboard',
        secret: API_KEY,
        permitted_ips: ['*']
      }, {
        headers: {
          'X-Bunq-Client-Authentication': installationToken
        }
      });
      
      // Create a session
      const sessionResponse = await bunqApiClient.post('/session-server', {
        secret: API_KEY
      }, {
        headers: {
          'X-Bunq-Client-Authentication': installationToken
        }
      });
      
      const sessionToken = sessionResponse.data.Response[1].Token.token;
      localStorage.setItem('bunq_session_token', sessionToken);
      
      return { success: true };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error };
    }
  },
  
  // Get user information
  async getUserInfo(): Promise<User[]> {
    if (IS_TEST_MODE) {
      // Return mock user data with a delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return [MOCK_DATA.user as User];
    }
    
    try {
      const response = await bunqApiClient.get('/user');
      return response.data.Response;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  },
  
  // Get monetary accounts (bank accounts)
  async getAccounts(): Promise<MonetaryAccount[]> {
    if (IS_TEST_MODE) {
      // Return mock accounts with a delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      return MOCK_DATA.accounts as MonetaryAccount[];
    }
    
    try {
      const response = await bunqApiClient.get('/user/{userId}/monetary-account');
      return response.data.Response;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },
  
  // Get transactions for an account
  async getTransactions(accountId: number): Promise<PaymentData[]> {
    if (IS_TEST_MODE) {
      // Return mock transactions for the specified account with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return MOCK_DATA.transactions[accountId as keyof typeof MOCK_DATA.transactions] || [];
    }
    
    try {
      const response = await bunqApiClient.get(`/user/{userId}/monetary-account/${accountId}/payment`);
      return response.data.Response;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },
  
  // Get account balance
  async getBalance(accountId: number): Promise<Balance> {
    if (IS_TEST_MODE) {
      // Return mock balance for the specified account
      await new Promise(resolve => setTimeout(resolve, 300));
      const account = MOCK_DATA.accounts.find(acc => acc.MonetaryAccountBank.id === accountId);
      return account ? account.MonetaryAccountBank.balance : { value: '0', currency: 'EUR' };
    }
    
    try {
      const response = await bunqApiClient.get(`/user/{userId}/monetary-account/${accountId}`);
      return response.data.Response[0].MonetaryAccountBank.balance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  },
  
  // Logout
  logout(): void {
    localStorage.removeItem('bunq_session_token');
    localStorage.removeItem('bunq_installation_token');
  },
  
  // Map monetary account to simplified account format
  mapMonetaryAccountToAccount
};

// Export the IS_TEST_MODE constant for use in other components
export { IS_TEST_MODE };