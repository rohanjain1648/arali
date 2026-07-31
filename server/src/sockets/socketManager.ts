import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

let io: SocketIOServer | null = null;

export const initSocketServer = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // Allow all origins for dev flexibility
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 [Socket.IO] Client connected: ${socket.id}`);

    // Allow client to register for target user notifications
    socket.on('register_user', (userId: string) => {
      if (!userId) return;
      
      const userRoom = `user:${userId}`;
      socket.join(userRoom);
      console.log(`👤 [Socket.IO] Socket ${socket.id} joined room: ${userRoom}`);
      
      socket.emit('registered', { userId, room: userRoom, status: 'connected' });
    });

    socket.on('leave_user', (userId: string) => {
      if (!userId) return;
      const userRoom = `user:${userId}`;
      socket.leave(userRoom);
      console.log(`👋 [Socket.IO] Socket ${socket.id} left room: ${userRoom}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO server has not been initialized!');
  }
  return io;
};

/**
 * Emit a real-time event targeted ONLY to a specific user's socket room
 */
export const sendTargetedNotification = (userId: string, notification: any) => {
  if (!io) return;
  const userRoom = `user:${userId}`;
  console.log(`⚡ [Real-time Dispatch] Emitting notification to room ${userRoom}: "${notification.title}"`);
  io.to(userRoom).emit('notification:new', notification);
};
