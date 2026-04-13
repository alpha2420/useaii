
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkStats() {
    try {
        await mongoose.connect(process.env.MONGODB_URL!);
        const db = mongoose.connection.db;
        
        const users = await db?.collection('users').find({}).toArray();
        console.log("Registered Users:");
        for (const user of users!) {
            const count = await db?.collection('conversations').countDocuments({ ownerId: user._id.toString() });
            console.log(`- ${user.email} (${user._id}): ${count} conversations`);
        }
        
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}

checkStats();
