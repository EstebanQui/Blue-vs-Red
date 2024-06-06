const socket = io('localhost:3000');

const activePowerUps = {
    blue: null,
    red: null
};

let powerUpInterval = null;

function increment(team) {
    const currentScore = parseInt(document.getElementById(`score${team.charAt(0).toUpperCase() + team.slice(1)}`).innerText);
    socket.emit('incrementScore', team);
}

socket.on('scoreUpdate', (scores) => {
    document.getElementById('scoreRed').innerText = Math.max(0, scores.red);
    document.getElementById('scoreBlue').innerText = Math.max(0, scores.blue);
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

document.getElementById('teamChoice').addEventListener('change', function() {
    const newTeam = this.checked ? 'red' : 'blue';
    document.getElementById('blue').style.pointerEvents = newTeam === 'blue' ? 'auto' : 'none';
    document.getElementById('red').style.pointerEvents = newTeam === 'red' ? 'auto' : 'none';
    socket.emit('joinTeam', newTeam);
});

window.onload = () => {
    const defaultTeam = 'blue';
    document.getElementById('teamChoice').checked = (defaultTeam === 'red');
    socket.emit('joinTeam', defaultTeam);
    document.getElementById('blue').style.pointerEvents = 'auto';
    document.getElementById('red').style.pointerEvents = 'none';
    setInterval(spawnPowerUps, 5000);
};

function handleEmojiClick(emojiElement) {
    let emoji = emojiElement.innerText;
    let team = document.getElementById('teamChoice').checked ? 'red' : 'blue';
    const effect = emoji === '💣' ? 'bomb' : 'star';
    if (activePowerUps[team] !== effect) {
        activePowerUps[team] = effect;
        socket.emit('applyEffect', { team, effect });
        emojiElement.remove();
        startTimer(effect === 'bomb' ? 20 : 10, effect);
    }
}

function startTimer(duration, effect) {
    clearInterval(powerUpInterval);
    let timer = duration;
    document.getElementById('powerUpTimer').style.display = 'block';
    
    const timerText = effect === 'bomb' ? `Malus : -2 for ` : `Bonus : x2 for `;
    
    powerUpInterval = setInterval(function () {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        document.getElementById('timer').textContent = timerText + minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(powerUpInterval);
            document.getElementById('powerUpTimer').style.display = 'none';
        }
    }, 1000);
}

socket.on('adjustedScoreUpdate', (scores) => {
    document.getElementById('scoreRed').innerText = scores.red;
    document.getElementById('scoreBlue').innerText = scores.blue;
});

function spawnPowerUps() {
    const powerUpTypes = ['💣', '⭐'];
    const powerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    const powerUpElement = document.createElement('div');
    powerUpElement.innerText = powerUp;
    powerUpElement.className = 'power-up';
    powerUpElement.style.left = `${Math.random() * 100}%`;
    powerUpElement.style.top = '0%';

    powerUpElement.addEventListener('click', function() {
        handleEmojiClick(this);
    });

    document.body.appendChild(powerUpElement);

    const fallInterval = setInterval(() => {
        const currentTop = parseFloat(powerUpElement.style.top);
        if (currentTop < 100) {
            powerUpElement.style.top = `${currentTop + 2}%`;
        } else {
            clearInterval(fallInterval);
            document.body.removeChild(powerUpElement);
        }
    }, 100);
}
