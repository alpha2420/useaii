
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkSystemHealth() {
    try {
        await mongoose.connect(process.env.MONGODB_URL!);
        const db = mongoose.connection.db;
        
        const statuses = await db?.collection('whatsappstatuses').find({}).toArray();
        console.log("System Health Report:");
        console.log("--------------------");
        for (const s of statuses!) {
            console.log(`Owner: ${s.ownerId}`);
            console.log(`- Connection Status: ${s.isReady ? "✅ CONNECTED" : "❌ WAITING FOR QR / DISCONNECTED"}`);
            
            if (s.providerStatus) {
                console.log(`- AI Provider Status:`);
                if (s.providerStatus.openai) {
                    console.log(`  - OpenAI: ❌ ${s.providerStatus.openai.error}`);
                } else {
                    console.log(`  - OpenAI: ✅ OK (No reported errors)`);
                }
                
                if (s.providerStatus.gemini) {
                    console.log(`  - Gemini: ❌ ${s.providerStatus.gemini.error}`);
                } else {
                    console.log(`  - Gemini: ✅ OK (No reported errors)`);
                }
            } else {
                console.log(`- AI Provider Status: ✅ ALL OK`);
            }
            console.log("");
        }
        
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}

checkSystemHealth();
