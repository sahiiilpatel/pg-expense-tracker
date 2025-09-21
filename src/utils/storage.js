export async function loadData() {
  const res = await fetch("/api/data");
  if (!res.ok) throw new Error("Failed to fetch data");
  const data = await res.json();
  return data;
}

export async function saveData(data) {
  const res = await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save data");
  return await res.json();
}
