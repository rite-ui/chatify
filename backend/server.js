import express from 'express';
import {createServer} from 'http';

import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';



dotenv.config();
const app = express();
const httpServer = createServer(app);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(()=> {
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
})