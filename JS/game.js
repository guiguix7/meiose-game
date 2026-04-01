const HOUSE_COUNT = 64;
const START_POINTS = 10;
const WIN_POINTS = 20;
const WRONG_ANSWER_POINTS = -1;
const SPECIAL_STEAL_POINTS = 1;
const TRUE_FALSE_HOUSES_COUNT = 10;
const WINNER_REDIRECT_DELAY_MS = 4500;

const QUESTION_REWARDS = {
    facil: 1,
    media: 3,
    dificil: 5,
    multipla_escolha: 1,
    verdadeiro_falso: 2
};

const MEIOSIS_PHASES = {
    1: "Inicio",
    4: "Interfase",
    13: "Profase I",
    20: "Metafase I",
    29: "Anafase I",
    36: "Telofase I",
    45: "Profase II",
    52: "Metafase II",
    61: "Anafase II",
    64: "Telofase II"
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
    timerSeconds: 0,
    timerIntervalId: null,
    remainingQuestionIndexes: [],
    lastCorrectPlayerId: null,
    questionHouses: {
        multipla: new Set(),
        verdadeiroFalso: new Set()
    },
    houses: [],
    boardElement: document.getElementById("board"),
    scoreListElement: document.getElementById("score-list"),
    eventLogElement: document.getElementById("event-log"),
    turnTextElement: document.getElementById("turn-text"),
    diceTextElement: document.getElementById("dice-text"),
    rollButtonElement: document.getElementById("roll-btn"),
    rulesButtonElement: document.getElementById("rules-btn"),
    rulesModalElement: document.getElementById("rules-modal"),
    closeRulesButtonElement: document.getElementById("close-rules-btn"),
    endGameButtonElement: document.getElementById("end-game-btn"),
    timerElement: document.getElementById("cronometro"),
    questionModalElement: document.getElementById("question-modal"),
    questionPromptElement: document.getElementById("question-prompt"),
    questionTypeElement: document.getElementById("question-type"),
    answerOptionsElement: document.getElementById("answer-options"),
    feedbackElement: document.getElementById("feedback"),
    submitAnswerButtonElement: document.getElementById("submit-answer"),
    winnerModalElement: document.getElementById("winner-modal"),
    winnerTitleElement: document.getElementById("winner-title"),
    winnerMessageElement: document.getElementById("winner-message"),
    winnerHomeButtonElement: document.getElementById("winner-home-btn"),
    winnerRedirectTimeoutId: null
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
        if (!Array.isArray(parsedPlayers) || parsedPlayers.length < 1) {
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
    assignQuestionHouses();
    buildBoard();
    createPlayerTokens();
    updateAllTokensPosition();
    updateTurnUI();
    updateScoreboard();
    startMatchTimer();
    logEvent("Jogo iniciado! Boa sorte na jornada da meiose.");
}

function bindGameEvents() {
    gameState.rollButtonElement.addEventListener("click", handleRollTurn);
    gameState.submitAnswerButtonElement.addEventListener("click", handleAnswerSubmit);
    gameState.endGameButtonElement.addEventListener("click", handleEndGameClick);
    gameState.winnerHomeButtonElement.addEventListener("click", redirectToHome);
    gameState.rulesButtonElement.addEventListener("click", openRulesModal);
    gameState.closeRulesButtonElement.addEventListener("click", closeRulesModal);

    gameState.rulesModalElement.addEventListener("click", (event) => {
        if (event.target === gameState.rulesModalElement) {
            closeRulesModal();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeRulesModal();
        }
    });

    window.addEventListener("resize", updateAllTokensPosition);
}

function openRulesModal() {
    gameState.rulesModalElement.classList.remove("hidden");
}

function closeRulesModal() {
    gameState.rulesModalElement.classList.add("hidden");
}

function buildBoard() {
    gameState.houses = [];
    gameState.boardElement.innerHTML = "";

    for (let i = 1; i <= HOUSE_COUNT; i += 1) {
        const house = document.createElement("div");
        house.className = `cell house ${getHouseType(i)}`;

        if (gameState.questionHouses.multipla.has(i)) {
            house.classList.add("question-multipla");
            house.setAttribute("title", "Questao de multipla escolha");
            appendHouseTag(house, "ABCD");
        } else if (gameState.questionHouses.verdadeiroFalso.has(i)) {
            house.classList.add("question-vf");
            house.setAttribute("title", "Questao de verdadeiro ou falso");
            appendHouseTag(house, "V/F");
        }

        if (i === 1) {
            house.classList.add("start");
        }

        if (i === HOUSE_COUNT) {
            house.classList.add("finish");
        }

        if (MEIOSIS_PHASES[i] && getHouseType(i) === "normal") {
            house.classList.add("fase");
            house.textContent = MEIOSIS_PHASES[i];
        } else {
            house.textContent = String(i);
        }

        gameState.houses.push({ index: i, element: house });
        gameState.boardElement.appendChild(house);
    }
}

function appendHouseTag(houseElement, label) {
    const tag = document.createElement("span");
    tag.className = "house-tag";
    tag.textContent = label;
    houseElement.appendChild(tag);
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

function assignQuestionHouses() {
    const availableHouses = [];

    for (let i = 1; i <= HOUSE_COUNT; i += 1) {
        if (getHouseType(i) !== "normal") {
            continue;
        }

        if (MEIOSIS_PHASES[i]) {
            continue;
        }

        availableHouses.push(i);
    }

    shuffleArray(availableHouses);
    const totalAvailable = availableHouses.length;
    const vfCount = Math.min(TRUE_FALSE_HOUSES_COUNT, totalAvailable);
    const vfHouses = availableHouses.slice(0, vfCount);
    const multiplaHouses = availableHouses.slice(vfCount);

    gameState.questionHouses.verdadeiroFalso = new Set(vfHouses);
    gameState.questionHouses.multipla = new Set(multiplaHouses);
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

function shuffleArray(list) {
    for (let i = list.length - 1; i > 0; i -= 1) {
        const swapIndex = randomInt(0, i);
        [list[i], list[swapIndex]] = [list[swapIndex], list[i]];
    }
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
    const forcedType = getQuestionTypeFromHouse(currentPlayer.position);
    const selectedQuestionIndex = drawQuestionIndex(forcedType);
    gameState.currentQuestion = QUESTIONS[selectedQuestionIndex];
    gameState.currentQuestionType = getQuestionType(gameState.currentQuestion);
    gameState.pendingSpecial = getHouseType(currentPlayer.position);

    gameState.questionTypeElement.textContent = `Tipo: ${formatQuestionTypeLabel(gameState.currentQuestionType)}`;
    gameState.questionPromptElement.textContent = getQuestionPromptText(gameState.currentQuestion);
    gameState.feedbackElement.textContent = "";
    renderAnswerFields(gameState.currentQuestion, gameState.currentQuestionType);
    gameState.questionModalElement.classList.remove("hidden");
}

function getQuestionTypeFromHouse(position) {
    const houseType = getHouseType(position);
    if (houseType !== "normal") {
        return "especial";
    }

    if (gameState.questionHouses.multipla.has(position)) {
        return "facil_media_dificil";
    }

    if (gameState.questionHouses.verdadeiroFalso.has(position)) {
        return "verdadeiro_falso";
    }

    return null;
}

function drawQuestionIndex(forcedType) {
    let pool = gameState.remainingQuestionIndexes;

    if (forcedType) {
        const filtered = pool.filter((index) => {
            const type = getQuestionType(QUESTIONS[index]);
            if (forcedType === "facil_media_dificil") {
                return type === "facil" || type === "media" || type === "dificil" || type === "multipla_escolha";
            }

            return type === forcedType;
        });

        if (filtered.length > 0) {
            pool = filtered;
        }
    }

    const randomPoolIndex = randomInt(0, pool.length - 1);
    const selectedQuestionIndex = pool[randomPoolIndex];
    const removeIndex = gameState.remainingQuestionIndexes.indexOf(selectedQuestionIndex);
    if (removeIndex >= 0) {
        gameState.remainingQuestionIndexes.splice(removeIndex, 1);
    }

    return selectedQuestionIndex;
}

function handleAnswerSubmit() {
    if (gameState.gameEnded || !gameState.currentQuestion) {
        return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const userAnswer = normalizeText(getCurrentAnswerValue());
    if (!userAnswer) {
        gameState.feedbackElement.textContent = "Selecione uma alternativa para confirmar.";
        return;
    }

    const expectedAnswer = normalizeText(gameState.currentQuestion.answer);
    const isCorrect = userAnswer === expectedAnswer;

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
        clearQuestionUI();
        applySpecialHouseEffect(currentPlayer);
        finalizeTurn();
    }, 900);
}

function clearQuestionUI() {
    gameState.questionTypeElement.textContent = "";
    gameState.answerOptionsElement.innerHTML = "";
    gameState.answerOptionsElement.classList.add("hidden");
}

function renderAnswerFields(question, questionType) {
    const shouldUseChoice = questionUsesAlternatives(question, questionType);
    gameState.answerOptionsElement.innerHTML = "";

    if (!shouldUseChoice) {
        return;
    }

    gameState.answerOptionsElement.classList.remove("hidden");

    const options = questionType === "verdadeiro_falso"
        ? [
            { value: "verdadeiro", label: "Verdadeiro" },
            { value: "falso", label: "Falso" }
        ]
        : buildMultipleChoiceOptions(question.prompt);

    const groupName = `answer-option-${Date.now()}`;
    for (const option of options) {
        const label = document.createElement("label");
        label.className = "answer-option-item";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = groupName;
        input.value = option.value;

        const text = document.createElement("span");
        text.textContent = option.label;

        label.appendChild(input);
        label.appendChild(text);
        gameState.answerOptionsElement.appendChild(label);
    }
}

function questionUsesAlternatives(question, questionType) {
    if (questionType === "verdadeiro_falso") {
        return true;
    }

    const promptText = String(question?.prompt || "").toLowerCase();
    return /\ba\)\s*.+\bb\)\s*.+/s.test(promptText);
}

