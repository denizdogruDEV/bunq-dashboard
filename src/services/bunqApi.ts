import { User, MonetaryAccountResponse, PaymentData, Balance } from '../types';

// Configuration for test/demo mode
const IS_TEST_MODE = true; // Set this to false when you have a real API key
const API_KEY = IS_TEST_MODE ? 'TEST_API_KEY' : 'YOUR_API_KEY';
const BASE_URL = 'https://api.bunq.com/v1';

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

// Generate a consistent color based on account ID
function generateAccountColor(accountId: number): string {
  // Array of colors for accounts
  const colors = [
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FFC107', // Amber
    '#9C27B0', // Purple
    '#FF5722', // Deep Orange
    '#00BCD4', // Cyan
    '#3F51B5', // Indigo
    '#795548'  // Brown
  ];
  
  // Use account ID to pick a color from the array
  return colors[accountId % colors.length];
}

// Map a monetary account to a simplified account format
function mapMonetaryAccountToAccount(monetaryAccount: MonetaryAccountResponse): Account {
  if (!monetaryAccount.MonetaryAccountBank) {
    // Return a default account structure instead of null
    return {
      id: 0,
      description: 'Unknown Account',
      balance: '0',
      currency: 'EUR',
      iban: '',
      accountName: 'Unknown Account',
      displayName: 'Unknown Account',
      color: '#CCCCCC' // Default gray color for unknown accounts
    };
  }
  
  const account = monetaryAccount.MonetaryAccountBank;
  const ibanAlias = account.alias?.find((a: any) => a.type === 'IBAN') || account.alias?.[0];
  
  return {
    id: account.id,
    description: account.description || 'Account',
    balance: account.balance.value,
    currency: account.balance.currency,
    iban: ibanAlias?.value || '',
    accountName: ibanAlias?.name || account.description || 'Account',
    displayName: ibanAlias?.name || account.description || 'Account',
    color: generateAccountColor(account.id) // Add a color based on account ID
  };
}

// Function for future real API calls when IS_TEST_MODE is false
async function fetchFromApi(endpoint: string, method = 'GET', data?: any): Promise<any> {
  if (IS_TEST_MODE) {
    throw new Error('fetchFromApi should not be called in test mode');
  }

  const token = localStorage.getItem('bunq_session_token');
  const headers: HeadersInit = {
    'X-Bunq-Client-Authentication': token || API_KEY,
    'Content-Type': 'application/json',
    'User-Agent': 'BunqReactDashboard'
  };

  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// API methods
// Define the Account type here to avoid circular dependencies
interface Account {
  id: number;
  description: string;
  balance: string;
  currency: string;
  iban: string;
  accountName: string;
  displayName?: string;
  color?: string;
}

export const bunqApi = {
  // Authentication
  async authenticate(): Promise<{ success: boolean; error?: any }> {
    if (IS_TEST_MODE) {
      // For test mode, simulate a successful authentication
      localStorage.setItem('bunq_session_token', 'test_session_token');
      return { success: true };
    }
    
    try {
      // Real API implementation using fetch instead of axios
      // Step 1: Installation
      const installationResponse = await fetchFromApi('/installation', 'POST', {
        client_public_key: 'YOUR_PUBLIC_KEY'
      });
      
      // Store the installation token
      const installationToken = installationResponse.Response[1].Token.token;
      localStorage.setItem('bunq_installation_token', installationToken);
      
      // Step 2: Create a device server
      await fetchFromApi('/device-server', 'POST', {
        description: 'React Dashboard',
        secret: API_KEY,
        permitted_ips: ['*']
      });
      
      // Step 3: Create a session
      const sessionResponse = await fetchFromApi('/session-server', 'POST', {
        secret: API_KEY
      });
      
      const sessionToken = sessionResponse.Response[1].Token.token;
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
      const response = await fetchFromApi('/user');
      return response.Response;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  },
  
  // Get monetary accounts (bank accounts)
  async getAccounts(): Promise<MonetaryAccountResponse[]> {
    if (IS_TEST_MODE) {
      // Return mock accounts with a delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      return MOCK_DATA.accounts as MonetaryAccountResponse[];
    }
    
    try {
      const response = await fetchFromApi('/user/{userId}/monetary-account');
      return response.Response;
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
      const response = await fetchFromApi(`/user/{userId}/monetary-account/${accountId}/payment`);
      return response.Response;
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
      const response = await fetchFromApi(`/user/{userId}/monetary-account/${accountId}`);
      return response.Response[0].MonetaryAccountBank.balance;
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