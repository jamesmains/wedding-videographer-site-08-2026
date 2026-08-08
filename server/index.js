import express from 'express';
import cors from 'cors';
import session  from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {initDatabase, getDbConnection} from './db.js';
import { upload } from './upload.js';
import { requireAuth } from './middleware/auth.js';

// Prod Notes
// Change cors origin
// Set sessesion cookie secure to true

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: false, // Set true if HTTPS
    }
}));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// --- AUTHENTICATION ROUTES ---
// POST /api/admin/login
app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Default password for testing

    if(password === ADMIN_PASSWORD){
        req.session.isAdmin = true;
        return res.json({ success: true, message: 'Logged in successfully' });
    }

    res.status(401).json({ success: false, error: 'Invalid password' });
});

// GET /api/admin/check
app.get('/api/admin/check', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.json({ authenticated: true });
    }
    res.json({ authenticated: false });
});

// POST /api/admin/logout
app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Could not log out' });
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

// --- END AUTHENTICATION ROUTES ---

// --- PUBLIC DATA ROUTES

// /api/videos - GET all videos
app.get('/api/videos', async (req, res) => {
    try {
        const db = await getDbConnection();
        const { category } = req.query;

        let query = 'SELECT * FROM videos ORDER BY created_at DESC';
        let params = [];

        if (category) {
            query = 'SELECT * FROM videos WHERE category = ? ORDER BY created_at DESC';
            params.push(category); // if doesn't work use params = [category] instead of push
        }

        const videos = await db.all(query, params);
        res.json(videos);

    }
    catch (error){
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Database Read Error' });
    }
});

// /api/inquiries - POST a new contact inquiry
app.post('/api/inquiries', async (req, res) => {
    try {
        const { name, email, event_date, venue, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required.' });
        }

        const db = await getDbConnection();
        const result = await db.run(
            `INSERT INTO inquiries (name, email, event_date, venue, message) VALUES (?, ?, ?, ?, ?)`,
            [name, email, event_date || null, venue || null, message]
        );
        res.status(201).json({ success: true, inquiryId: result.lastID });
    }
     catch (error) {
        console.error('Error submitting inquiry:', error);
        res.status(500).json({ error: 'Database Write Error' });
     }
});


// --- PROTECTED DATA ROUTES ---

// /api/videos - POST a new video
app.post('/api/videos', requireAuth, upload.single('thumbnail'), async (req, res) => {
    try {
        const { title, client_names, video_url, description, category } = req.body || {};

        if (!title || !client_names || !video_url) {
            return res.status(400).json({ error: 'Title, client names, and video URL are required.' });
        }

        let thumbnail_url = null;
        if(req.file) {
            thumbnail_url = `/uploads/${req.file.filename}`;
        }

        const db = await getDbConnection();
        const result = await db.run(
            `INSERT INTO videos (title, client_names, video_url, description, category, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?)`,
            [title, client_names, video_url, description || null, category || 'gallery', thumbnail_url]
        );

        res.status(201).json({
             success: true,
             video:{
                id: result.lastID,
                title,
                client_names,
                video_url,
                description: description || null,
                category: category || 'gallery',
                thumbnail_url: thumbnail_url
             }
        });
    }
    catch (error) {
        console.error('Error adding video:', error);
        res.status(500).json({ error: 'Database Write Error' });
    }
});

// DELETE /api/videos/:id (Delete a video)
app.delete('/api/videos/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDbConnection();
    await db.run('DELETE FROM videos WHERE id = ?', [id]);
    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// GET /api/inquiries (View inquiries - Protected)
app.get('/api/inquiries', requireAuth, async (req, res) => {
  try {
    const db = await getDbConnection();
    const inquiries = await db.all('SELECT * FROM inquiries ORDER BY created_at DESC');
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// DELETE /api/inquiries/:id (Delete an inquiry - Protected)
app.delete('/api/inquiries/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDbConnection();
    await db.run('DELETE FROM inquiries WHERE id = ?', [id]);
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

initDatabase().then(() => {
    app.listen(PORT,() => {
        console.log(`🚀 Express server running on http://localhost:${PORT}`);
    });
});
