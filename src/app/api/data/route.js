import clientPromise from "../../../utils/mongo";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("pgtracker");
    console.log("Connected to MongoDB in GET API");
    const collection = db.collection("appData");

    const data = await collection.findOne({ _id: "main" });
    return new Response(JSON.stringify(data || {
      _id: "main",
      transactions: [],
      users: [],
      personList: [],
      monthlyResidents: {},
      collector: { name: "", collected: 0, paid: 0, savings: 0, pending: {} },
    }), { status: 200 });
  } catch (err) {
    console.error("DB connection error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { transactions, users, personList, monthlyResidents, collector } = await req.json();
    const client = await clientPromise;
    const db = client.db("pgtracker");
    const collection = db.collection("appData");

    await collection.updateOne(
      { _id: "main" },
      { $set: { transactions, users, personList, monthlyResidents, collector } },
      { upsert: true }
    );

    return new Response(JSON.stringify({ message: "Data saved" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
