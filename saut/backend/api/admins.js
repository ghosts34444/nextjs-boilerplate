// backend/api/admins.js
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../core/database.js';

const router = Router();

// GET: Список всех админов
router.get('/', (req, res) => {
    try {
        const db = getDB();
        const admins = db.prepare(`
            SELECT a.*, r.name as role_name, r.display_name as role_display, r.color as role_color
            FROM admins a
            LEFT JOIN roles r ON a.role_id = r.id
        `).all();
        
        res.json(admins);
    } catch (error) {
        console.error('❌ Error fetching admins:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// POST: Создать админа
router.post('/', async (req, res) => {
    try {
        const { username, password, loli_nick, role_id } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Логин и пароль обязательны' });
        }

        const db = getDB();
        const exists = db.prepare('SELECT id FROM admins WHERE username = ?').get(username);
        if (exists) {
            return res.status(400).json({ error: 'Логин уже занят' });
        }

        const hash = await bcrypt.hash(password, 10);
        const id = 'admin_' + uuidv4();
        
        db.prepare(`
            INSERT INTO admins (id, username, password_hash, loli_nick, role_id, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
        `).run(id, username, hash, loli_nick, role_id);

        res.json({ success: true, message: 'Админ создан' });
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// PATCH: Обновить админа (смена пароля, ника, роли, заморозка)
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, loli_nick, role_id, is_active } = req.body;
        
        const db = getDB();
        const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(id);
        if (!admin) return res.status(404).json({ error: 'Админ не найден' });

        let query = 'UPDATE admins SET ';
        const params = [];

        if (username !== undefined) {
            query += 'username = ?, ';
            params.push(username);
            // Убиваем сессии при смене логина
            db.prepare('DELETE FROM sessions WHERE admin_id = ?').run(id);
        }
        if (password) {
            query += 'password_hash = ?, ';
            params.push(await bcrypt.hash(password, 10));
            // Убиваем сессии при смене пароля
            db.prepare('DELETE FROM sessions WHERE admin_id = ?').run(id);
        }
        if (loli_nick !== undefined) {
            query += 'loli_nick = ?, ';
            params.push(loli_nick);
        }
        if (role_id !== undefined) {
            query += 'role_id = ?, ';
            params.push(role_id);
        }
        if (is_active !== undefined) {
            query += 'is_active = ?, ';
            params.push(is_active);
        }

        // Убираем запятую в конце
        query = query.slice(0, -2) + ' WHERE id = ?';
        params.push(id);

        db.prepare(query).run(...params);
        res.json({ success: true, message: 'Данные обновлены' });
    } catch (error) {
        console.error('❌ Error updating admin:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// DELETE: Удалить админа
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        
        // Не даем удалить владельца (если он один, или по ID)
        const admin = db.prepare('SELECT role_id FROM admins WHERE id = ?').get(id);
        const role = db.prepare('SELECT name FROM roles WHERE id = ?').get(admin?.role_id);
        if (role?.name === 'owner') {
            return res.status(403).json({ error: 'Нельзя удалить владельца' });
        }

        db.prepare('DELETE FROM admins WHERE id = ?').run(id);
        db.prepare('DELETE FROM sessions WHERE admin_id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        console.error('❌ Error deleting admin:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;