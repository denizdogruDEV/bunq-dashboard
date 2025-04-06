import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Account } from '../../types';

interface AccountCardProps {
  account: Account;
  isSelected: boolean;
  onClick: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, isSelected, onClick }) => {
  return (
    <div 
      className={`account-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ borderLeftColor: account.color }}
    >
      <h3>{account.description}</h3>
      <div className="account-details">
        <div className="account-name">{account.displayName}</div>
        {account.iban && <div className="account-iban-preview">{account.iban}</div>}
      </div>
      <div 
        className="account-balance"
        style={{ color: account.color }}
      >
        {formatCurrency(account.balance, account.currency)}
      </div>
    </div>
  );
};

export default AccountCard;