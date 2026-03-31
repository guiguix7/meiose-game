const HOUSE_COUNT = 63;
const START_POINTS = 10;
const WIN_POINTS = 20;
const WRONG_ANSWER_POINTS = -1;
const SPECIAL_STEAL_POINTS = 5;

const QUESTION_REWARDS = {
    facil: 1,
    media: 3,
    dificil: 5,
    multipla_escolha: 1,
    verdadeiro_falso: 2
};

const MEIOSIS_PHASES = {
    1: "Inicio",
    5: "Interfase",
    12: "Profase I",
    20: "Metafase I",
    28: "Anafase I",
    36: "Telofase I",
    44: "Profase II",
    52: "Metafase II",
    60: "Anafase II",
    63: "Telofase II"
};

const SPECIAL_HOUSES = {
    crossing: new Set([8, 19, 36, 52]),
    mutacao: new Set([12, 27, 44, 60]),
    divisao: new Set([5, 22, 40, 58])
};

const gameState = {
    players: [],
    currentPlayerIndex: 0,
    isRollingLocked: false,
    gameEnded: false,
    pendingSpecial: null,
    currentQuestion: null,
    currentQuestionType: "facil",
    pendingDoubleRollBonus: false,
    remainingQuestionIndexes: [],
    lastCorrectPlayerId: null,
    houses: [],
    boardElement: document.getElementById("board"),
    scoreListElement: document.getElementById("score-list"),
    eventLogElement: document.getElementById("event-log"),
    turnTextElement: document.getElementById("turn-text"),
    diceTextElement: document.getElementById("dice-text"),
    rollButtonElement: document.getElementById("roll-btn"),
    questionModalElement: document.getElementById("question-modal"),
    questionPromptElement: document.getElementById("question-prompt"),
    answerInputElement: document.getElementById("answer-input"),
    feedbackElement: document.getElementById("feedback"),
    submitAnswerButtonElement: document.getElementById("submit-answer")
};

initializeGame();

function initializeGame() {
    if (typeof QUESTIONS === "undefined" || !Array.isArray(QUESTIONS) || QUESTIONS.length === 0) {
        alert("As perguntas nao foram carregadas. Verifique JS/questions.js.");
        window.location.href = "index.html";
        return;
    }

    const savedPlayers = sessionStorage.getItem("meiose-players");
    if (!savedPlayers) {
        alert("Configure os jogadores antes de iniciar a partida.");
        window.location.href = "index.html";
        return;
    }

    try {
        const parsedPlayers = JSON.parse(savedPlayers);
        if (!Array.isArray(parsedPlayers) || parsedPlayers.length < 2) {
            throw new Error("Jogadores invalidos");
        }

        gameState.players = parsedPlayers.map((player) => ({
            id: player.id,
            name: player.name,
            color: player.color,
            position: 1,
            points: START_POINTS,
            token: null,
            extraTurn: false
        }));
    } catch (error) {
        alert("Nao foi possivel carregar os jogadores. Configure novamente.");
        window.location.href = "index.html";
        return;
    }

    bindGameEvents();
    gameState.remainingQuestionIndexes = QUESTIONS.map((_, index) => index);
    buildBoard();
    createPlayerTokens();
    updateAllTokensPosition();
    updateTurnUI();
    updateScoreboard();
    logEvent("Jogo iniciado! Boa sorte na jornada da meiose.");
}

function bindGameEvents() {
    gameState.rollButtonElement.addEventListener("click", handleRollTurn);
    gameState.submitAnswerButtonElement.addEventListener("click", handleAnswerSubmit);

    gameState.answerInputElement.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleAnswerSubmit();
        }
    });

    window.addEventListener("resize", updateAllTokensPosition);
}

