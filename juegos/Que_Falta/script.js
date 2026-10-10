const ALL_EMOJIS = [
    '🍎','🍌','🍇','🍉','🍓','🍒','🍑','🍍','🥥','🥝',
    '🥕','🌽','🥦','🍄','🍔','🍟','🍕','🌭','🍿','🍩',
    '⚽','🏀','🏈','⚾','🎾','🏐','🎱','🏓','🏸','🥊',
    '🚗','🚕','🚙','🚌','🚓','🚑','🚒','🚜','🚲','🛵',
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
    '✏️','📚','🧸','🥤','✂️','🖍️','🎒','📏','🎨','🧩'
];

let scores = [0, 0, 0];
let currentEmojis = [];
let answerHtml = '';
let itemAmount = 4; // Empezamos fácil con 4 ítems

const emojiDisplay = document.getElementById('emoji-display');
const statusText = document.getElementById('status-text');
const startBtn = document.getElementById('start-btn');
const controlsDiv = document.getElementById('controls');
const actionButtons = document.getElementById('action-buttons');

function getRandomEmojis(count, exclude = []) {
    const available = ALL_EMOJIS.filter(e => !exclude.includes(e));
    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function adjustScore(teamIndex, amount) {
    scores[teamIndex - 1] += amount;
    // Evitar puntajes negativos
    if (scores[teamIndex - 1] < 0) scores[teamIndex - 1] = 0;
    document.getElementById(`score${teamIndex}`).textContent = scores[teamIndex - 1];
}

function renderEmojis(emojis) {
    emojiDisplay.innerHTML = '';
    emojis.forEach(emoji => {
        const span = document.createElement('span');
        span.className = 'emoji-item';
        span.textContent = emoji;
        emojiDisplay.appendChild(span);
    });
}

function startRound() {
    controlsDiv.classList.add('hidden');
    actionButtons.classList.add('hidden');
    
    currentEmojis = getRandomEmojis(itemAmount);
    answerHtml = '';
    
    renderEmojis(currentEmojis);
    statusText.textContent = '👀 ¡Memoriza los objetos!';
    
    setTimeout(() => {
        hideScene();
    }, 4500); // 4.5 segundos para memorizar
}

function hideScene() {
    emojiDisplay.innerHTML = '';
    statusText.textContent = '🙈 ¡Ojos cerrados!';
    
    setTimeout(() => {
        showChangedScene();
    }, 1500);
}

function showChangedScene() {
    // 3 modos:
    // 0: Falta uno
    // 1: Cambió uno por otro
    // 2: Cambiaron de lugar
    
    let mode = Math.floor(Math.random() * 3);
    if (itemAmount < 4 && mode === 2) mode = 0; // Evitar modo cambiar de lugar si hay muy pocos
    
    let newEmojis = [...currentEmojis];
    
    if (mode === 0) {
        // Falta uno
        const removeIndex = Math.floor(Math.random() * newEmojis.length);
        const missing = newEmojis[removeIndex];
        newEmojis.splice(removeIndex, 1);
        statusText.textContent = '❓ ¿Qué objeto falta?';
        answerHtml = `Faltaba: <span class="missing-reveal">${missing}</span>`;
    } 
    else if (mode === 1) {
        // Cambió uno
        const replaceIndex = Math.floor(Math.random() * newEmojis.length);
        const oldEmoji = newEmojis[replaceIndex];
        const newEmoji = getRandomEmojis(1, currentEmojis)[0];
        newEmojis[replaceIndex] = newEmoji;
        statusText.textContent = '❓ ¿Qué objeto cambió?';
        answerHtml = `El <span class="missing-reveal">${oldEmoji}</span> cambió por <span class="missing-reveal">${newEmoji}</span>`;
    }
    else {
        // Cambiaron de lugar
        const idx1 = Math.floor(Math.random() * newEmojis.length);
        let idx2 = Math.floor(Math.random() * newEmojis.length);
        while (idx1 === idx2) {
            idx2 = Math.floor(Math.random() * newEmojis.length);
        }
        const emoji1 = newEmojis[idx1];
        const emoji2 = newEmojis[idx2];
        newEmojis[idx1] = emoji2;
        newEmojis[idx2] = emoji1;
        statusText.textContent = '❓ ¿Qué objetos cambiaron de lugar?';
        answerHtml = `Cambiaron: <span class="missing-reveal">${emoji1}</span> y <span class="missing-reveal">${emoji2}</span>`;
    }
    
    renderEmojis(newEmojis);
    actionButtons.classList.remove('hidden');
}

function showAnswer() {
    statusText.innerHTML = `✅ ${answerHtml}`;
    endRound();
}

function endRound() {
    actionButtons.classList.add('hidden');
    controlsDiv.classList.remove('hidden');
    startBtn.textContent = '▶️ Siguiente Ronda';
    
    // Aumentar dificultad progresivamente
    if (itemAmount < 12) {
        itemAmount++;
    }
}
