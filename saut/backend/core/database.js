// backend/core/database.js
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '../../data/database.db');

let db = null;

export function getDB() {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        initDatabase(db);
    }
    return db;
}

function initDatabase(db) {
    // 👥 Админы
    db.exec(`
        CREATE TABLE IF NOT EXISTS admins (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role_id TEXT,
            discord_id TEXT,
            loli_nick TEXT,
            avatar_url TEXT,
            is_active INTEGER DEFAULT 1,
            last_login TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 🏷️ Роли
    db.exec(`
        CREATE TABLE IF NOT EXISTS roles (
            id TEXT PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            display_name TEXT,
            color TEXT DEFAULT '#8a6dff',
            permissions TEXT DEFAULT '{}',
            is_system INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 🍪 Сессии (улучшенные куки)
    db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            admin_id TEXT NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at TEXT NOT NULL,
            last_activity TEXT DEFAULT CURRENT_TIMESTAMP,
            remember_me INTEGER DEFAULT 0,
            ip_address TEXT,
            user_agent TEXT,
            FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
        )
    `);

    // 📜 История файлов
    db.exec(`
        CREATE TABLE IF NOT EXISTS file_history (
            id TEXT PRIMARY KEY,
            admin_id TEXT NOT NULL,
            file_path TEXT NOT NULL,
            action TEXT NOT NULL,
            old_content TEXT,
            new_content TEXT,
            backup_path TEXT,
            file_type TEXT,
            file_size INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_id) REFERENCES admins(id)
        )
    `);

    // ⚙️ Настройки админов
    db.exec(`
        CREATE TABLE IF NOT EXISTS admin_settings (
            admin_id TEXT PRIMARY KEY,
            file_tree_state TEXT DEFAULT '{}',
            editor_layout TEXT DEFAULT '{}',
            window_positions TEXT DEFAULT '{}',
            theme TEXT DEFAULT 'dark',
            font_size INTEGER DEFAULT 14,
            auto_save INTEGER DEFAULT 1,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_id) REFERENCES admins(id)
        )
    `);

    // 💰 Цены варпов
    db.exec(`
        CREATE TABLE IF NOT EXISTS warp_prices (
            id TEXT PRIMARY KEY,
            mod_id TEXT NOT NULL,
            mod_name TEXT NOT NULL,
            item_name TEXT NOT NULL,
            price TEXT NOT NULL,
            status TEXT DEFAULT 'draft',
            created_by TEXT NOT NULL,
            reviewed_by TEXT,
            published_at TEXT,
            version INTEGER DEFAULT 1,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 📜 История цен
    db.exec(`
        CREATE TABLE IF NOT EXISTS warp_prices_history (
            id TEXT PRIMARY KEY,
            price_id TEXT NOT NULL,
            admin_id TEXT NOT NULL,
            action TEXT NOT NULL,
            old_price TEXT,
            new_price TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (price_id) REFERENCES warp_prices(id),
            FOREIGN KEY (admin_id) REFERENCES admins(id)
        )
    `);

    // 📚 Гайды
    db.exec(`
        CREATE TABLE IF NOT EXISTS guides (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            content TEXT,
            assets TEXT,
            mod_tag TEXT,
            status TEXT DEFAULT 'draft',
            views INTEGER DEFAULT 0,
            created_by TEXT NOT NULL,
            reviewed_by TEXT,
            published_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 📜 История гайдов
    db.exec(`
        CREATE TABLE IF NOT EXISTS guides_history (
            id TEXT PRIMARY KEY,
            guide_id TEXT NOT NULL,
            admin_id TEXT NOT NULL,
            action TEXT NOT NULL,
            content_snapshot TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (guide_id) REFERENCES guides(id),
            FOREIGN KEY (admin_id) REFERENCES admins(id)
        )
    `);

    // 🎉 Ивенты
    db.exec(`
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            description TEXT,
            type TEXT DEFAULT 'rounds',
            start_date TEXT,
            end_date TEXT,
            registration_open INTEGER DEFAULT 1,
            bracket_json TEXT,
            status TEXT DEFAULT 'draft',
            created_by TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 👥 Участники ивентов
    db.exec(`
        CREATE TABLE IF NOT EXISTS event_participants (
            id TEXT PRIMARY KEY,
            event_id TEXT NOT NULL,
            player_name TEXT NOT NULL,
            discord_id TEXT,
            loli_id TEXT,
            avatar_url TEXT,
            status TEXT DEFAULT 'registered',
            disqualified_reason TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events(id)
        )
    `);

    // 🏆 Раунды ивентов
    db.exec(`
        CREATE TABLE IF NOT EXISTS event_rounds (
            id TEXT PRIMARY KEY,
            event_id TEXT NOT NULL,
            round_number INTEGER NOT NULL,
            player1_id TEXT,
            player2_id TEXT,
            winner_id TEXT,
            status TEXT DEFAULT 'pending',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events(id),
            FOREIGN KEY (player1_id) REFERENCES event_participants(id),
            FOREIGN KEY (player2_id) REFERENCES event_participants(id),
            FOREIGN KEY (winner_id) REFERENCES event_participants(id)
        )
    `);

    // 🔔 Уведомления
    db.exec(`
        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            admin_id TEXT,
            type TEXT NOT NULL,
            message TEXT NOT NULL,
            is_read INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 🏠 Главная страница
    db.exec(`
        CREATE TABLE IF NOT EXISTS main_page (
            id TEXT PRIMARY KEY,
            wipe_version TEXT NOT NULL,
            hero_image TEXT,
            hero_text TEXT,
            guide_cards TEXT,
            updated_by TEXT,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Создаём дефолтную роль Owner
    const ownerExists = db.prepare('SELECT id FROM roles WHERE name = ?').get('owner');
    if (!ownerExists) {
        db.prepare(`
            INSERT INTO roles (id, name, display_name, color, permissions, is_system)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            'role_' + Date.now(),
            'owner',
            'Владелец',
            '#ff0000',
            JSON.stringify({ all: true }),
            1
        );
    }

    console.log('✅ База данных инициализирована');
}

export function closeDB() {
    if (db) {
        db.close();
        db = null;
    }
}