import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert env variable to directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbInstance = null;

export async function getDbConnection(){
    if (dbInstance) return dbInstance;

    dbInstance = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    return dbInstance;
}

export async function initDatabase(){
    const db = await getDbConnection();

    // Enforce foreign key constraints
    await db.exec(`PRAGMA foreign_keys = ON;`);

    // Table for videos
    await db.exec(`
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            client_names TEXT NOT NULL,
            video_url TEXT NOT NULL,
            description TEXT,
            category TEXT CHECK(category IN ('featured', 'gallery')) DEFAULT 'gallery',
            thumbnail_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Table for contact information
    await db.exec(`
        CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            event_date TEXT,
            venue TEXT,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'unread',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log('Database initialized successfully.');

}