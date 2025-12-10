const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');


const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_competition', (competitionId) => {
        socket.join(`competition_${competitionId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Simple helper to emit leaderboard updates, will be imported in routes later
app.set('io', io);



server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
