import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { bunqApi } from '../../services/bunqApi';
import AccountsList from '../Accounts/AccountsList';
import TransactionsList from '../Transactions/TransactionsList';
import { Account, Transaction, MonetaryAccountResponse } from '../../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchAccounts();
  }, []);
  
  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions(selectedAccount.id);
    }
  }, [selectedAccount]);
  
  const fetchAccounts = async (): Promise<void> => {
    try {
      setLoading(true);
      const accountsData = await bunqApi.getAccounts();
      
      // Map the API response to our UI model
      const formattedAccounts: Account[] = accountsData.map(account => 
        bunqApi.mapMonetaryAccountToAccount(account)
      );
      
      setAccounts(formattedAccounts);
      
      if (formattedAccounts.length > 0) {
        setSelectedAccount(formattedAccounts[0]);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch accounts');
      setLoading(false);
      console.error('Error fetching accounts:', err);
    }
  };
  
  const fetchTransactions = async (accountId: number): Promise<void> => {
    try {
      setLoading(true);
      const transactionsData = await bunqApi.getTransactions(accountId);
      
      const formattedTransactions: Transaction[] = transactionsData.map(transaction => ({
        id: transaction.Payment.id,
        amount: transaction.Payment.amount.value,
        currency: transaction.Payment.amount.currency,
        counterpartyName: transaction.Payment.counterparty_alias.display_name,
        description: transaction.Payment.description,
        created: new Date(transaction.Payment.created)
      }));
      
      setTransactions(formattedTransactions);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch transactions');
      setLoading(false);
      console.error('Error fetching transactions:', err);
    }
  };
  
  const handleAccountSelect = (account: Account): void => {
    setSelectedAccount(account);
  };
  
  const userName = user && user[0] ? user[0].UserPerson.display_name : '';
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>bunq Dashboard</h1>
        <div className="user-info">
          {userName && <span>Welcome, {userName}</span>}
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      
      <div className="dashboard-content">
        <div className="accounts-section">
          <h2>Your Accounts</h2>
          <AccountsList 
            accounts={accounts} 
            selectedAccountId={selectedAccount?.id}
            onAccountSelect={handleAccountSelect}
          />
        </div>
        
        <div className="transactions-section">
          <h2>
            Transactions for {selectedAccount?.description}
            {selectedAccount?.iban && <div className="account-iban">{selectedAccount.iban}</div>}
          </h2>
          <TransactionsList transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;