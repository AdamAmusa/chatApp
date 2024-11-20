const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();

server.on('connection', socket => {
    console.log('Client connected');
    clients.add(socket);

    socket.on('message', message => {
        console.log('Received:', message);
        const parsedMessage = JSON.parse(message);

        // Relay the message to all other connected clients
        clients.forEach(client => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(parsedMessage));
            }
        });
    });

    socket.on('close', () => {
        console.log('Client disconnected');
        clients.delete(socket);
    });

    socket.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');