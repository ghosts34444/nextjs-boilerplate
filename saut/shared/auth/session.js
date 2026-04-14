// shared/auth/session.js
import crypto from 'crypto';
import { getDB } from '../database/database.js';

export function generateToken() {
    return crypto.randomBytes(64).toString('hex');
}

export async function createSession(adminId, rememberMe = false, ip = '', userAgent = '') {
    const db = getDB();
    const token = generateToken();
    const expiresAt = rememberMe 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()  // 30 дней
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();  // 7 дней

    db.prepare(`
        INSERT INTO sessions (id, admin_id, token, expires_at, remember_me, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        adminId,
        token,
        expiresAt,
        rememberMe ? 1 : 0,
        ip,
        userAgent
    );

    return { token, expiresAt };
}

export async function validateSession(token) {
    const db = getDB();
    
    const session = db.prepare(`
        SELECT s.*, a.username, a.role_id, a.is_active, a.loli_nick, a.avatar_url,
               r.name as role_name, r.display_name as role_display, 
               r.color as role_color, r.permissions
        FROM sessions s
        JOIN admins a ON s.admin_id = a.id
        LEFT JOIN roles r ON a.role_id = r.id
        WHERE s.token = ? AND s.expires_at > datetime('now') AND a.is_active = 1
    `).get(token);

    if (!session) {
        return null;
    }

    // Обновляем last_activity
    db.prepare(`
        UPDATE sessions SET last_activity = datetime('now') WHERE token = ?
    `).run(token);

    return {
        id: session.admin_id,
        username: session.username,
        roleId: session.role_id,
        roleName: session.role_name,
        roleDisplay: session.role_display,
        roleColor: session.role_color,
        permissions: JSON.parse(session.permissions || '{}'),
        loliNick: session.loli_nick,
        avatarUrl: session.avatar_url,
        isActive: session.is_active,
        sessionId: session.id,
        expiresAt: session.expires_at
    };
}

export async function destroySession(token) {
    const db = getDB();
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

export async function destroyAllSessions(adminId) {
    const db = getDB();
    db.prepare('DELETE FROM sessions WHERE admin_id = ?').run(adminId);
}

export function getCookieOptions(rememberMe = false) {
    return {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
        path: '/'
    };
}