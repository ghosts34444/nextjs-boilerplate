// server.js
import express from 'express';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getDB } from './backend/core/database.js';
import { initWebSocket } from './backend/core/websocket.js';
import { requireAuth } from './backend/middleware/auth.js'; // ✅ ИМПОРТ!
import dotenv from 'dotenv';
import adminRouter from './backend/api/admins.js';
import rolesRouter from './backend/api/roles.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Инициализация БД
getDB();

// Middleware
app.use(cors({
    origin: ['https://lolidarkgalaxy.ru', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// ✅ Middleware для удаления .html (ДО маршрутов!)
app.use((req, res, next) => {
    if (req.path.endsWith('.html') && req.path !== '/index.html') {
        return res.redirect(301, req.path.slice(0, -5));
    }
    next();
});

app.use('/api/admins', requireAuth(), adminRouter);
app.use('/api/roles', requireAuth(), rolesRouter);

app.use('/admin/scripts', express.static(join(__dirname, 'admin/public/scripts')));
app.use('/admin/styles', express.static(join(__dirname, 'admin/public/styles')));
app.use('/assets', express.static(join(__dirname, 'public/assets')));
app.use('/admin', express.static(join(__dirname, 'admin/public')));

// Основные папки (для совместимости)
app.use('/admin', express.static(join(__dirname, 'admin/public')));
app.use('/public', express.static(join(__dirname, 'public')));

// Статика (сначала, но осторожно с /admin)
app.use('/json', express.static(join(__dirname, 'public/json')));
app.use('/assets', express.static(join(__dirname, 'public/assets')));
app.use('/styles', express.static(join(__dirname, 'public/styles')));
app.use('/scripts', express.static(join(__dirname, 'public/scripts')));

// После всех app.use() с статикой, но перед API routes

// Автоматическое добавление .html для компонентов
app.use('/admin/components', (req, res, next) => {
    // Если путь не заканчивается на .html или расширение
    if (!req.path.match(/\.[a-z]+$/i)) {
        req.url = req.url + '.html';
    }
    next();
}, express.static(join(__dirname, 'admin/public/components')));

// WebSocket
initWebSocket(server);

// API Routes
try {
    const authRouter = (await import('./backend/api/auth.js')).default;
    app.use('/api/auth', authRouter);
} catch (error) {
    console.error('❌ Не удалось загрузить API auth:', error.message);
}

// ✅ Главная
app.get('/', (req, res) => {
    const filePath = join(__dirname, 'public/index.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('❌ Ошибка отправки index.html:', err);
            res.status(500).send('Ошибка загрузки страницы');
        }
    });
});

app.get('/auth', (req, res) => {
    res.sendFile(join(__dirname, 'admin/public/auth.html'));
});

app.get('/console', requireAuth(), (req, res) => {
    res.sendFile(join(__dirname, 'admin/public/console.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(join(__dirname, 'public/test.html'));
});

app.get('/admin/files', requireAuth(), (req, res) => {
    res.sendFile(join(__dirname, 'admin/public/admin/files.html'));
});

app.get('/admin/price-edit', requireAuth(), (req, res) => {
    res.sendFile(join(__dirname, 'admin/public/warp-info.html'));
});

app.get('/admin/admin', requireAuth(), (req, res) => {
    res.sendFile(join(__dirname, 'admin/public/admin/admin.html'));
});

app.get('/admin/management', requireAuth(), (req, res) => {
    res.sendFile(join(__dirname, 'admin/public/admin/management.html'));
});

app.get('/prices', (req, res) => {
    res.sendFile(join(__dirname, 'public/warp-info.html'));
});

app.get('/guides', (req, res) => {
    res.sendFile(join(__dirname, 'public/guides.html'));
});

app.get('/events', (req, res) => {
    res.sendFile(join(__dirname, 'public/events.html'));
});

app.get('/race', (req, res) => {
    res.sendFile(join(__dirname, 'public/race.html'));
});

app.use((req, res) => {
    res.status(404).sendFile(join(__dirname, 'public/404.html'));
});

app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    console.error(err.stack);
    res.status(err.status || 500).json({ 
        error: 'Внутренняя ошибка сервера',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Запуск сервера
server.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
    console.log(`📁 Root: ${__dirname}`);
    console.log(`🔄 WebSocket готов`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Получен SIGTERM, закрываем сервер...');
    server.close(() => {
        console.log('✅ Сервер закрыт');
        process.exit(0);
    });
});