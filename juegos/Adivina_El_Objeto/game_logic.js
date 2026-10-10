/**
 * Lógica principal del minijuego "¿Qué objeto es?".
 * Gestiona el estado de los equipos, los turnos, la puntuación y la revelación progresiva de la imagen.
 * 
 * @example
 * // Caso normal: jugar un turno y adivinar
 * const items = [{ name: 'pelota' }, { name: 'lápiz' }];
 * const game = new GameLogic(items);
 * game.revealMore(); // Etapa 1
 * game.guessCorrect(); // Suma 3 puntos y destapa todo
 * 
 * @example
 * // Caso límite: adivinar mal y agotar revelaciones
 * const game = new GameLogic([{ name: 'manzana' }]);
 * game.revealMore();
 * game.guessWrong(); // Pasa a Grupo 2
 * game.revealMore();
 * game.revealMore();
 * game.revealMore(); // Se revela todo, ya no se puede adivinar
 */
class GameLogic {
    /**
     * Inicializa el juego con la lista de objetos proporcionada.
     * 
     * @param {Array<{name: string, [key: string]: any}>} items - Lista de objetos a adivinar.
     * @throws {Error} Si `items` es nulo, no definido o no es un array.
     * 
     * @example
     * // Caso normal
     * const game = new GameLogic([{ name: 'auto' }]);
     * 
     * @example
     * // Edge case: Array vacío
     * const game = new GameLogic([]); // Válido, pero getCurrentItem() devolverá null
     */
    constructor(items) {
        if (!items || !Array.isArray(items)) {
            throw new Error("El parámetro items debe ser un array válido");
        }
        this.items = items;
        this.teams = [
            { id: 1, name: 'Grupo 1', score: 0 },
            { id: 2, name: 'Grupo 2', score: 0 },
            { id: 3, name: 'Grupo 3', score: 0 }
        ];
        this.currentTeamIndex = 0;
        this.currentItemIndex = 0;
        this.revealStage = 0;
        this.coveredCells = Array.from({length: 25}, (_, i) => i);
    }

    /**
     * Devuelve el equipo que tiene el turno actualmente.
     * 
     * @returns {{id: number, name: string, score: number}} Datos del equipo actual.
     * 
     * @example
     * // Caso normal
     * const team = game.getCurrentTeam(); 
     * console.log(team.name); // "Grupo 1"
     */
    getCurrentTeam() {
        return this.teams[this.currentTeamIndex];
    }

    /**
     * Devuelve el objeto actual que los jugadores deben adivinar.
     * 
     * @returns {{name: string, [key: string]: any}|null} El objeto a adivinar o null si la lista se agotó.
     * 
     * @example
     * // Caso normal
     * const item = game.getCurrentItem();
     * console.log(item.name); // "Cepillo de dientes"
     * 
     * @example
     * // Edge case: no hay más objetos
     * // Después de avanzar todos los items...
     * const item = game.getCurrentItem(); // null
     */
    getCurrentItem() {
        if (this.currentItemIndex >= this.items.length) return null;
        return this.items[this.currentItemIndex];
    }

    /**
     * Calcula los puntos que se otorgarían si se adivina correctamente en la etapa de revelación actual.
     * 
     * @returns {number} Puntos correspondientes a la etapa: 3, 2, 1 o 0.
     * 
     * @example
     * // Caso normal
     * game.revealStage = 1;
     * const pts = game.getPointsVal(); // 3
     * 
     * @example
     * // Edge case: revelación total
     * game.revealStage = 4;
     * const pts = game.getPointsVal(); // 0
     */
    getPointsVal() {
        if (this.revealStage <= 1) return 3; // Etapas iniciales: poca información
        if (this.revealStage === 2) return 2; // Información intermedia
        if (this.revealStage === 3) return 1; // Casi revelado
        return 0;                             // Completamente revelado
    }

    /**
     * Avanza el turno al siguiente equipo en la lista circular.
     * 
     * @returns {void}
     * 
     * @example
     * // Caso normal
     * game.nextTurn(); // Pasa del Grupo 1 al Grupo 2
     * 
     * @example
     * // Edge case: último equipo
     * // Si está en Grupo 3, pasa a Grupo 1
     * game.nextTurn(); 
     */
    nextTurn() {
        this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
    }

    /**
     * Revela una cantidad de celdas según la etapa de revelación y avanza a la siguiente etapa.
     * 
     * @returns {number[]} Array con los índices de las celdas destapadas en este turno.
     * 
     * @example
     * // Caso normal
     * const destapadas = game.revealMore(); // [4, 12, 15, 2, 1, 9] (6 celdas)
     * 
     * @example
     * // Edge case: imagen ya totalmente revelada
     * game.revealStage = 4;
     * const destapadas = game.revealMore(); // []
     */
    revealMore() {
        if (this.revealStage >= 4) return [];
        
        let cellsToRevealCount = 6;
        if (this.revealStage === 2) cellsToRevealCount = 8;
        if (this.revealStage === 3) cellsToRevealCount = 5;
        
        const revealedThisTurn = [];
        for (let i = 0; i < cellsToRevealCount; i++) {
            if (this.coveredCells.length === 0) break;
            const randIndex = Math.floor(Math.random() * this.coveredCells.length);
            revealedThisTurn.push(this.coveredCells[randIndex]);
            this.coveredCells.splice(randIndex, 1);
        }
        
        this.revealStage++;
        return revealedThisTurn; 
    }

    /**
     * Registra un acierto del equipo actual: suma puntos y destapa por completo la imagen.
     * 
     * @returns {void}
     * 
     * @example
     * // Caso normal
     * game.guessCorrect();
     * console.log(game.teams[game.currentTeamIndex].score); // Suma los puntos actuales
     */
    guessCorrect() {
        const pts = this.getPointsVal();
        this.teams[this.currentTeamIndex].score += pts;
        this.revealStage = 4; // fuerza la revelación total
        this.coveredCells = [];
    }

    /**
     * Registra un fallo del equipo actual, pasando el turno al siguiente.
     * 
     * @returns {void}
     * 
     * @example
     * // Caso normal
     * game.guessWrong(); // Pierde el turno
     */
    guessWrong() {
        this.nextTurn();
    }

    /**
     * Avanza al siguiente objeto a adivinar, reiniciando la cuadrícula y la etapa.
     * 
     * @returns {void}
     * 
     * @example
     * // Caso normal
     * game.nextItem(); // Pasa al siguiente objeto en la lista
     */
    nextItem() {
        this.currentItemIndex++;
        this.revealStage = 0;
        this.coveredCells = Array.from({length: 25}, (_, i) => i);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameLogic;
}
