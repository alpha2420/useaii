import connectDb from '../src/lib/db';
import User from '../src/model/user.model';
import mongoose from 'mongoose';

async function getUsers() {
    await connectDb();
    const users = await User.find().lean();
    console.log("Users:", users.map(u => ({ id: u._id, email: u.email })));
    process.exit(0);
}
getUsers();
