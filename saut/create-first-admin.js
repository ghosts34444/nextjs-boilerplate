import { getDB } from './backend/core/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const USERNAME = 'ghosts34444';
const PASSWORD = 'GhostAdmin2026!'; // ⚠️ Смени пароль после первого входа!

async function createAdmin() {
    const db = getDB();

    // 1. Проверка существующего аккаунта
    const exists = db.prepare('SELECT id FROM admins WHERE username = ?').get(USERNAME);
    if (exists) {
        console.log(`⚠️ Админ "${USERNAME}" уже существует. Пропускаем.`);
        return;
    }

    // 2. Убедимся, что роль Owner есть
    let roleId = db.prepare('SELECT id FROM roles WHERE name = ?').get('owner')?.id;
    if (!roleId) {
        roleId = 'role_owner';
        db.prepare(`
            INSERT INTO roles (id, name, display_name, color, permissions, is_system)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(roleId, 'owner', 'Владелец', '#ff4d4d', JSON.stringify({ all: true }), 1);
        console.log('✅ Роль Owner создана');
    }

    // 3. Хешируем пароль и создаём админа
    const adminId = 'admin_' + uuidv4();
    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    db.prepare(`
        INSERT INTO admins (id, username, password_hash, role_id, is_active, created_at)
        VALUES (?, ?, ?, ?, 1, datetime('now'))
    `).run(adminId, USERNAME, passwordHash, roleId);

    console.log('\n✅ Админ успешно создан!');
    console.log('👤 Логин:  ' + USERNAME);
    console.log('🔑 Пароль: ' + PASSWORD);
    console.log('🏷️  Роль:   Owner (полный доступ ко всему)');
    console.log('💡 Рекомендация: сразу после входа смени пароль в профиле.\n');
}

createAdmin().catch(err => {
    console.error('❌ Ошибка:', err.message);
    process.exit(1);
});