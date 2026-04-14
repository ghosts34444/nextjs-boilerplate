// backend/api/auth.js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../core/database.js';

const router = Router();

// 🔐 Вход
router.post('/login', async (req, res) => {
    try {
        const { username, password, rememberMe } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Логин и пароль обязательны' });
        }

        const db = getDB();
        
        const admin = db.prepare(`SELECT * FROM admins WHERE username = ?`).get(username);

        if (!admin) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        const validPassword = await bcrypt.compare(password, admin.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        if (!admin.is_active) {
            return res.status(403).json({ error: 'Аккаунт заблокирован' });
        }

        // Простая сессия (пока без сложной логики)
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000).toISOString();

        db.prepare(`
            INSERT INTO sessions (id, admin_id, token, expires_at)
            VALUES (?, ?, ?, ?)
        `).run('sess_' + Date.now(), admin.id, token, expiresAt);

        res.cookie('admin_session', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.json({ 
            success: true, 
            message: 'Вход выполнен успешно',
            user: {
                id: admin.id,
                username: admin.username
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 🚪 Выход
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('admin_session');
        res.json({ success: true, message: 'Выход выполнен' });
    } catch (error) {
        console.error('❌ Logout error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 👤 Проверка сессии
router.get('/check', (req, res) => {
    try {
        const token = req.cookies?.admin_session;
        
        if (!token) {
            return res.status(401).json({ authenticated: false, error: 'Нет сессии' });
        }

        const db = getDB();
        const session = db.prepare(`
            SELECT a.* FROM sessions s
            JOIN admins a ON s.admin_id = a.id
            WHERE s.token = ? AND s.expires_at > datetime('now')
        `).get(token);

        if (!session) {
            res.clearCookie('admin_session');
            return res.status(401).json({ authenticated: false, error: 'Сессия истекла' });
        }

        res.json({ 
            authenticated: true, 
            user: {
                id: session.id,
                username: session.username
            }
        });

    } catch (error) {
        console.error('❌ Check session error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
