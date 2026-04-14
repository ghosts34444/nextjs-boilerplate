// backend/middleware/auth.js
import { validateSession, destroySession } from '../../shared/auth/session.js';

export function requireAuth() {
    return async (req, res, next) => {
        const token = req.cookies?.admin_session || req.headers.authorization?.split(' ')[1];

        if (!token) {
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(401).json({ error: 'Требуется авторизация', code: 'NO_TOKEN' });
            }
            return res.redirect('/auth.html');
        }

        const user = await validateSession(token);

        if (!user) {
            res.clearCookie('admin_session');
            if (req.xhr || req.headers.accept?.includes('application/json')) {
                return res.status(401).json({ error: 'Сессия истекла', code: 'INVALID_SESSION' });
            }
            return res.redirect('/auth.html');
        }

        req.user = user;
        next();
    };
}

export function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Требуется авторизация' });
        }

        const permissions = req.user.permissions;
        if (permissions.all || permissions[permission]) {
            next();
        } else {
            res.status(403).json({ error: 'Недостаточно прав', code: 'NO_PERMISSION' });
        }
    };
}

export function requireRole(roleName) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Требуется авторизация' });
        }

        if (req.user.roleName === roleName || req.user.permissions.all) {
            next();
        } else {
            res.status(403).json({ error: 'Недостаточно прав', code: 'NO_ROLE' });
        }
    };
}