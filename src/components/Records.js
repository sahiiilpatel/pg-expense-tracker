"use client";

import React from 'react';

export default function Records({ transactions, setTransactions, collector, setCollector }) {

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);

    // Recalculate collector stats
    const newCollector = { ...collector, collected: 0, paid: 0, savings: 0, pending: {} };
    updatedTransactions.forEach(t => {
      if (t.type === 'collection') {
        if (t.status === 'paid') newCollector.collected += t.amount;
        else newCollector.pending[t.fromPerson] = (newCollector.pending[t.fromPerson] || 0) + t.amount;
      } else if (t.type === 'expense') {
        newCollector.paid += t.amount;
      }
    });
    newCollector.savings = newCollector.collected - newCollector.paid;

    setCollector(newCollector);
    setTransactions(updatedTransactions);
  };

  const markAsPaid = (id) => {
    const updatedTransactions = transactions.map(t => {
      if (t.id === id) {
        t.status = 'paid';
        return t;
      }
      return t;
    });

    const updatedCollector = { ...collector, collected: 0, paid: 0, savings: 0, pending: {} };
    updatedTransactions.forEach(t => {
      if (t.type === 'collection') {
        if (t.status === 'paid') updatedCollector.collected += t.amount;
        else updatedCollector.pending[t.fromPerson] = (updatedCollector.pending[t.fromPerson] || 0) + t.amount;
      } else if (t.type === 'expense') {
        updatedCollector.paid += t.amount;
      }
    });
    updatedCollector.savings = updatedCollector.collected - updatedCollector.paid;

    setCollector(updatedCollector);
    setTransactions(updatedTransactions);
  };

  return (
    <div className="tab-content active">
      <div className="section">
        <h2 className="section-title">📋 All Transactions</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Rent Month</th>
                <th>Type</th>
                <th>From → To</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Status / Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice().sort((a,b) => new Date(b.collectionDate) - new Date(a.collectionDate))
                .map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.collectionDate).toLocaleDateString()}</td>
                  <td>{t.rentMonth ? new Date(t.rentMonth+'-01').toLocaleDateString('en-US',{month:'short', year:'numeric'}) : '-'}</td>
                  <td>{t.type === 'collection' ? `💵 Collection (${t.status})` : '💸 Expense'}</td>
                  <td>{t.type==='collection' ? `${t.fromPerson} → ${t.toPerson}` : t.paidBy}</td>
                  <td className={t.type==='collection' ? 'balance-positive' : 'balance-negative'}>
                    ₹{t.amount.toFixed(2)}
                  </td>
                  <td>{t.description}</td>
                  <td>
                    {t.type==='collection' && t.status==='pending' && (
                      <button onClick={() => markAsPaid(t.id)}>Mark as Paid</button>
                    )}
                    <button className="delete-btn" onClick={() => deleteTransaction(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
