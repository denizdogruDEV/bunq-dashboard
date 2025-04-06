// Updated type definitions based on actual bunq API responses

export interface User {
  UserPerson: {
    id: number;
    display_name: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface Balance {
  currency: string;
  value: string;
}

export interface Alias {
  type: string;
  value: string;
  name: string;
}

export interface Avatar {
  uuid: string;
  image: {
    attachment_public_uuid: string;
    height: number;
    width: number;
    content_type: string;
    urls: {
      type: string;
      url: string;
    }[];
  }[];
  anchor_uuid: string;
  style: string;
}

export interface Setting {
  color: string;
  icon: string | null;
  default_avatar_status: string;
  restriction_chat: string;
  sdd_expiration_action: string;
}

export interface MonetaryAccountBank {
  id: number;
  created: string;
  updated: string;
  alias: Alias[];
  avatar: Avatar;
  balance: Balance;
  country: string;
  currency: string;
  display_name: string;
  daily_limit: Balance;
  description: string;
  public_uuid: string;
  status: string;
  sub_status: string;
  timezone: string;
  user_id: number;
  setting: Setting;
  overdraft_limit: Balance;
}

export interface MonetaryAccountResponse {
  MonetaryAccountBank: MonetaryAccountBank;
}

export interface ApiResponse<T> {
  Response: T[];
  Pagination?: {
    future_url?: string;
    newer_url?: string;
    older_url?: string;
  };
}

// Simplified types for the UI components
export interface Account {
  id: number;
  description: string;
  balance: string;
  currency: string;
  displayName: string;
  iban: string | null;
  color: string;
}

export interface Transaction {
  id: number;
  amount: string;
  currency: string;
  counterpartyName: string;
  description: string;
  created: Date;
}

export interface PaymentData {
  Payment: {
    id: number;
    amount: Balance;
    counterparty_alias: {
      display_name: string;
    };
    description: string;
    created: string;
  };
}

export interface AuthContextType {
  user: User[] | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}