import connectDb from "./shared/lib/db";
import User from "./backend/models/user.model";

async function run() {
    await connectDb();
    const users = await User.find({}, 'email name isSuperAdmin');
    console.log("Users:", users);
    process.exit(0);
}
run().catch(console.error);