function buildBoard() {
    gameState.houses = [];
    gameState.boardElement.innerHTML = "";

    for (let i = 1; i <= HOUSE_COUNT; i += 1) {
        const house = document.createElement("div");
        house.className = `cell house ${getHouseType(i)}`;

        if (i === 1) {
            house.classList.add("start");
        }

        if (i === HOUSE_COUNT) {
            house.classList.add("finish");
        }

        if (MEIOSIS_PHASES[i]) {
            house.classList.add("fase");
            house.textContent = MEIOSIS_PHASES[i];
        } else {
            house.textContent = String(i);
        }

        gameState.houses.push({ index: i, element: house });
        gameState.boardElement.appendChild(house);
    }
}

function getHouseType(index) {
    if (SPECIAL_HOUSES.crossing.has(index)) {
        return "crossing";
    }

    if (SPECIAL_HOUSES.mutacao.has(index)) {
        return "mutacao";
    }

    if (SPECIAL_HOUSES.divisao.has(index)) {
        return "divisao";
    }

    return "normal";
}

function createPlayerTokens() {
    for (const player of gameState.players) {
        const token = document.createElement("div");
        token.className = "token";
        token.style.background = player.color;
        token.title = player.name;
        gameState.boardElement.appendChild(token);
        player.token = token;
    }
}

function updateAllTokensPosition() {
    for (const player of gameState.players) {
        positionToken(player);
    }
}

function positionToken(player) {
    const house = gameState.houses[player.position - 1];
    if (!house || !house.element || !player.token) {
        return;
    }

    const boardRect = gameState.boardElement.getBoundingClientRect();
    const cellRect = house.element.getBoundingClientRect();
    const centerX = cellRect.left - boardRect.left + cellRect.width / 2;
    const centerY = cellRect.top - boardRect.top + cellRect.height / 2;

    const sameHousePlayers = gameState.players.filter((p) => p.position === player.position);
    const offsetIndex = sameHousePlayers.findIndex((p) => p.id === player.id);
    const spread = 9;
    const offsetX = (offsetIndex % 3 - 1) * spread;
    const offsetY = Math.floor(offsetIndex / 3) * spread - spread / 2;

    player.token.style.left = `${centerX + offsetX}px`;
    player.token.style.top = `${centerY + offsetY}px`;
}

async function handleRollTurn() {
    if (gameState.gameEnded || gameState.isRollingLocked) {
        return;
    }

    gameState.isRollingLocked = true;
    gameState.rollButtonElement.disabled = true;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const die1 = randomInt(1, 6);
    const die2 = randomInt(1, 6);
    const total = die1 + die2;
    gameState.pendingDoubleRollBonus = die1 === die2;

    gameState.diceTextElement.textContent = `Dados: ${die1} + ${die2} = ${total}`;
    logEvent(`${currentPlayer.name} rolou ${die1} e ${die2}. Avanco: ${total}.`);

    await animatePlayerMove(currentPlayer, total);
    askQuestionForCurrentPlayer();
}

async function animatePlayerMove(player, steps) {
    for (let i = 0; i < steps; i += 1) {
        player.position = loopPosition(player.position + 1);
        positionToken(player);
        await wait(180);
    }
}

