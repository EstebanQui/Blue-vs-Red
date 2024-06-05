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
const teamMembers = { red: 0, blue: 0 };

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinTeam', (newTeam) => {
        const oldTeam = socket.team;
        if (oldTeam) {
            teamMembers[oldTeam] = Math.max(0, teamMembers[oldTeam] - 1);
            io.emit('teamMembersUpdate', teamMembers);
        }
    
        teamMembers[newTeam]++;
        socket.join(newTeam);
        socket.team = newTeam;
        io.emit('teamMembersUpdate', teamMembers);
    });

    socket.on('incrementScore', (team) => {
        scores[team]++;
        io.to(team).emit('scoreUpdate', scores);
    });

    socket.on('disconnect', () => {
        if (socket.team) {
            teamMembers[socket.team]--;
            io.emit('teamMembersUpdate', teamMembers);
        }
    });

    socket.on('setSurname', (data) => {
        io.to(socket.team).emit('updateSurname', { team: socket.team, surname: data.surname });
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://${ip.address()}:${PORT}`);
});