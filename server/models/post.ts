import { Database } from "../database"; // Angenommene Verbindung zur DB

export class Post {

    private database: Database; // Private Instanzvariable für die Datenbank

    constructor(database: Database) {
        this.database = database;
    }

    // Öffentliche Instanzmethode zum Erstellen eines Beitrags
    public async createPost(userId: number, content: string): Promise<void> {
        const query = "INSERT INTO Post (userID, content, date) VALUES (?, ?, NOW())";
        await this.database.executeSQL(query, [userId, content]);
    }

    // Öffentliche Instanzmethode zum Abrufen von Beiträgen
    public async getPosts(): Promise<void> {
        const query = `
    SELECT p.content, p.date, u.name AS username
    FROM Post p
    JOIN User u ON p.userID = u.userID
    ORDER BY p.date DESC
  `;
        try {
            const results = await this.database.executeSQL(query);
            console.log("Fetching Posts:", results)
            if (!results) {
                throw new Error("No results returned from database.");
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw new Error("Could not fetch posts.");
        }
    }
}