import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables (same as index.ts)
dotenv.config();

import User from "../models/User";

/**
 * Migration Script: Backfill avatars and usernames for all existing users.
 *
 * - Users without a picture (or with the default "no-photo.jpg") get a random boring-avatars URL.
 * - Users without a username get one generated from their name + random suffix.
 */

const AVATAR_VARIANTS = ["beam", "marble", "pixel", "sunset", "ring", "bauhaus"];
const AVATAR_COLORS = "264653,2a9d8f,e9c46a,f4a261,e76f51";

function generateRandomAvatar(name: string): string {
    const variant = AVATAR_VARIANTS[Math.floor(Math.random() * AVATAR_VARIANTS.length)];
    const seed = `${name.replace(/\s+/g, "")}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    return `https://source.boringavatars.com/${variant}/120/${encodeURIComponent(seed)}?colors=${AVATAR_COLORS}`;
}

function generateUsername(name: string): string {
    const base = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 15);
    const suffix = Math.floor(Math.random() * 9999);
    return `${base || "user"}${suffix}`;
}

async function migrate() {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("✅ Connected to MongoDB\n");

    const users = await User.find({});
    console.log(`📋 Found ${users.length} users in the database.\n`);

    let avatarUpdated = 0;
    let usernameUpdated = 0;
    const usedUsernames = new Set<string>();

    // Collect existing usernames to avoid collisions
    for (const user of users) {
        if ((user as any).username) {
            usedUsernames.add((user as any).username);
        }
    }

    for (const user of users) {
        const updates: Record<string, string> = {};

        // Backfill avatar
        if (!user.picture || user.picture === "no-photo.jpg") {
            updates.picture = generateRandomAvatar(user.name);
            avatarUpdated++;
        }

        // Backfill username
        if (!(user as any).username) {
            let candidate = generateUsername(user.name);
            // Ensure uniqueness
            while (usedUsernames.has(candidate)) {
                candidate = generateUsername(user.name);
            }
            usedUsernames.add(candidate);
            updates.username = candidate;
            usernameUpdated++;
        }

        if (Object.keys(updates).length > 0) {
            await User.updateOne({ _id: user._id }, { $set: updates });
            console.log(`  ✏️  Updated user "${user.name}" (${user.email}):`, Object.keys(updates).join(", "));
        } else {
            console.log(`  ✔️  User "${user.name}" already has avatar & username — skipped.`);
        }
    }

    console.log(`\n🎉 Migration complete!`);
    console.log(`   Avatars updated:   ${avatarUpdated}`);
    console.log(`   Usernames updated: ${usernameUpdated}`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit(0);
}

migrate().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
