import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Transaction } from '../../types';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isIncoming = parseFloat(transaction.amount) > 0;
  
  return (
    <div className={`transaction-item ${isIncoming ? 'incoming' : 'outgoing'}`}>
      <div className="transaction-date">
        {formatDate(transaction.created)}
      </div>
      <div className="transaction-details">
        <div className="counterparty">{transaction.counterpartyName}</div>
        <div className="description">{transaction.description}</div>
      </div>
      <div className="transaction-amount">
        {formatCurrency(transaction.amount, transaction.currency)}
      </div>
    </div>
  );
};

export default TransactionItem;