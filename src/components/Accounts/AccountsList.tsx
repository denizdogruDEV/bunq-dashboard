import React from 'react';
import AccountCard from './AccountCard';
import { Account } from '../../types';

interface AccountsListProps {
  accounts: Account[];
  selectedAccountId?: number;
  onAccountSelect: (account: Account) => void;
}

const AccountsList: React.FC<AccountsListProps> = ({ 
  accounts, 
  selectedAccountId, 
  onAccountSelect 
}) => {
  if (!accounts || accounts.length === 0) {
    return <div className="no-accounts">No accounts found</div>;
  }
  
  return (
    <div className="accounts-list">
      {accounts.map(account => (
        <AccountCard
          key={account.id}
          account={account}
          isSelected={account.id === selectedAccountId}
          onClick={() => onAccountSelect(account)}
        />
      ))}
    </div>
  );
};

export default AccountsList;