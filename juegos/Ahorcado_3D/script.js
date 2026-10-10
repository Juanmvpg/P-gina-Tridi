
        const wordsPool = [
            "DINOSAURIO", "DRAGON", "PIZZA", "ROBOT", "VOLCAN", "COHETE", "FUTBOL", 
            "MURCIELAGO", "PLANETA", "CASTILLO", "ASTRONAUTA", "GUITARRA", "ELEFANTE", 
            "HELADO", "TORNADO", "PIRATA", "TESORO", "UNICORNIO", "GIRASOL", "PINGUINO",
            "COMPUTADORA", "PROGRAMACION", "DESARROLLO", "ALGORITMO", "TECLADO",
            "MONITOR", "SISTEMA", "SOFTWARE", "INTERNET", "NAVEGADOR", "INTELIGENCIA",
            "ARTIFICIAL", "TECNOLOGIA", "VIDEOJUEGO", "APLICACION", "SERVIDOR", "DATOS"
        ];

        function startCustomGame() {
            const input = document.getElementById('custom-input');
            const word = input.value.trim().toUpperCase();
            if (word && /^[A-ZÑÁÉÍÓÚÜ\s]+$/.test(word)) {
                initGame(word);
                input.value = '';
            } else {
                alert("Por favor, ingresa una palabra válida (solo letras y espacios).");
            }
        }

        const teamsConfig = [
            { id: 1, name: "🔴 Grupo 1", color: "var(--team-1)" },
            { id: 2, name: "🔵 Grupo 2", color: "var(--team-2)" },
            { id: 3, name: "🟢 Grupo 3", color: "var(--team-3)" }
        ];

        let teams = [];
        let currentWord = "";
        let guessedLetters = [];
        let errors = 0;
        const MAX_ERRORS = 7;
        let currentTeamIndex = 0;
        let isGameOver = false;
        let currentStage = 0;

        let cumulativeShiftX = 0;
        let cumulativeRot = 0;
        let driftDirectionX = 1;
        let driftDirectionRot = 1;

        function removeAccents(str) {
            return str
                .replace(/[ÁÄ]/g, 'A')
                .replace(/[ÉË]/g, 'E')
                .replace(/[ÍÏ]/g, 'I')
                .replace(/[ÓÖ]/g, 'O')
                .replace(/[ÚÜ]/g, 'U');
        }

        function initGame(customWord = null) {
            if (teams.length === 0) {
                teams = teamsConfig.map(t => ({ ...t, score: 0 }));
            }
            
            if (typeof customWord === 'string' && customWord.trim().length > 0) {
                currentWord = customWord;
            } else {
                let shuffled = [...wordsPool].sort(() => 0.5 - Math.random());
                currentWord = shuffled[0];
            }
            guessedLetters = [];
            errors = 0;
            isGameOver = false;
            currentStage = 0;

            cumulativeShiftX = 0;
            cumulativeRot = 0;
            driftDirectionX = Math.random() > 0.5 ? 1 : -1;
            driftDirectionRot = Math.random() > 0.5 ? 1 : -1;
            
            document.getElementById('filament-blobs').innerHTML = '';
            document.getElementById('printed-piece').innerHTML = '';
            document.getElementById('status-msg').innerHTML = '';
            document.getElementById('letter-input').disabled = false;
            document.getElementById('btn-probar').disabled = false;
            document.getElementById('extruder').classList.remove('is-printing');
            
            document.getElementById('printer-frame').classList.remove('machine-on');
            document.getElementById('extruder-nozzle').classList.remove('heat-on');
            document.getElementById('printed-piece').classList.remove('piece-finished');

            document.getElementById('printer-x-axis').style.top = '40px';

            document.getElementById('letter-input').value = '';
            document.getElementById('letter-input').focus();

            renderScoreboard();
            renderWord();
            renderGuessedLetters();
        }

        function renderScoreboard() {
            const scoreboard = document.getElementById('scoreboard');
            scoreboard.innerHTML = '';
            teams.forEach((team, index) => {
                const teamEl = document.createElement('div');
                teamEl.className = 'team-score' + (index === currentTeamIndex ? ' active' : '');
                teamEl.style.borderColor = team.color;
                if (index === currentTeamIndex) {
                    teamEl.style.backgroundColor = 'var(--surface)';
                    teamEl.style.color = 'var(--text)';
                }
                
                teamEl.innerHTML = \`
                    <div class="team-name" style="color: \${team.color}">\${team.name}</div>
                    <div class="team-pts">\${team.score} pts</div>
                \`;
                scoreboard.appendChild(teamEl);
            });
        }

        function renderWord() {
            const display = document.getElementById('word-display');
            let html = '';
            let isWin = true;

            for (let char of currentWord) {
                if (char === ' ') {
                    html += '&nbsp;&nbsp; ';
                    continue;
                }
                let unaccented = removeAccents(char);
                if (guessedLetters.includes(unaccented)) {
                    html += char + ' ';
                } else {
                    html += '_ ';
                    isWin = false;
                }
            }

            if (isGameOver && !isWin) {
                html = currentWord.split('').map(char => {
                    if (char === ' ') return '&nbsp;&nbsp;';
                    let unaccented = removeAccents(char);
                    return guessedLetters.includes(unaccented) ? char : \`<span style="color: var(--error)">\${char}</span>\`;
                }).join(' ');
            }

            display.innerHTML = html.trim();

            if (isWin && !isGameOver) {
                endGame(true);
            }
        }

        function renderGuessedLetters() {
            const container = document.getElementById('guessed-letters');
            container.innerHTML = '';
            guessedLetters.forEach(letter => {
                const isCorrect = removeAccents(currentWord).includes(letter);
                const el = document.createElement('span');
                el.className = isCorrect ? 'correct-letter' : 'wrong-letter';
                el.innerText = letter;
                container.appendChild(el);
            });
        }

        function guess() {
            if (isGameOver) return;

            const input = document.getElementById('letter-input');
            const rawLetter = input.value.toUpperCase();
            
            if (!rawLetter || !/^[A-ZÑÁÉÍÓÚÜ]$/.test(rawLetter)) {
                input.value = '';
                input.focus();
                return;
            }

            const letter = removeAccents(rawLetter);
            input.value = '';
            input.focus();

            if (guessedLetters.includes(letter)) {
                return;
            }

            guessedLetters.push(letter);

            if (removeAccents(currentWord).includes(letter)) {
                teams[currentTeamIndex].score += 10;
                
                let uniqueLetters = new Set(removeAccents(currentWord).split('').filter(c => c !== ' '));
                let correctGuessesCount = guessedLetters.filter(l => uniqueLetters.has(l)).length;
                let targetStage = Math.ceil((correctGuessesCount / uniqueLetters.size) * 8);
                if (correctGuessesCount < uniqueLetters.size && targetStage === 8) {
                    targetStage = 7;
                }
                if (correctGuessesCount === uniqueLetters.size) targetStage = 8;
                
                while (currentStage < targetStage) {
                    currentStage++;
                    applyStage(currentStage);
                }
            } else {
                errors++;
                addFilamentBlob();
            }

            if (errors >= MAX_ERRORS && !isGameOver) {
                endGame(false);
            }

            renderWord();

            if (!isGameOver) {
                currentTeamIndex = (currentTeamIndex + 1) % teams.length;
            }
            
            renderScoreboard();
            renderGuessedLetters();
        }

        function applyStage(stage) {
            if (stage === 1) {
                document.getElementById('printer-frame').classList.add('machine-on');
                document.getElementById('extruder').classList.add('is-printing');
            } else if (stage === 2) {
                document.getElementById('extruder-nozzle').classList.add('heat-on');
            } else if (stage >= 3 && stage <= 8) {
                const piece = document.getElementById('printed-piece');
                const layer = document.createElement('div');
                layer.className = 'printed-layer';
                
                if (stage === 3) layer.classList.add('layer-legs');
                else if (stage === 4) layer.classList.add('layer-torso-1');
                else if (stage === 5) layer.classList.add('layer-arms-1');
                else if (stage === 6) layer.classList.add('layer-arms-2');
                else if (stage === 7) layer.classList.add('layer-head-1');
                else if (stage === 8) layer.classList.add('layer-head-2');
                
                if (errors > 0) {
                    const shiftX = (Math.random() * errors * 1.5 + errors * 0.5);
                    const rot = (Math.random() * errors * 1.5 + errors * 0.5);
                    cumulativeShiftX += driftDirectionX * shiftX;
                    cumulativeRot += driftDirectionRot * rot;
                }
                
                layer.style.setProperty('--tx', `${cumulativeShiftX}px`);
                layer.style.setProperty('--tr', `${cumulativeRot}deg`);

                piece.appendChild(layer);

                const xAxis = document.getElementById('printer-x-axis');
                let currentTop = parseInt(xAxis.style.top || 40);
                if (currentTop > 5) {
                    xAxis.style.top = (currentTop - 16) + 'px';
                }
            }
            
            if (stage === 8) {
                document.getElementById('extruder').classList.remove('is-printing');
                document.getElementById('extruder-nozzle').classList.remove('heat-on');
                document.getElementById('printed-piece').classList.add('piece-finished');
            }
        }

        function addFilamentBlob() {
            const container = document.getElementById('filament-blobs');
            const blob = document.createElement('div');
            blob.className = 'blob';
            blob.style.setProperty('--b-scale', 1 + (errors * 0.15));
            const shiftX = (Math.random() * 10) - 5;
            blob.style.marginLeft = `${shiftX}px`;
            
            container.appendChild(blob);
        }

        function endGame(isWin) {
            isGameOver = true;
            document.getElementById('letter-input').disabled = true;
            document.getElementById('btn-probar').disabled = true;
            document.getElementById('extruder').classList.remove('is-printing');
            
            const statusMsg = document.getElementById('status-msg');
            if (isWin) {
                statusMsg.innerHTML = '<span class="win">¡IMPRESIÓN EXITOSA! 🎉</span>';
                teams[currentTeamIndex].score += 20;
                renderScoreboard();
            } else {
                statusMsg.innerHTML = '<span class="lose">¡IMPRESIÓN FALLIDA! 💥</span>';
                const container = document.getElementById('filament-blobs');
                const giantBlob = document.createElement('div');
                giantBlob.className = 'blob';
                giantBlob.style.width = '60px';
                giantBlob.style.height = '60px';
                giantBlob.style.backgroundColor = 'var(--text)';
                giantBlob.style.marginTop = '-20px';
                giantBlob.style.setProperty('--b-scale', 1);
                container.appendChild(giantBlob);
            }
        }

        document.getElementById('letter-input').addEventListener('keyup', function(event) {
            this.value = this.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]/g, '').toUpperCase();
            if (event.key === 'Enter') {
                guess();
            }
        });

        document.getElementById('letter-input').addEventListener('input', function(event) {
            this.value = this.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]/g, '').toUpperCase();
        });

        window.onload = initGame;
    