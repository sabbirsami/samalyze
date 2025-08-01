import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || 'ai_support';
const collectionName = process.env.MONGODB_TICKETS_COLLECTION || 'tickets';

let client: MongoClient;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any;

async function connect() {
  if (db) return db;
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export async function createTicket(ticketData: {
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const db = await connect();
    const result = await db.collection(collectionName).insertOne({
      ...ticketData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('Ticket created in MongoDB:', result.insertedId);
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error creating ticket in MongoDB:', error);
    throw error;
  }
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
  try {
    const db = await connect();
    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
    );
    console.log('Ticket updated in MongoDB:', result);
    return result;
  } catch (error) {
    console.error('Error updating ticket in MongoDB:', error);
    throw error;
  }
}

export async function deleteTicket(id: string) {
  try {
    const db = await connect();
    const result = await db.collection(collectionName).deleteOne({
      _id: new ObjectId(id),
    });
    console.log('Ticket deleted from MongoDB:', result);
    return result;
  } catch (error) {
    console.error('Error deleting ticket from MongoDB:', error);
    throw error;
  }
}

export async function deleteMultipleTickets(ids: string[]) {
  try {
    const db = await connect();
    const objectIds = ids.map((id) => new ObjectId(id));
    const result = await db.collection(collectionName).deleteMany({
      _id: { $in: objectIds },
    });
    console.log('Multiple tickets deleted from MongoDB:', result);
    return result;
  } catch (error) {
    console.error('Error deleting multiple tickets from MongoDB:', error);
    throw error;
  }
}

export async function getTickets() {
  try {
    const db = await connect();
    const tickets = await db.collection(collectionName).find().sort({ createdAt: -1 }).toArray();
    // Convert MongoDB documents to match expected format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return tickets.map((ticket: any) => ({
      id: ticket._id.toString(),
      email: ticket.email,
      subject: ticket.subject,
      message: ticket.message,
      status: ticket.status,
      sentiment: ticket.sentiment,
      intent: ticket.intent,
      ai_response: ticket.ai_response,
      created_at: ticket.createdAt,
      updated_at: ticket.updatedAt,
    }));
  } catch (error) {
    console.error('Error getting tickets from MongoDB:', error);
    return [];
  }
}

export async function getTicketById(id: string) {
  try {
    const db = await connect();
    const ticket = await db.collection(collectionName).findOne({
      _id: new ObjectId(id),
    });

    if (!ticket) return null;

    return {
      id: ticket._id.toString(),
      email: ticket.email,
      subject: ticket.subject,
      message: ticket.message,
      status: ticket.status,
      sentiment: ticket.sentiment,
      intent: ticket.intent,
      ai_response: ticket.ai_response,
      created_at: ticket.createdAt,
      updated_at: ticket.updatedAt,
    };
  } catch (error) {
    console.error('Error getting ticket by ID from MongoDB:', error);
    return null;
  }
}

export async function getTicketStats() {
  try {
    const db = await connect();
    const collection = db.collection(collectionName);
    const [total, pending, processing, resolved] = await Promise.all([
      collection.countDocuments(),
      collection.countDocuments({ status: 'pending' }),
      collection.countDocuments({ status: 'processing' }),
      collection.countDocuments({ status: 'resolved' }),
    ]);
    return { total, pending, processing, resolved };
  } catch (error) {
    console.error('Error getting ticket stats from MongoDB:', error);
    return { total: 0, pending: 0, processing: 0, resolved: 0 };
  }
}

// Close connection when needed
export async function closeConnection() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
