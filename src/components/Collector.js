"use client";

import React from 'react';

export default function Collector({ collector }) {
  if (!collector || !collector.name) return <p>No collector set.</p>;

  const pendingEntries = Object.entries(collector.pending || {}).filter(([_,amt])=>amt>0);
  const totalPending = pendingEntries.reduce((sum,[_,amt])=>sum+amt,0);
  const totalBalance = collector.savings + totalPending;

  return (
    <div className="tab-content active">
      <div className="section">
        <h2 className="section-title">👤 PG Collection Summary</h2>
        <div className="summary-cards">
          <div className="summary-card"><h3>👤 Collector</h3><div className="amount">{collector.name}</div></div>
          <div className="summary-card"><h3>💵 Collected</h3><div className="amount balance-positive">₹{collector.collected.toFixed(2)}</div></div>
          <div className="summary-card"><h3>💸 Paid Out</h3><div className="amount balance-negative">₹{collector.paid.toFixed(2)}</div></div>
          <div className="summary-card"><h3>📊 Net Savings</h3><div className={`amount ${collector.savings>=0?'balance-positive':'balance-negative'}`}>₹{collector.savings.toFixed(2)}</div></div>

          {pendingEntries.length>0 && (
            <div className="summary-card">
              <h3>⏳ Pending Amounts</h3>
              <div>{pendingEntries.map(([r,a])=><p key={r}>{r}: ₹{a.toFixed(2)}</p>)}</div>
            </div>
          )}
          <div className="summary-card">
            <h3>💰 Total Balance</h3>
            <div className={`amount ${totalBalance>=0?'balance-positive':'balance-negative'}`}>₹{totalBalance.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
