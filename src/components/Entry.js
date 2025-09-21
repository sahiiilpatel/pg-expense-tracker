"use client";

import React, { useState, useEffect } from 'react';

export default function Entry({ transactions, setTransactions, personList, collector, setCollector }) {
  const [transactionType, setTransactionType] = useState('collection');
  const [collectionDate, setCollectionDate] = useState('');
  const [rentMonth, setRentMonth] = useState('');
  const [amountCollected, setAmountCollected] = useState('');
  const [collectionStatus, setCollectionStatus] = useState('paid');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [fromPerson, setFromPerson] = useState('');
  const [expensePaidBy, setExpensePaidBy] = useState('');
  const [expenseType, setExpenseType] = useState('rent');
  const [expenseMonth, setExpenseMonth] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');

  useEffect(() => {
    const today = new Date();
    setCollectionDate(today.toISOString().slice(0, 10));
    setRentMonth(today.toISOString().slice(0, 7));
    setExpenseMonth(today.toISOString().slice(0, 7));
  }, []);

  const addEntry = () => {
    if (transactionType === 'collection') {
      if (!fromPerson || !rentMonth || !amountCollected) return alert('Fill fields');
      const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        collectionDate,
        type: 'collection',
        fromPerson,
        toPerson: collector.name,
        rentMonth,
        amount: parseFloat(amountCollected),
        status: collectionStatus,
        description: collectionDescription || `${fromPerson} → ${collector.name} (${rentMonth})`
      };
      setTransactions([...transactions, entry]);

      // Update collector pending / collected
      const updatedCollector = { ...collector };
      if (collectionStatus === 'paid') {
        updatedCollector.collected += parseFloat(amountCollected);
        updatedCollector.pending[fromPerson] = (updatedCollector.pending[fromPerson] || 0) - parseFloat(amountCollected);
        if (updatedCollector.pending[fromPerson] < 0) updatedCollector.pending[fromPerson] = 0;
      } else {
        updatedCollector.pending[fromPerson] = (updatedCollector.pending[fromPerson] || 0) + parseFloat(amountCollected);
      }
      setCollector(updatedCollector);
      alert('Collection added!');
    } else {
      if (!expensePaidBy || !expenseMonth || !expenseAmount) return alert('Fill expense fields');
      const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        collectionDate,
        type: 'expense',
        paidBy: expensePaidBy,
        month: expenseMonth,
        expenseType,
        amount: parseFloat(expenseAmount),
        description: expenseDescription
      };
      setTransactions([...transactions, entry]);
    }

    // Reset fields
    setAmountCollected('');
    setCollectionDescription('');
    setExpenseAmount('');
    setExpenseDescription('');
  };

  return (
    <div className="tab-content active">
      <div className="section">
        <h2 className="section-title">➕ Add New Entry</h2>
        <div className="form-group">
          <label>Transaction Type</label>
          <select value={transactionType} onChange={e => setTransactionType(e.target.value)}>
            <option value="collection">Rent Collection</option>
            <option value="expense">Expense Payment</option>
          </select>
        </div>

        {transactionType === 'collection' ? (
          <div>
            <div className="form-group">
              <label>Payer</label>
              <select value={fromPerson} onChange={e => setFromPerson(e.target.value)}>
                <option value="">Select Person</option>
                {(personList || []).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>For Which Months Rent?</label>
              <input type="month" value={rentMonth} onChange={e => setRentMonth(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input type="number" value={amountCollected} onChange={e => setAmountCollected(e.target.value)} placeholder="Enter amount" />
            </div>
            <div className="form-group">
              <label>Payment Status</label>
              <select value={collectionStatus} onChange={e => setCollectionStatus(e.target.value)}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" value={collectionDescription} onChange={e => setCollectionDescription(e.target.value)} placeholder="Optional notes" />
            </div>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label>Who is Paying?</label>
              <select value={expensePaidBy} onChange={e => setExpensePaidBy(e.target.value)}>
                <option value="">Select Person</option>
                {personList.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Expense Type</label>
              <select value={expenseType} onChange={e => setExpenseType(e.target.value)}>
                <option value="rent">House Rent</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Expense Month</label>
              <input type="month" value={expenseMonth} onChange={e => setExpenseMonth(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Amount Paid</label>
              <input type="number" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} placeholder="Enter amount" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" value={expenseDescription} onChange={e => setExpenseDescription(e.target.value)} placeholder="Brief description" />
            </div>
          </div>
        )}

        <button onClick={addEntry}>Add Entry</button>
      </div>
    </div>
  );
}
