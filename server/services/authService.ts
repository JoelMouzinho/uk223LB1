import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Database } from "../database";
import dotenv from 'dotenv';

// Lade .env-Variablen
dotenv.config();

export class AuthService {
    private database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    /**
     * Registers a new user.
     * @param email User's email
     * @param password User's password
     * @param confirmPassword Password confirmation
     */
    public async register(name: string, email: string, password: string, confirmPassword: string): Promise<string> {
        if (!name || !email || !password || !confirmPassword) {
            throw new Error("All fields are required.");
        }

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO User (name, email, password, role)
            VALUES (?, ?, ?, 'user')
        `;

        try {
            await this.database.executeSQL(query, [name, email, hashedPassword]);
            return "Registration successful!";
        } catch (error: any) {
            if (error.code === "ER_DUP_ENTRY") {
                throw new Error("Email is already registered.");
            }
            throw new Error("Failed to register the user.");
        }
    }

    /**
     * Logs in a user and generates a JWT.
     * @param email User's email
     * @param password User's password
     */
    public async login(email: string, password: string): Promise<string> {
        if (!email || !password) {
            throw new Error("Email and password are required.");
        }

        const query = `SELECT userID, password, role FROM User WHERE email = ?`;
        const rows = await this.database.executeSQL(query, [email]) as any;

        if (rows.length === 0) {
            throw new Error("Invalid email or password.");
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid email or password.");
        }

        const token = jwt.sign(
            { userID: user.userID, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return token;
    }

    public async getUserProfile(userID: number): Promise<any> {
        const query = `SELECT userID, name, email FROM User WHERE userID = ?`;
    
        const rows = await this.database.executeSQL(query, [userID]);
        if (!rows || rows.length === 0) {
            throw new Error("User not found.");
        }
    
        return rows[0]; // Gibt Benutzerinformationen zurück (ohne Passwort).
    }
    
    public async updateUserProfile(userID: number, data: { name?: string; email?: string; password?: string }): Promise<string> {
        const { name, email, password } = data;
    
        const updates: string[] = [];
        const values: any[] = [];
    
        if (name) {
            updates.push("name = ?");
            values.push(name);
        }
        if (email) {
            updates.push("email = ?");
            values.push(email);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push("password = ?");
            values.push(hashedPassword);
        }
    
        if (updates.length === 0) {
            throw new Error("No fields to update.");
        }
    
        values.push(userID);
    
        const query = `UPDATE User SET ${updates.join(", ")} WHERE userID = ?`;
    
        await this.database.executeSQL(query, values);
        return "Profile updated successfully!";
    }
}