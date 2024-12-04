import express, { Express, Request, Response } from 'express'
import { API } from './api'
import http from 'http'
import { resolve, dirname } from 'path'
import { Database } from './database'
import authRoutes from "./routes/authRoutes";
import cors from 'cors';

class Backend {
  // Properties
  private _app: Express
  private _api: API
  private _database: Database
  private _env: string

  // Getters
  public get app(): Express {
    return this._app
  }

  public get api(): API {
    return this._api
  }

  public get database(): Database {
    return this._database
  }

  // Constructor
  constructor() {
    this._app = express()
    this._database = new Database()
    this._api = new API(this._app)
    this._env = process.env.NODE_ENV || 'development'

    this.setupMiddlewares();
    this.setupStaticFiles()
    this.setupRoutes()
    this.startServer()
  }

  private setupMiddlewares(): void {
    this._app.use(cors());
    this._app.use(express.json()); // Parse JSON request bodies
    this._app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
  }

  // Methods
  private setupStaticFiles(): void {
    this._app.use(express.static('client'))
  }

  private setupRoutes(): void {
    // Serve signup.html
    this._app.get('/signup', (req: Request, res: Response) => {
        const __dirname = resolve(dirname(''));
        res.sendFile(__dirname + '/client/signup.html');
    });

    this._app.get('/login', (req: Request, res: Response) => {
      const __dirname = resolve(dirname(''));
      res.sendFile(__dirname + '/client/login.html');
  });

    // Serve login.html
    this._app.get('/', (req: Request, res: Response) => {
        const __dirname = resolve(dirname(''));
        res.sendFile(__dirname + '/client/index.html');
    });

    // Add authentication routes
    this._app.use('/auth', authRoutes);
}

  private startServer(): void {
    if (this._env === 'production') {
      http.createServer(this.app).listen(3000, () => {
        console.log('Server is listening!')
      })
    }
  }
}

const backend = new Backend()
export const viteNodeApp = backend.app
