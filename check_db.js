const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function run() {
    await mongoose.connect(process.env.MONGODB_URL);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log("Looking for bloated collections...");
    for (const c of collections) {
        try {
            const stats = await db.command({ collStats: c.name });
            const sizeMb = stats.size / 1024 / 1024;
            if (sizeMb > 0) {
                console.log(`Collection ${c.name}: ${sizeMb.toFixed(2)} MB, count: ${stats.count}`);
            }
        } catch(e) {}
    }
    console.log("Done checking space.");
    process.exit(0);
}
run().catch(console.error);
