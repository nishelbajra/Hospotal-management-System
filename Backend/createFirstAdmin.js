import mongoose from "mongoose";
import { User } from "./models/userSchema.js";
import { config } from "dotenv";
import bcrypt from "bcrypt";

// Load environment variables
config({ path: "./config/.env" });

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Hospital_Management_System",
        });
        console.log(" Connected to MongoDB");
    } catch (error) {
        console.error(" MongoDB connection error:", error);
        process.exit(1);
    }
};

// Create first admin account
const createFirstAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: "Admin" });
        if (existingAdmin) {
            console.log("  Admin account already exists!");
            console.log(" Email:", existingAdmin.email);
            console.log("\n If you forgot the password, delete this admin from MongoDB and run this script again.");
            return;
        }

        // Create new admin
        const adminData = {
            firstName: "Admin",
            lastName: "Bajra Care",
            email: "admin@bajracare.com",
            phone: "1234567890",
            nic: "123456789012",
            dob: new Date("1990-01-01"),
            gender: "Male",
            password: "admin123456", // Change this password after first login!
            role: "Admin",
        };

        const admin = await User.create(adminData);

        console.log("\n First admin account created successfully!");
        console.log("\n Admin Login Credentials:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(" Email:    admin@bajracare.com");
        console.log(" Password: admin123456");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n  IMPORTANT: Change this password after your first login!");
        console.log("\n Access admin dashboard at: http://localhost:5174");

    } catch (error) {
        console.error(" Error creating admin:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("\n Database connection closed");
    }
};

// Run the script
const run = async () => {
    await connectDB();
    await createFirstAdmin();
    process.exit(0);
};

run();
