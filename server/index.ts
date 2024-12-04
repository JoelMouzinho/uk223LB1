import express, { Express, Request, Response } from 'express';
import http from 'http';
import { resolve } from 'path';
import { Database } from './database';
import AuthController from './routes/authRoutes';
import PostController from './routes/postRoutes';
import cors from 'cors';
import dotenv from 'dotenv';

// Lade .env-Variablen
dotenv.config();

class Backend {
  // Properties
  private _app: Express;
  private _database: Database;
  private _env: any;

  // Getters
  public get app(): Express {
    return this._app;
  }

  public get database(): Database {
    return this._database;
  }

  // Constructor
  constructor() {
    this._app = express();
    this._database = new Database();
    this._env = process.env.NODE_ENV;

    this.setupMiddlewares();
    this.setupStaticFiles();
    this.setupRoutes();
    this.startServer();
  }

  // Middlewares
  private setupMiddlewares(): void {
    this._app.use(cors());
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
  }

  // Serve static files
  private setupStaticFiles(): void {
    const clientPath = resolve('client');
    this._app.use(express.static(clientPath));
  }

  // Define routes
  private setupRoutes(): void {
    const clientPath = resolve('client');

    // Serve signup.html
    this._app.get('/signup', (req: Request, res: Response) => {
      res.sendFile(`${clientPath}/signup.html`);
    });

    // Serve login.html
    this._app.get('/login', (req: Request, res: Response) => {
      res.sendFile(`${clientPath}/login.html`);
    });

    // Serve index.html
    this._app.get('/', (req: Request, res: Response) => {
      res.sendFile(`${clientPath}/index.html`);
    });

    // Authentication routes
    const authController = new AuthController(this.database);
    this._app.use('/auth', authController.router);
    // Posts routes
    const postController = new PostController(this.database);
    this._app.use('/', postController.router);
  }

  // Start server
  private startServer(): void {
    const port = process.env.PORT;

    http.createServer(this._app).listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  }
}

const backend = new Backend();
export const viteNodeApp = backend.app;