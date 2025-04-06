import React from 'react';
import TransactionItem from './TransactionItem';
import { Transaction } from '../../types';

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <div className="no-transactions">No transactions found</div>;
  }
  
  return (
    <div className="transactions-list">
      {transactions.map(transaction => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
        />
      ))}
    </div>
  );
};

export default TransactionsList;