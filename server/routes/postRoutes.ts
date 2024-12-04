import express, { Router, Request, Response } from "express";
import { Post } from "../models/post";
import { verifyToken } from "../middleware/authMiddleware";
import { Database } from "../database";

class PostController {
    private _router: Router;
    private _posts: Post;

    constructor(database: Database) {
        this._router = Router();
        this._posts = new Post(database); // Übergabe der Instanz von Database
        this.setupRoutes();
    }

    // Getter für den Router
    public get router(): Router {
        return this._router;
    }

    // Routen initialisieren
    private setupRoutes() {
        this._router.post("/posts", verifyToken, this.createPost.bind(this));
        this._router.get("/posts", verifyToken, this.getPosts.bind(this));
    }

    // Beitrag erstellen
    private async createPost(req: Request, res: Response): Promise<void> {
        const { content } = req.body;

        if (!content) {
            res.status(400).json({ error: "Content is required." });
            return;
        }

        try {
            const userID = (req as any).userID; // Angenommene Benutzer-ID aus dem Token
            const postId = await this._posts.createPost(userID, content); // Verwendung von _posts
            res.status(201).json({ message: "Post created successfully", postId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create post." });
        }
    }

    // Beiträge abrufen
    private async getPosts(req: Request, res: Response) {
        try {
            const posts = await this._posts.getPosts(); // Verwendung von _posts
            console.log("Posts in Controller:", posts); // Debugging
            res.status(200).json({ posts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch posts." });
        }
    }
}

export default PostController;