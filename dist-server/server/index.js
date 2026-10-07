"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'FoodBridge AI API',
        timestamp: new Date().toISOString(),
        env: {
            geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
            supabaseConfigured: Boolean(process.env.SUPABASE_URL),
        }
    });
});
// Mount main REST API
app.use('/api', api_1.default);
const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(Number(PORT), HOST, () => {
    console.log(`🚀 FoodBridge AI Backend Server running on http://${HOST}:${PORT}`);
});
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`⚠️ Port ${PORT} is already in use by another process.`);
    }
    else {
        console.error('Server error:', err);
    }
});
