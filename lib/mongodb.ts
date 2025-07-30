import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || 'ai_support';
const collectionName = process.env.MONGODB_TICKETS_COLLECTION || 'tickets';

let client: MongoClient;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;

async function connect() {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

export async function createTicket(ticketData: {
  email: string;
  subject: string;
  message: string;
}) {
  const db = await connect();
  const result = await db.collection(collectionName).insertOne({
    ...ticketData,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function updateTicket(
  id: string,
  updates: {
    status?: string;
    sentiment?: string;
    intent?: string;
    ai_response?: string;
  },
) {
  const db = await connect();
  return db.collection(collectionName).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
  );
}

export async function getTickets() {
  const db = await connect();
  return db.collection(collectionName).find().sort({ createdAt: -1 }).toArray();
}

// Close connection when needed (for long-running processes)
export async function closeConnection() {
  if (client) {
    await client.close();
  }
}
