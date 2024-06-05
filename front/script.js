const socket = io('https://blue-vs-red-mb7o.onrender.com/');

function increment(team) {
    socket.emit('incrementScore', team);
}

socket.on('scoreUpdate', (scores) => {
    document.getElementById('scoreRed').innerText = scores.red;
    document.getElementById('scoreBlue').innerText = scores.blue;
    const total = scores.red + scores.blue;
    const blueWidth = Math.max((scores.blue / total) * 100, 10);
    const redWidth = Math.max((scores.red / total) * 100, 10);
    document.getElementById('blue').style.width = `${blueWidth}%`;
    document.getElementById('red').style.width = `${redWidth}%`;

    const tagPosition = Math.min(Math.max(blueWidth, 10), 90);
    document.getElementById('tag').style.left = `${tagPosition}%`;
});

socket.on('teamMembersUpdate', (teamMembers) => {
    document.getElementById('membersRed').innerText = `Membres: ${teamMembers.red}`;
    document.getElementById('membersBlue').innerText = `Membres: ${teamMembers.blue}`;
});

socket.on('powerUp', (powerUp) => {
    switch (powerUp.type) {
        case 'star':
            activateStarPowerUp();
            break;
        case 'bomb':
            activateBombPowerUp();
            break;
        case 'jackpot':
            activateJackpotPowerUp();
            break;
    }
});

function activateStarPowerUp() {
    const originalIncrement = increment;
    increment = function(team) {
        originalIncrement(team);
        originalIncrement(team);
    };

    setTimeout(() => {
        increment = originalIncrement;
    }, 10000);
}

function activateBombPowerUp() {
    const originalIncrement = increment;
    increment = function(team) {
        scores[team] = Math.max(0, scores[team] - 5);
        socket.emit('scoreUpdate', scores);
    };

    setTimeout(() => {
        increment = originalIncrement;
    }, 10000);
}

function activateJackpotPowerUp() {
    increment = function(team) {
        scores[team] += 500;
        socket.emit('scoreUpdate', scores);
    };

    increment(currentTeam);

    increment = originalIncrement;
}

document.getElementById('teamChoice').addEventListener('change', function() {
    const newTeam = this.checked ? 'red' : 'blue';
    document.getElementById('blue').style.pointerEvents = newTeam === 'blue' ? 'auto' : 'none';
    document.getElementById('red').style.pointerEvents = newTeam === 'red' ? 'auto' : 'none';
    socket.emit('joinTeam', newTeam);
});

document.getElementById('red').style.pointerEvents = 'auto';
document.getElementById('blue').style.pointerEvents = 'none';
socket.emit('joinTeam', 'blue');