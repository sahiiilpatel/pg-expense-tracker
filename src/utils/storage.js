export async function loadData() {
  const res = await fetch("/api/data");
  if (!res.ok) throw new Error("Failed to fetch data");
  const data = await res.json();

  return {
    transactions: data.transactions || [],
    users: data.users || [],
    personList: data.personList || [],
    monthlyResidents: data.monthlyResidents || {},
    collector: data.collector || { name: "", collected: 0, paid: 0, savings: 0, pending: {} },
  };
}

export async function saveData({ transactions, users, monthlyResidents, collector }) {
  try {
    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactions, users, monthlyResidents, collector }),
    });
  } catch (err) {
    console.error("Failed to save data:", err);
  }
}
