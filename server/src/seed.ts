import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import HomeGradient from "./models/HomeGradient";
import User from "./models/User";
import connectDB from "./config/db";

dotenv.config();

const seedGradients = async () => {
    try {
        await connectDB();

        // Path to gradients.json in the client directory
        const jsonPath = path.join(__dirname, "../../client/src/shared/lib/gradients.json");
        const rawData = fs.readFileSync(jsonPath, "utf-8");
        const gradients = JSON.parse(rawData);

        console.log(`Found ${gradients.length} gradients in JSON.`);

        // Clear existing home gradients
        await HomeGradient.deleteMany({});
        console.log("Cleared existing HomeGradients.");

        const uniqueGradients = new Map();
        gradients.forEach((g: any) => {
            if (g.name && g.colors && g.colors.length > 0 && !uniqueGradients.has(g.name)) {
                uniqueGradients.set(g.name, {
                    name: g.name,
                    colors: g.colors,
                    type: "linear",
                    angle: 90
                });
            }
        });

        const gradientsToSeed = Array.from(uniqueGradients.values());
        console.log(`Prepared ${gradientsToSeed.length} unique gradients for seeding.`);

        await HomeGradient.insertMany(gradientsToSeed, { ordered: false });
        console.log(`Successfully seeded ${gradientsToSeed.length} gradients.`);

        // --- Seed Admin User ---
        console.log("Seeding Admin User...");
        const adminEmail = "blshaer@outlook.com";
        const adminPassword = "082132096Baraa*";

        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            admin.role = "admin";
            admin.isVerified = true;
            admin.password = adminPassword;
            await admin.save();
            console.log(`Updated existing user ${adminEmail} to Admin.`);
        } else {
            await User.create({
                name: "Admin",
                email: adminEmail,
                password: adminPassword,
                role: "admin",
                isVerified: true
            });
            console.log(`Created new Admin user: ${adminEmail}`);
        }

        console.log("Seeding complete!");
        process.exit();
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedGradients();
