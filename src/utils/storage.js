export function loadData() {
  if (typeof window === 'undefined') {
    return {
      transactions: [],
      monthlyResidents: {},
      personList: [],
      collector: { name: '', collected: 0, paid: 0, savings: 0, pending: {} },
    };
  }

  return {
    transactions: JSON.parse(localStorage.getItem('hostelTransactions')) || [],
    monthlyResidents: JSON.parse(localStorage.getItem('monthlyResidents')) || {},
    personList: JSON.parse(localStorage.getItem('personList')) || [],
    collector: JSON.parse(localStorage.getItem('pgCollector')) || { name: '', collected: 0, paid: 0, savings: 0, pending: {} },
  };
}

export function saveData({ transactions, monthlyResidents, personList, collector }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hostelTransactions', JSON.stringify(transactions));
  localStorage.setItem('monthlyResidents', JSON.stringify(monthlyResidents));
  localStorage.setItem('personList', JSON.stringify(personList));
  localStorage.setItem('pgCollector', JSON.stringify(collector));
}
