"use client";

import React, { useState } from 'react';

export default function Settings({ personList, setPersonList, collector, setCollector, monthlyResidents, setMonthlyResidents }) {
  const [newPersonName, setNewPersonName] = useState('');
  const [residentMonth, setResidentMonth] = useState(new Date().toISOString().slice(0,7));
  const [residentCount, setResidentCount] = useState(4);
  const [totalRent, setTotalRent] = useState(6000);

  const addPerson = () => {
    const name = newPersonName.trim();
    if (!name) return alert('Enter name');
    if (personList.includes(name)) return alert('Person exists');
    setPersonList([...personList, name]);
    setNewPersonName('');
  };

  const removePerson = (name) => {
    if (collector.name===name) return alert('Cannot remove collector');
    setPersonList(personList.filter(p=>p!==name));
  };

  const setCollectorHandler = (name) => {
    if (!name) return alert('Select a collector');
    setCollector({...collector,name});
    alert(`${name} set as collector`);
  };

  const updateResidents = () => {
    setMonthlyResidents({...monthlyResidents, [residentMonth]: {residentCount, totalRent}});
    alert('Monthly rent info updated!');
  };

  const exportData = () => {
    const data = { transactions: [], monthlyResidents, personList, collector, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download='pg-expense-data.json';
    link.click();
  };

  const clearAllData = () => {
    if (!window.confirm('Clear all?')) return;
    setPersonList(['Person A','Person B','Person C','Person D']);
    setCollector({name:'',collected:0,paid:0,savings:0,pending:{}});
    setMonthlyResidents({});
  };

  return (
    <div className="tab-content active">
      <div className="section">
        <h2 className="section-title">👥 Manage People</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Add New Person</label>
            <input type="text" value={newPersonName} onChange={e=>setNewPersonName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>&nbsp;</label>
            <button onClick={addPerson}>Add Person</button>
          </div>
        </div>
        <div className="person-list">
          {personList.map(p=>(
            <div className="person-badge" key={p}>
              {p} {collector.name!==p && <button className="remove-person" onClick={()=>removePerson(p)}>×</button>}
              {collector.name===p && <span className="collector-tag"> (Collector)</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">👤 Set PG Collector</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Select Collector</label>
            <select onChange={e=>setCollectorHandler(e.target.value)}>
              <option value="">Select Person</option>
              {personList.map(p=>(
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">🏠 Monthly Rent Setup</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Month</label>
            <input type="month" value={residentMonth} onChange={e=>setResidentMonth(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Number of Residents</label>
            <input type="number" value={residentCount} onChange={e=>setResidentCount(e.target.value)} min="1" />
          </div>
          <div className="form-group">
            <label>Total House Rent</label>
            <input type="number" value={totalRent} onChange={e=>setTotalRent(e.target.value)} min="0" step="0.01" />
          </div>
        </div>
        <button onClick={updateResidents}>Update Rent Info</button>
      </div>

      <div className="section">
        <h2 className="section-title">🗑️ Data Management</h2>
        <button style={{background:'#4caf50',color:'white'}} onClick={exportData}>Export Data</button>
        <button style={{background:'#f44336',color:'white'}} onClick={clearAllData}>Clear All Data</button>
      </div>
    </div>
  );
}
