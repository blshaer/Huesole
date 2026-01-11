import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import User from "../models/User";
import connectDB from "../config/db";

dotenv.config();

const seedUsers = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB...");

        const initialCount = await User.countDocuments();
        console.log(`Initial user count: ${initialCount}`);

        const users = [];
        const password = "password123";
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("Generating 1000 fake users...");

        for (let i = 0; i < 1000; i++) {
            const hasGradients = Math.random() > 0.5;
            const createdGradients = [];

            if (hasGradients) {
                const numGradients = Math.floor(Math.random() * 5) + 1;
                for (let j = 0; j < numGradients; j++) {
                    createdGradients.push({
                        id: faker.string.uuid(),
                        name: faker.music.songName() + " Gradient",
                        colors: [faker.color.rgb(), faker.color.rgb()],
                        type: faker.helpers.arrayElement(["linear", "radial", "conic"]),
                        angle: Math.floor(Math.random() * 360),
                        createdAt: faker.date.past(),
                    });
                }
            }

            // Generate email with safe TLDs for the strict regex
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const provider = faker.helpers.arrayElement(["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]);
            const email = faker.internet.email({ firstName, lastName, provider });

            users.push({
                name: `${firstName} ${lastName}`,
                email: email,
                password: hashedPassword,
                picture: faker.image.avatar(),
                isVerified: true,
                role: "user",
                createdGradients: createdGradients,
                favorites: [],
                createdAt: faker.date.past(),
            });
        }

        console.log("Inserting users into database...");
        // ordered: false allows continuing even if some fail
        try {
            await User.insertMany(users, { ordered: false });
        } catch (e: any) {
            if (e.writeErrors) {
                console.log(`Some inserts failed (${e.writeErrors.length} errors). This is expected if emails collide.`);
            } else {
                throw e;
            }
        }

        const finalCount = await User.countDocuments();
        console.log(`Final user count: ${finalCount}`);
        console.log(`Successfully added ${finalCount - initialCount} users!`);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();
