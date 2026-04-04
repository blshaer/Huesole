import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config();

async function cleanup() {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("✅ Connected to MongoDB\n");

    const identifiers = ["blshaer", "baraa.programmer"];
    
    // Find users with these identifiers in either username, email, or name
    const matches = await User.find({
        $or: [
            { username: { $in: identifiers } },
            { email: { $in: identifiers } },
            { name: { $in: identifiers } }
        ]
    });

    console.log(`📋 Found ${matches.length} matches for [${identifiers.join(", ")}]:`);
    matches.forEach(m => console.log(`  - ${m.name} (@${(m as any).username}) | ${m.email}`));

    const matchIds = matches.map(m => m._id);

    if (matchIds.length === 0) {
        console.log("⚠️  Could not find blshaer or baraa.programmer. ABORTING deletion to prevent data loss.");
        await mongoose.disconnect();
        return;
    }

    // Delete all users except these two
    const result = await User.deleteMany({
        _id: { $nin: matchIds }
    });

    console.log(`\n🗑️  Deleted ${result.deletedCount} users.`);
    console.log(`✨ Kept ${matchIds.length} users.`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit(0);
}

cleanup().catch(err => {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
});
