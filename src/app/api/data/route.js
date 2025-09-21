import { readJSON, writeJSON } from "../../../utils/fileStorage";

export async function GET(req) {
  const transactions = readJSON("transactions.json") || [];
  const users = readJSON("users.json") || [];
  const monthlyResidents = readJSON("monthlyResidents.json") || {};
  const collector = readJSON("collector.json") || { name: "", collected: 0, paid: 0, savings: 0, pending: {} };

  return new Response(JSON.stringify({ transactions, users, monthlyResidents, collector }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  const body = await req.json();
  const { transactions, users, monthlyResidents, collector } = body;

  if (transactions) writeJSON("transactions.json", transactions);
  if (users) writeJSON("users.json", users);
  if (monthlyResidents) writeJSON("monthlyResidents.json", monthlyResidents);
  if (collector) writeJSON("collector.json", collector);

  return new Response(JSON.stringify({ message: "Data saved" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