function buildMultipleChoiceOptions(promptText) {
    const normalizedPrompt = String(promptText || "");
    const optionMatches = [...normalizedPrompt.matchAll(/([a-d])\)\s*([\s\S]*?)(?=\s+[a-d]\)\s*|$)/gi)];
    const options = [];

    for (const match of optionMatches) {
        const value = (match[1] || "").toLowerCase();
        const text = (match[2] || "").trim();
        options.push({ value, label: `${value.toUpperCase()}) ${text || "Alternativa"}` });
    }

    const fallbackLabels = {
        a: "A) Alternativa A",
        b: "B) Alternativa B",
        c: "C) Alternativa C",
        d: "D) Alternativa D"
    };

    const values = ["a", "b", "c", "d"];
    for (const value of values) {
        if (!options.some((option) => option.value === value)) {
            options.push({ value, label: fallbackLabels[value] });
        }
    }

    return values.map((value) => options.find((option) => option.value === value));
}

function getQuestionPromptText(question) {
    const promptText = String(question.prompt || "").trim();
    return promptText.replace(/\s*[a-d]\)\s*[\s\S]*?(?=\s+[a-d]\)\s*|$)/gi, "").trim();
}

function getCurrentAnswerValue() {
    const selected = gameState.answerOptionsElement.querySelector('input[type="radio"]:checked');
    return selected ? selected.value : "";
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
        if (others.length === 0) {
            logEvent(`${player.name} caiu em Crossing-over, mas nao ha outro jogador para trocar.`);
        } else {
            const target = others[randomInt(0, others.length - 1)];
            const oldPos = player.position;
            player.position = target.position;
            target.position = oldPos;
            updateAllTokensPosition();
            logEvent(`${player.name} caiu em Crossing-over e trocou de posicao com ${target.name}.`);
        }
    }

    if (type === "mutacao") {
        player.points -= 2;
        logEvent(`${player.name} caiu em Mutacao e perdeu 2 pontos.`);
    }

    if (type === "divisao") {
        player.extraTurn = true;
        logEvent(`${player.name} caiu em Divisao Celular e jogará novamente.`);
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
    gameState.endGameButtonElement.disabled = true;
    stopMatchTimer();
    gameState.turnTextElement.textContent = `Fim de jogo! ${winner.name} venceu com ${winner.points} pontos.`;
    logEvent(`Vitoria de ${winner.name} ao atingir ${winner.points} pontos.`);
    showWinnerModal("Vitoria", `Fim de jogo! ${winner.name} venceu com ${winner.points} pontos.`);
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

    const normalizedAnswer = normalizeText(question.answer || "");
    if (normalizedAnswer === "verdadeiro" || normalizedAnswer === "falso") {
        return "verdadeiro_falso";
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

    const value = String(type)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9_\s]/g, "")
        .trim()
        .replace(/\s+/g, "_");

    const aliases = {
        facil: "facil",
        media: "media",
        dificil: "dificil",
        multipla_escolha: "multipla_escolha",
        multipla: "multipla_escolha",
        verdadeiro_ou_falso: "verdadeiro_falso",
        verdadeiro_falso: "verdadeiro_falso",
        verdadeirofalso: "verdadeiro_falso",
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

function formatQuestionTypeLabel(type) {
    const labels = {
        facil: "Facil",
        media: "Media",
        dificil: "Dificil",
        multipla_escolha: "Alternativa",
        verdadeiro_falso: "Verdadeiro ou falso",
        especial: "Especial"
    };

    return labels[type] || "Facil";
}

function endGameByQuestionLimit() {
    const winner = resolveWinnerByPoints();
    if (!winner) {
        return;
    }

    gameState.gameEnded = true;
    gameState.isRollingLocked = true;
    gameState.rollButtonElement.disabled = true;
    gameState.endGameButtonElement.disabled = true;
    stopMatchTimer();

    gameState.turnTextElement.textContent = `Fim das perguntas! ${winner.name} venceu com ${winner.points} pontos.`;
    logEvent(`Fim das perguntas. Vencedor: ${winner.name} com ${winner.points} pontos.`);
    showWinnerModal("Fim das perguntas", `${winner.name} venceu com ${winner.points} pontos.`);
}

function startMatchTimer() {
    stopMatchTimer();
    gameState.timerSeconds = 0;
    updateTimerUI();
    gameState.timerIntervalId = window.setInterval(() => {
        gameState.timerSeconds += 1;
        updateTimerUI();
    }, 1000);
}

function stopMatchTimer() {
    if (gameState.timerIntervalId !== null) {
        window.clearInterval(gameState.timerIntervalId);
        gameState.timerIntervalId = null;
    }
}

function updateTimerUI() {
    const minutes = String(Math.floor(gameState.timerSeconds / 60)).padStart(2, "0");
    const seconds = String(gameState.timerSeconds % 60).padStart(2, "0");
    gameState.timerElement.textContent = `${minutes}:${seconds}`;
}

function handleEndGameClick() {
    if (gameState.gameEnded) {
        return;
    }

    const shouldLeave = window.confirm("Deseja encerrar a partida e voltar para a tela inicial?");
    if (!shouldLeave) {
        return;
    }

    stopMatchTimer();
    sessionStorage.removeItem("meiose-players");
    window.location.href = "index.html";
}

function showWinnerModal(title, message) {
    if (gameState.winnerRedirectTimeoutId !== null) {
        window.clearTimeout(gameState.winnerRedirectTimeoutId);
        gameState.winnerRedirectTimeoutId = null;
    }

    gameState.winnerTitleElement.textContent = title;
    gameState.winnerMessageElement.textContent = `${message} Redirecionando para o inicio...`;
    gameState.winnerModalElement.classList.remove("hidden");

    gameState.winnerRedirectTimeoutId = window.setTimeout(() => {
        redirectToHome();
    }, WINNER_REDIRECT_DELAY_MS);
}

function redirectToHome() {
    if (gameState.winnerRedirectTimeoutId !== null) {
        window.clearTimeout(gameState.winnerRedirectTimeoutId);
        gameState.winnerRedirectTimeoutId = null;
    }

    sessionStorage.removeItem("meiose-players");
    window.location.href = "index.html";
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
