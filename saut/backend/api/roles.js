// backend/api/roles.js
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../core/database.js';

const router = Router();

// GET: Список ролей
router.get('/', (req, res) => {
    try {
        const db = getDB();
        const roles = db.prepare('SELECT * FROM roles').all();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// POST: Создать роль
router.post('/', (req, res) => {
    try {
        const { name, display_name, color, permissions } = req.body;
        if (!name) return res.status(400).json({ error: 'Системное имя обязательно' });

        const db = getDB();
        const id = 'role_' + uuidv4();
        db.prepare(`
            INSERT INTO roles (id, name, display_name, color, permissions)
            VALUES (?, ?, ?, ?, ?)
        `).run(id, name, display_name, color, JSON.stringify(permissions || {}));
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// PATCH: Обновить роль
router.patch('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { display_name, color, permissions } = req.body;
        const db = getDB();

        const role = db.prepare('SELECT is_system FROM roles WHERE id = ?').get(id);
        if (role?.is_system && (display_name !== undefined || color !== undefined)) {
             // Можно менять название системной роли, но лучше ограничить если нужно
        }

        let query = 'UPDATE roles SET ';
        const params = [];
        if (display_name !== undefined) { query += 'display_name = ?, '; params.push(display_name); }
        if (color !== undefined) { query += 'color = ?, '; params.push(color); }
        if (permissions !== undefined) { query += 'permissions = ?, '; params.push(JSON.stringify(permissions)); }

        if (params.length === 0) return res.json({ success: true });

        query = query.slice(0, -2) + ' WHERE id = ?';
        params.push(id);
        db.prepare(query).run(...params);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// DELETE: Удалить роль
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const db = getDB();
        const role = db.prepare('SELECT is_system FROM roles WHERE id = ?').get(id);
        
        if (role?.is_system) {
            return res.status(403).json({ error: 'Нельзя удалить системную роль' });
        }

        db.prepare('DELETE FROM roles WHERE id = ?').run(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

export default router;