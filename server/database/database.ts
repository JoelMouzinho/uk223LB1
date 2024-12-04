import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { USER_TABLE, POST_TABLE, COMMENT_TABLE, LIKE_TABLE } from './schema';
import dotenv from 'dotenv';

// Lade .env-Variablen
dotenv.config();

export class Database {
  // Properties
  private _pool: mysql.Pool;

  // Constructor
  constructor() {
    this._pool = mysql.createPool({
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionLimit: 5,
    });
    this.initializeDBSchema();
  }

  // Methods
  private initializeDBSchema = async () => {
    console.log('Initializing DB schema...');
    await this.executeSQL(USER_TABLE);
    await this.executeSQL(POST_TABLE);
    await this.executeSQL(COMMENT_TABLE);
    await this.executeSQL(LIKE_TABLE);
  };

  public async executeSQL<T extends RowDataPacket[]>(query: string, values?: any): Promise<T> {
    const conn = await this._pool.getConnection();
    try {
        const [results] = await conn.query<T>(query, values);
        return results;
    } catch (err) {
        console.error("Error executing query:", err);
        throw new Error("Database query failed.");
    } finally {
        conn.release(); // Verbindung zurückgeben
    }
}
}