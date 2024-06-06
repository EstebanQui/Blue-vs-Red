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
    
    // Start bonus appearance immediately
    console.log('Bonuses should start appearing now.');
    addFixedEmojis();
};

// Function to add fixed emojis (always visible)
function addFixedEmojis() {
    const emojiContainer = document.getElementById('emojis');
    const emojis = ['💣', '⭐'];

    emojis.forEach((emoji) => {
        const emojiElement = document.createElement('span');
        emojiElement.innerHTML = emoji;
        emojiElement.classList.add('emoji');
        emojiElement.style.position = 'absolute';
        emojiElement.style.left = '50%'; // Center horizontally
        emojiElement.style.top = emoji === '💣' ? '30%' : '70%'; // Separate vertically
        emojiContainer.appendChild(emojiElement);

        // Add click event for the emoji
        emojiElement.addEventListener('click', () => {
            handleEmojiClick(emoji);
            // No need to remove the emoji after clicking
        });
    });
}

// Function to handle emoji click
function handleEmojiClick(emoji) {
    let team = document.getElementById('teamChoice').checked ? 'red' : 'blue';
    console.log(`Emoji clicked: ${emoji} for team ${team}`);
    if (emoji === '💣') {
        console.log(`Applying bomb effect to team ${team}`);
        socket.emit('applyEffect', { team, effect: 'bomb' });
    } else if (emoji === '⭐') {
        console.log(`Applying star effect to team ${team}`);
        socket.emit('applyEffect', { team, effect: 'star' });
    }
}

socket.on('adjustedScoreUpdate', (scores) => {
    console.log('Adjusted scores:', scores);
    document.getElementById('scoreRed').innerText = scores.red;
    document.getElementById('scoreBlue').innerText = scores.blue;
});