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
    const star = document.getElementById('starPowerUp');
    star.style.display = 'block';
    setTimeout(() => {
        star.style.display = 'none';
    }, 3000);
}

function activateBombPowerUp() {
    const bomb = document.getElementById('bombPowerUp');
    bomb.style.display = 'block';
    setTimeout(() => {
        bomb.style.display = 'none';
    }, 3000);
}

function activateJackpotPowerUp() {
    const jackpot = document.getElementById('jackpotPowerUp');
    jackpot.style.display = 'block';
    setTimeout(() => {
        jackpot.style.display = 'none';
    }, 3000);
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