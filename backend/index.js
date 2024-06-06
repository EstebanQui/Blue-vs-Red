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
const activeEffects = { red: { bomb: false, star: false }, blue: { bomb: false, star: false } };

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

io.on('connection', (socket) => {
    console.log('--------------------------------');
    console.log('A user connected');

    socket.emit('scoreUpdate', scores);

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
        console.log('--------------------------------');
        console.log(`Increment score for team: ${team}`);
        let increment = 1;
        if (activeEffects[team].bomb && scores[team] > 0) {
            increment = -2;
        } else if (activeEffects[team].star) {
            increment *= 2;
        }
        scores[team] = Math.max(0, scores[team] + increment);
        console.log(`Updated scores: ${JSON.stringify(scores)}`);
        io.emit('scoreUpdate', scores);
    });

    socket.on('applyEffect', ({ team, effect }) => {
        console.log('--------------------------------');
        console.log(`Effect applied: ${effect} on team ${team}`);
        activeEffects[team][effect] = true;
        const duration = effect === 'bomb' ? 20000 : 10000;
    
        setTimeout(() => {
            activeEffects[team][effect] = false;
            console.log('--------------------------------');
            console.log(`Effect removed: ${effect} on team ${team}`);
            io.emit('scoreUpdate', scores);
        }, duration);
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
    console.log('--------------------------------');
    console.log(`Server running at http://${ip.address()}:${PORT}`);
});