import express, { Router, Request, Response } from "express";
import { AuthService } from "../services/authService";
import { Database } from "../database";
import { verifyToken } from "../middleware/authMiddleware";

class AuthController {
  private _router: Router;
  private _authService: AuthService;

  constructor(database: Database) {
    this._router = Router();
    this._authService = new AuthService(database);
    this.setupRoutes();
  }

  // Getter für den Router
  public get router(): Router {
    return this._router;
  }

  // Routendefinition
  private setupRoutes(): void {
    this._router.post("/register", this.register.bind(this));
    this._router.post("/login", this.login.bind(this));
    this._router.get("/profile", verifyToken, this.getProfile.bind(this));
    this._router.put("/profile", verifyToken, this.updateProfile.bind(this));
  }

  // Registrierung eines Benutzers
  private async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, confirmPassword } = req.body;
      const result = await this._authService.register(name, email, password, confirmPassword);
      res.status(201).json({ message: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Anmeldung eines Benutzers
  private async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this._authService.login(email, password);
      res.status(200).json({ token });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  // Benutzerprofil abrufen
  private async getProfile(req: Request & { userID?: number }, res: Response): Promise<void> {
    try {
      const userID = req.userID;
      if (!userID) {
        throw new Error("User ID not found");
      }

      const profile = await this._authService.getUserProfile(userID);
      delete profile.password; // Entferne Passwort aus der Antwort
      res.status(200).json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Benutzerprofil aktualisieren
  private async updateProfile(req: Request & { userID?: number }, res: Response): Promise<void> {
    try {
      const userID = req.userID;
      if (!userID) {
        throw new Error("User ID not found");
      }

      const { name, email, password } = req.body;
      const result = await this._authService.updateUserProfile(userID, { name, email, password });
      res.status(200).json({ message: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default AuthController;