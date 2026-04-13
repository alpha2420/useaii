
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: '.env.local' });

async function checkDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URL!);
        console.log("Connected to MongoDB");
        
        const db = mongoose.connection.db;
        const convCount = await db?.collection('conversations').countDocuments();
        const statCount = await db?.collection('whatsappstatuses').countDocuments();
        
        console.log(`Total Conversations: ${convCount}`);
        console.log(`Total WhatsApp Statuses: ${statCount}`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDb();