function loopPosition(position) {
    if (position > HOUSE_COUNT) {
        return ((position - 1) % HOUSE_COUNT) + 1;
    }

    return position;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function askQuestionForCurrentPlayer() {
    if (gameState.remainingQuestionIndexes.length === 0) {
        endGameByQuestionLimit();
        return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const randomPoolIndex = randomInt(0, gameState.remainingQuestionIndexes.length - 1);
    const selectedQuestionIndex = gameState.remainingQuestionIndexes.splice(randomPoolIndex, 1)[0];
    gameState.currentQuestion = QUESTIONS[selectedQuestionIndex];
    gameState.currentQuestionType = getQuestionType(gameState.currentQuestion);
    gameState.pendingSpecial = getHouseType(currentPlayer.position);

    gameState.questionPromptElement.textContent = gameState.currentQuestion.prompt;
    gameState.feedbackElement.textContent = "";
    gameState.answerInputElement.value = "";
    gameState.questionModalElement.classList.remove("hidden");
    gameState.answerInputElement.focus();
}

function handleAnswerSubmit() {
    if (gameState.gameEnded || !gameState.currentQuestion) {
        return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const userAnswer = normalizeText(gameState.answerInputElement.value);
    const expectedAnswer = normalizeText(gameState.currentQuestion.answer);
    const isCorrect = userAnswer.length > 0 && userAnswer === expectedAnswer;

    if (isCorrect) {
        gameState.lastCorrectPlayerId = currentPlayer.id;

        const rewardMessage = applyCorrectAnswerReward(currentPlayer, gameState.currentQuestionType);
        gameState.feedbackElement.textContent = rewardMessage;

        if (gameState.pendingDoubleRollBonus) {
            currentPlayer.extraTurn = true;
            logEvent(`${currentPlayer.name} acertou com dados iguais e ganhou turno extra.`);
        }
    } else {
        currentPlayer.points += WRONG_ANSWER_POINTS;
        gameState.feedbackElement.textContent = `Resposta incorreta! Correto: ${gameState.currentQuestion.answer}. (-1 ponto)`;
        logEvent(`${currentPlayer.name} errou a pergunta (-1).`);
    }

    updateScoreboard();

    setTimeout(() => {
        gameState.questionModalElement.classList.add("hidden");
        applySpecialHouseEffect(currentPlayer);
        finalizeTurn();
    }, 900);
}

function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function applySpecialHouseEffect(player) {
    const type = gameState.pendingSpecial;
    gameState.pendingSpecial = null;

    if (type === "crossing") {
        const others = gameState.players.filter((p) => p.id !== player.id);
        const target = others[randomInt(0, others.length - 1)];
        const oldPos = player.position;
        player.position = target.position;
        target.position = oldPos;
        updateAllTokensPosition();
        logEvent(`${player.name} caiu em Crossing-over e trocou de posicao com ${target.name}.`);
    }

    if (type === "mutacao") {
        player.points -= 2;
        logEvent(`${player.name} caiu em Mutacao e perdeu 2 pontos.`);
    }

    if (type === "divisao") {
        player.extraTurn = true;
        logEvent(`${player.name} caiu em Divisao Celular e jogara novamente.`);
    }

    updateScoreboard();
}

function finalizeTurn() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (currentPlayer.points >= WIN_POINTS) {
        endGame(currentPlayer);
        return;
    }

    if (gameState.remainingQuestionIndexes.length === 0) {
        endGameByQuestionLimit();
        return;
    }

    if (currentPlayer.extraTurn) {
        currentPlayer.extraTurn = false;
        logEvent(`${currentPlayer.name} recebeu turno extra.`);
    } else {
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    }

    gameState.isRollingLocked = false;
    gameState.rollButtonElement.disabled = false;
    gameState.currentQuestion = null;
    gameState.currentQuestionType = "facil";
    gameState.pendingDoubleRollBonus = false;
    updateTurnUI();
}

function updateTurnUI() {
    const player = gameState.players[gameState.currentPlayerIndex];
    gameState.turnTextElement.textContent = `Vez de ${player.name} | Casa ${player.position} | Pontos ${player.points}`;
}

function updateScoreboard() {
    gameState.scoreListElement.innerHTML = "";
    for (const player of gameState.players) {
        const item = document.createElement("li");
        item.textContent = `${player.name}: ${player.points} pontos (Casa ${player.position})`;
        item.style.color = player.color;
        gameState.scoreListElement.appendChild(item);
    }

    updateAllTokensPosition();
    updateTurnUI();
}

function logEvent(message) {
    const item = document.createElement("li");
    item.textContent = message;
    gameState.eventLogElement.prepend(item);

    while (gameState.eventLogElement.children.length > 14) {
        gameState.eventLogElement.removeChild(gameState.eventLogElement.lastChild);
    }
}

function endGame(winner) {
    gameState.gameEnded = true;
    gameState.isRollingLocked = true;
    gameState.rollButtonElement.disabled = true;
    gameState.turnTextElement.textContent = `Fim de jogo! ${winner.name} venceu com ${winner.points} pontos.`;
    logEvent(`Vitoria de ${winner.name} ao atingir ${winner.points} pontos.`);
    alert(`Fim de jogo! ${winner.name} venceu com ${winner.points} pontos.`);
}

function applyCorrectAnswerReward(player, questionType) {
    if (questionType === "especial") {
        let stolenTotal = 0;
        for (const opponent of gameState.players) {
            if (opponent.id === player.id) {
                continue;
            }

            const stolen = Math.min(SPECIAL_STEAL_POINTS, opponent.points);
            opponent.points -= stolen;
            stolenTotal += stolen;
        }

        player.points += stolenTotal;
        logEvent(`${player.name} acertou pergunta especial e roubou ${stolenTotal} pontos no total.`);
        return `Resposta correta! Pergunta especial: +${stolenTotal} pontos roubados.`;
    }

    const points = QUESTION_REWARDS[questionType] || QUESTION_REWARDS.facil;
    player.points += points;
    logEvent(`${player.name} acertou pergunta ${getQuestionTypeLabel(questionType)} (+${points}).`);
    return `Resposta correta! +${points} ponto${points > 1 ? "s" : ""}.`;
}

function getQuestionType(question) {
    const normalizedType = normalizeQuestionType(question.type);
    if (normalizedType) {
        return normalizedType;
    }

    const promptText = normalizeText(question.prompt || "");
    if (promptText.includes("verdadeiro ou falso")) {
        return "verdadeiro_falso";
    }

    return "facil";
}

function normalizeQuestionType(type) {
    if (!type) {
        return null;
    }

    const value = normalizeText(String(type)).replace(/\s+/g, "_");
    const aliases = {
        facil: "facil",
        media: "media",
        dificil: "dificil",
        multipla_escolha: "multipla_escolha",
        multipla: "multipla_escolha",
        verdadeiro_ou_falso: "verdadeiro_falso",
        verdadeiro_falso: "verdadeiro_falso",
        vf: "verdadeiro_falso",
        especial: "especial"
    };

    return aliases[value] || null;
}

function getQuestionTypeLabel(type) {
    const labels = {
        facil: "facil",
        media: "media",
        dificil: "dificil",
        multipla_escolha: "de multipla escolha",
        verdadeiro_falso: "de verdadeiro ou falso",
        especial: "especial"
    };

    return labels[type] || "facil";
}

function endGameByQuestionLimit() {
    const winner = resolveWinnerByPoints();
    if (!winner) {
        return;
    }

    gameState.gameEnded = true;
    gameState.isRollingLocked = true;
    gameState.rollButtonElement.disabled = true;

    gameState.turnTextElement.textContent = `Fim das perguntas! ${winner.name} venceu com ${winner.points} pontos.`;
    logEvent(`Fim das perguntas. Vencedor: ${winner.name} com ${winner.points} pontos.`);
    alert(`Fim das perguntas! ${winner.name} venceu com ${winner.points} pontos.`);
}

function resolveWinnerByPoints() {
    if (gameState.players.length === 0) {
        return null;
    }

    let highestPoints = -Infinity;
    for (const player of gameState.players) {
        if (player.points > highestPoints) {
            highestPoints = player.points;
        }
    }

    const tiedPlayers = gameState.players.filter((player) => player.points === highestPoints);
    if (tiedPlayers.length === 1) {
        return tiedPlayers[0];
    }

    if (gameState.lastCorrectPlayerId !== null) {
        const tieBreakerWinner = tiedPlayers.find((player) => player.id === gameState.lastCorrectPlayerId);
        if (tieBreakerWinner) {
            return tieBreakerWinner;
        }
    }

    return tiedPlayers[0];
}
