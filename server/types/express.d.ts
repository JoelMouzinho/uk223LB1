import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            userID?: number; // Füge hier die userID hinzu
        }
    }
}