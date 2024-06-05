import express from 'express';
import http from 'http';
import ip from 'ip';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const PORT = 3000;
const io = new Server(server, { cors: { origin: '*' } });
const scores = { red: 0, blue: 0 };

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinTeam', (team) => {
        socket.join(team);
        console.log(`${socket.id} joined ${team}`);
        socket.emit('scoreUpdate', scores);
    });

    socket.on('incrementScore', (team) => {
        scores[team]++;
        io.to(team).emit('scoreUpdate', scores);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://${ip.address()}:${PORT}`);
});