import connectDb from '../src/lib/db';
import Conversation from '../src/model/conversation.model';

async function checkConvos() {
    await connectDb();
    const convos = await Conversation.aggregate([
        { $group: { _id: "$ownerId", count: { $sum: 1 } } }
    ]);
    console.log("Conversations per owner:", convos);
    process.exit(0);
}
checkConvos();
