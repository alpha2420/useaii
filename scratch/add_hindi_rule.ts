
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Settings from '../src/model/settings.model.js'; // Might need to adjust path or use dynamic import

dotenv.config({ path: '.env.local' });

async function updateInstructions() {
    try {
        await mongoose.connect(process.env.MONGODB_URL!);
        const ownerId = "69cabe61a4e168e957b7a651";
        const rule = "If the customer speaks Hindi, always answer in Hindi.";
        
        const setting = await mongoose.connection.db?.collection('settings').findOne({ ownerId });
        let currentInstructions = setting?.agentInstructions || "";
        
        if (!currentInstructions.includes(rule)) {
            const nextInstructions = currentInstructions + (currentInstructions ? "\n\n" : "") + rule;
            await mongoose.connection.db?.collection('settings').updateOne(
                { ownerId },
                { $set: { agentInstructions: nextInstructions } },
                { upsert: true }
            );
            console.log("Rule added successfully!");
        } else {
            console.log("Rule already exists.");
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateInstructions();
