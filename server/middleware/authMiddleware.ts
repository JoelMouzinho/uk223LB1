import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    userID?: number;
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(403).json({ error: "Access denied. No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
        req.userID = decoded.userID; // `userID` wird dem angepassten `AuthRequest` hinzugefügt
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid token." });
    }
}