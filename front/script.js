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

document.getElementById('teamChoice').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('blue').style.pointerEvents = 'none';
        document.getElementById('red').style.pointerEvents = 'auto';
        socket.emit('joinTeam', 'red');
    } else {
        document.getElementById('red').style.pointerEvents = 'none';
        document.getElementById('blue').style.pointerEvents = 'auto';
        socket.emit('joinTeam', 'blue');
    }
});

document.getElementById('red').style.pointerEvents = 'none';
document.getElementById('blue').style.pointerEvents = 'auto';
socket.emit('joinTeam', 'blue');