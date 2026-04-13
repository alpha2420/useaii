
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URL!);
        const db = mongoose.connection.db;
        
        const conversations = await db?.collection('conversations').find({}).toArray();
        console.log("Conversations found:");
        console.log(JSON.stringify(conversations, null, 2));
        
        const statuses = await db?.collection('whatsappstatuses').find({}).toArray();
        console.log("\nStatuses found:");
        console.log(JSON.stringify(statuses, null, 2));
        
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}

checkDb();
