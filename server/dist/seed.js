"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const HomeGradient_1 = __importDefault(require("./models/HomeGradient"));
const User_1 = __importDefault(require("./models/User"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const seedGradients = async () => {
    try {
        await (0, db_1.default)();
        // Path to gradients.json in the client directory
        const jsonPath = path_1.default.join(__dirname, "../../client/src/shared/lib/gradients.json");
        const rawData = fs_1.default.readFileSync(jsonPath, "utf-8");
        const gradients = JSON.parse(rawData);
        console.log(`Found ${gradients.length} gradients in JSON.`);
        // Clear existing home gradients
        await HomeGradient_1.default.deleteMany({});
        console.log("Cleared existing HomeGradients.");
        const uniqueGradients = new Map();
        gradients.forEach((g, index) => {
            if (g.name && g.colors && g.colors.length > 0 && !uniqueGradients.has(g.name)) {
                uniqueGradients.set(g.name, {
                    name: g.name,
                    colors: g.colors,
                    colorsname: g.colorsname || [],
                    keywords: g.keywords || [],
                    type: "linear",
                    angle: 90,
                    order: index
                });
            }
        });
        const gradientsToSeed = Array.from(uniqueGradients.values());
        console.log(`Prepared ${gradientsToSeed.length} unique gradients for seeding.`);
        await HomeGradient_1.default.insertMany(gradientsToSeed);
        console.log(`Successfully seeded ${gradientsToSeed.length} gradients.`);
        // --- Seed Admin User ---
        console.log("Seeding Admin User...");
        const adminEmail = "blshaer@outlook.com";
        const adminPassword = "082132096Baraa*";
        let admin = await User_1.default.findOne({ email: adminEmail });
        if (admin) {
            admin.role = "admin";
            admin.isVerified = true;
            admin.password = adminPassword;
            await admin.save();
            console.log(`Updated existing user ${adminEmail} to Admin.`);
        }
        else {
            await User_1.default.create({
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
    }
    catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};
seedGradients();
