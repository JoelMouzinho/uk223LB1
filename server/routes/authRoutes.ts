import express from "express";
import { AuthService } from "../services/authService";
import { Database } from "../database";

const router = express.Router();
const database = new Database();
const authService = new AuthService(database);


router.post("/register", async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const result = await authService.register(name, email, password, confirmPassword);
        res.status(201).json({ message: result });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await authService.login(email, password);
        res.status(200).json({ token });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
});

export default router;