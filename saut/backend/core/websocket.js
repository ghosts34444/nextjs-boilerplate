// backend/core/websocket.js
import { Server } from 'socket.io';

let io = null;
const activeUsers = new Map(); // socketId -> user
const activeFiles = new Map(); // filePath -> Set of socketIds

export function initWebSocket(server) {
    io = new Server(server, {
        cors: {
            origin: ['https://lolidarkgalaxy.ru', 'http://localhost:3001'],
            credentials: true
        },
        pingTimeout: 60000,
        pingInterval: 25000
    });

    io.on('connection', (socket) => {
        console.log(`🔌 Подключён: ${socket.id}`);

        // Авторизация WebSocket
        socket.on('auth', (data) => {
            if (data.userId) {
                activeUsers.set(socket.id, {
                    id: data.userId,
                    username: data.username,
                    joinedAt: new Date()
                });
                io.emit('users:update', getActiveUsers());
            }
        });

        // Присоединиться к комнате (файл, страница)
        socket.on('join', (room) => {
            socket.join(room);
            console.log(`${socket.id} присоединился к ${room}`);
            
            if (room.startsWith('file:')) {
                const filePath = room.replace('file:', '');
                if (!activeFiles.has(filePath)) {
                    activeFiles.set(filePath, new Set());
                }
                activeFiles.get(filePath).add(socket.id);
                
                // Уведомляем других что кто-то редактирует
                socket.to(room).emit('file:user-joined', {
                    socketId: socket.id,
                    user: activeUsers.get(socket.id)
                });
            }
        });

        // Покинуть комнату
        socket.on('leave', (room) => {
            socket.leave(room);
            if (room.startsWith('file:')) {
                const filePath = room.replace('file:', '');
                if (activeFiles.has(filePath)) {
                    activeFiles.get(filePath).delete(socket.id);
                }
            }
        });

        // Обновление файла (real-time)
        socket.on('file:update', (data) => {
            socket.to(`file:${data.filePath}`).emit('file:updated', {
                userId: data.userId,
                username: data.username,
                content: data.content,
                timestamp: Date.now()
            });
        });

        // Обновление цены
        socket.on('price:update', (data) => {
            io.to('prices').emit('price:updated', data);
        });

        // Обновление гайда
        socket.on('guide:update', (data) => {
            io.to(`guide:${data.guideId}`).emit('guide:updated', data);
        });

        // Обновление ивента
        socket.on('event:update', (data) => {
            io.to(`event:${data.eventId}`).emit('event:updated', data);
        });

        // Отключение
        socket.on('disconnect', () => {
            console.log(`🔌 Отключён: ${socket.id}`);
            activeUsers.delete(socket.id);
            
            // Удаляем из всех комнат
            for (const [filePath, sockets] of activeFiles.entries()) {
                sockets.delete(socket.id);
                if (sockets.size === 0) {
                    activeFiles.delete(filePath);
                }
            }
            
            io.emit('users:update', getActiveUsers());
        });
    });

    return io;
}

export function getActiveUsers() {
    return Array.from(activeUsers.values());
}

export function getActiveFileEditors(filePath) {
    const room = `file:${filePath}`;
    if (!io) return [];
    
    const sockets = io.sockets.adapter.rooms.get(room);
    if (!sockets) return [];
    
    return Array.from(sockets).map(id => activeUsers.get(id)).filter(Boolean);
}

export function getIO() {
    return io;
}