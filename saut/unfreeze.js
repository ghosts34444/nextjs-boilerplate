import { getDB } from './backend/core/database.js';

const USERNAME = 'ghosts34444'; // 🔥 Замени на свой логин!

const db = getDB();
const admin = db.prepare('SELECT id, username, is_active FROM admins WHERE username = ?').get(USERNAME);

if (!admin) {
    console.log('❌ Админ не найден');
    process.exit(1);
}

if (admin.is_active) {
    console.log('✅ Аккаунт уже активен');
    process.exit(0);
}

db.prepare('UPDATE admins SET is_active = 1 WHERE id = ?').run(admin.id);
console.log(`✅ Аккаунт "${admin.username}" разморожен!`);
console.log('🔑 Теперь можно войти с паролем.');
