"use client";

import React, { useState } from 'react';

export default function Summary({ transactions }) {
  const [summaryMonth, setSummaryMonth] = useState(new Date().toISOString().slice(0,7));

  const collections = transactions.filter(t => t.type==='collection' && t.rentMonth===summaryMonth);
  const expenses = transactions.filter(t => t.type==='expense' && t.collectionDate.startsWith(summaryMonth));

  const totalCollected = collections.reduce((sum,t)=>sum+(t.status==='paid'?t.amount:0),0);
  const totalExpenses = expenses.reduce((sum,t)=>sum+t.amount,0);
  const net = totalCollected - totalExpenses;

  return (
    <div className="tab-content active">
      <div className="section">
        <h2 className="section-title">📈 Monthly Summary</h2>
        <div className="form-group" style={{maxWidth:'300px'}}>
          <label>Select Month</label>
          <input type="month" value={summaryMonth} onChange={e=>setSummaryMonth(e.target.value)} />
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <h3>💵 Collected</h3>
            <div className="amount">₹{totalCollected.toFixed(2)}</div>
          </div>
          <div className="summary-card">
            <h3>💸 Expenses</h3>
            <div className="amount">₹{totalExpenses.toFixed(2)}</div>
          </div>
          <div className="summary-card">
            <h3>📊 Net</h3>
            <div className={`amount ${net>=0?'balance-positive':'balance-negative'}`}>₹{net.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
