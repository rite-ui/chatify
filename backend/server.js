import express from 'express';
import {createServer} from 'http';

import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authroutes from './routes/auth.routes.js';
import {errorHandler,notFound} from './middleware/errorHandler.js';




dotenv.config();

const app = express();
const httpServer = createServer(app);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb'}));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth/', authroutes);

app.get('/api/health', (req, res) => {
    res.json({ status: ok, timeStamp: new Date().toISOString() });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(()=> {
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
})