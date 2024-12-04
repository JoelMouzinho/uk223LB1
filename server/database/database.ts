import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { USER_TABLE, POST_TABLE, COMMENT_TABLE, LIKE_TABLE, NOTIFICATION_TABLE } from './schema';

export class Database {
  // Properties
  private _pool: mysql.Pool;

  // Constructor
  constructor() {
    this._pool = mysql.createPool({
      database: process.env.DB_NAME || 'minitwitter',
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'minitwitter',
      password: process.env.DB_PASSWORD || 'supersecret123',
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
    await this.executeSQL(NOTIFICATION_TABLE);
  };

  public async executeSQL<T extends RowDataPacket[]>(query: string, values?: any): Promise<T | null> {
    try {
      const conn = await this._pool.getConnection();
      try {
        const [results] = await conn.query<T>(query, values);
        return results;
      } finally {
        conn.release(); // Verbindung zurückgeben
      }
    } catch (err) {
      console.error('Error executing query:', err);
      return null;
    }
  }
}