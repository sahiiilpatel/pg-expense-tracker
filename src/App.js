"use client";

import { useState, useEffect } from 'react';
import Entry from './components/Entry';
import Records from './components/Records';
import Summary from './components/Summary';
import Collector from './components/Collector';
import Settings from './components/Settings';
import { loadData, saveData } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('entry');
  const [transactions, setTransactions] = useState([]);
  const [personList, setPersonList] = useState([]);
  const [collector, setCollector] = useState({});
  const [monthlyResidents, setMonthlyResidents] = useState({});
  const [isClient, setIsClient] = useState(false);

  // Load localStorage on client
  useEffect(() => {
    const data = loadData();
    setTransactions(data.transactions);
    setPersonList(data.personList);
    setCollector(data.collector);
    setMonthlyResidents(data.monthlyResidents);
    setIsClient(true);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!isClient) return;
    saveData({ transactions, personList, collector, monthlyResidents });
  }, [transactions, personList, collector, monthlyResidents, isClient]);

  if (!isClient) return null; // prevent hydration mismatch

  const renderTab = () => {
    switch (activeTab) {
      case 'entry':
        return <Entry transactions={transactions} setTransactions={setTransactions} personList={personList} collector={collector} setCollector={setCollector} />;
      case 'records':
        return <Records transactions={transactions} setTransactions={setTransactions} collector={collector} setCollector={setCollector} />;
      case 'summary':
        return <Summary transactions={transactions} />;
      case 'collector':
        return <Collector collector={collector} />;
      case 'settings':
        return <Settings personList={personList} setPersonList={setPersonList} collector={collector} setCollector={setCollector} monthlyResidents={monthlyResidents} setMonthlyResidents={setMonthlyResidents} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h1>🏠 PG Expense Tracker</h1>
      <p className="subtitle">Manage shared expenses and track monthly rent</p>

      <div className="tab-container">
        {['entry', 'records', 'summary', 'collector', 'settings'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'entry' && '📝 New Entry'}
            {tab === 'records' && '📊 All Records'}
            {tab === 'summary' && '💰 Summary'}
            {tab === 'collector' && '👤 PG Collection Summary'}
            {tab === 'settings' && '⚙️ Settings'}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  );
}
