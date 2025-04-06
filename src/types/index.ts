// User types
export interface UserPerson {
  id: number;
  display_name: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface User {
  UserPerson: UserPerson;
}

// Account types
export interface MonetaryAccountBank {
  id: number;
  description: string;
  balance: Balance;
  alias?: {
    type: string;
    value: string;
    name: string;
  }[];
}

export interface MonetaryAccountResponse {
  MonetaryAccountBank: MonetaryAccountBank;
}

export interface Balance {
  value: string;
  currency: string;
}

export interface Account {
  id: number;
  description: string;
  balance: string;
  currency: string;
  iban: string;
  accountName: string;
  color?: string;      // Optional color property
  displayName?: string; // Optional displayName property
}

// Transaction types
export interface Payment {
  id: number;
  amount: {
    value: string;
    currency: string;
  };
  counterparty_alias: {
    display_name: string;
  };
  description: string;
  created: string;
}

export interface PaymentData {
  Payment: Payment;
}

export interface Transaction {
  id: number;
  amount: string;
  currency: string;
  counterpartyName: string;
  description: string;
  created: Date;
}

// Auth context type
export interface AuthContextType {
  user: User[] | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}