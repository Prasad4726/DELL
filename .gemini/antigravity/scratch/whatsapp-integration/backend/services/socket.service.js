let io;

export const initSocket = (socketIO) => {
    io = socketIO;

    io.on('connection', (socket) => {
        console.log(`✅ Agent connected: ${socket.id}`);

        socket.on('join-conversation', (conversationId) => {
            socket.join(`conversation:${conversationId}`);
            console.log(`Agent ${socket.id} joined conversation ${conversationId}`);
        });

        socket.on('leave-conversation', (conversationId) => {
            socket.leave(`conversation:${conversationId}`);
            console.log(`Agent ${socket.id} left conversation ${conversationId}`);
        });

        socket.on('disconnect', () => {
            console.log(`❌ Agent disconnected: ${socket.id}`);
        });
    });
};

/**
 * Emit new message to connected clients
 */
export const emitNewMessage = (conversationId, message) => {
    if (!io) return;

    io.to(`conversation:${conversationId}`).emit('new-message', message);
    io.emit('conversation-updated', { conversationId });
};

/**
 * Emit conversation update
 */
export const emitConversationUpdate = (conversation) => {
    if (!io) return;

    io.emit('conversation-updated', conversation);
};

/**
 * Emit message status update
 */
export const emitMessageStatus = (conversationId, messageId, status) => {
    if (!io) return;

    io.to(`conversation:${conversationId}`).emit('message-status', {
        messageId,
        status,
    });
};

export default {
    initSocket,
    emitNewMessage,
    emitConversationUpdate,
    emitMessageStatus,
};
