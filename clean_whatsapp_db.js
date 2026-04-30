const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function run() {
    await mongoose.connect(process.env.MONGODB_URL);
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    let dropped = 0;
    for (const c of collections) {
        if (c.name.startsWith("whatsapp-")) {
            console.log("Dropping " + c.name);
            await db.dropCollection(c.name);
            dropped++;
        }
    }
    console.log(`Dropped ${dropped} bloated WhatsApp cache collections.`);
    process.exit(0);
}
run().catch(console.error);
