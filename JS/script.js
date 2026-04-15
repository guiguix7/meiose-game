import { inject } from "@vercel/analytics"

inject()
const PLAYER_COLORS = ["#ff6b6b", "#4dabf7", "#51cf66", "#ffd43b", "#b197fc", "#ff922b"];

const setup = {
    checkboxes: Array.from(document.querySelectorAll('.select-players input[type="checkbox"]')),
    startButton: document.getElementById("start-btn"),
    selectPlayers: document.querySelector(".select-players"),
    setupCard: document.querySelector(".setup-card"),
    playerConfigPanel: null
};

setupSelectionEvents();
setup.startButton.addEventListener("click", startGameFromSetup);

function setupSelectionEvents() {
    for (const checkbox of setup.checkboxes) {
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                for (const other of setup.checkboxes) {
                    if (other !== checkbox) {
                        other.checked = false;
                    }
                }
            }

            if (setup.playerConfigPanel) {
                setup.playerConfigPanel.remove();
                setup.playerConfigPanel = null;
                setup.startButton.classList.remove("hidden");
            }

            updateSelectionVisualState();
        });
    }

    updateSelectionVisualState();
}

function updateSelectionVisualState() {
    for (const checkbox of setup.checkboxes) {
        const label = checkbox.closest("label");
        if (!label) {
            continue;
        }
        label.style.borderColor = checkbox.checked ? "#53b889" : "#d8e7f2";
        label.style.background = checkbox.checked
            ? "linear-gradient(135deg, #eefcf3, #def7ea)"
            : "linear-gradient(135deg, #fbfeff, #f5fbff)";
    }
}

function getSelectedPlayerCount() {
    const selected = setup.checkboxes.find((box) => box.checked);
    if (!selected) {
        return 0;
    }
    return Number.parseInt(selected.id, 10);
}

function startGameFromSetup() {
    const playerCount = getSelectedPlayerCount();
    if (playerCount < 1 || playerCount > 6) {
        alert("Selecione a quantidade de jogadores (1 a 6) para iniciar.");
        return;
    }

    showPlayerConfigPanel(playerCount);
}

function showPlayerConfigPanel(playerCount) {
    if (setup.playerConfigPanel) {
        setup.playerConfigPanel.remove();
    }

    const panel = document.createElement("div");
    panel.className = "player-config-panel";
    panel.innerHTML = `
        <h2 class="config-title">Dados dos Jogadores</h2>
        <p class="config-subtitle">Informe nome e escolha a cor de cada jogador.</p>
        <div class="name-grid" id="player-config-grid"></div>
        <button id="confirm-players-btn" class="btn primary">Começar Partida</button>
    `;

    setup.startButton.classList.add("hidden");

    setup.startButton.insertAdjacentElement("beforebegin", panel);
    setup.playerConfigPanel = panel;

    const configGrid = panel.querySelector("#player-config-grid");
    for (let i = 1; i <= playerCount; i += 1) {
        const row = document.createElement("div");
        row.className = "player-config-row";
        row.innerHTML = `
            <input id="player-name-${i}" type="text" maxlength="20" placeholder="Nome do Jogador ${i}" />
            <input id="player-color-${i}" type="color" value="${PLAYER_COLORS[i - 1]}" aria-label="Cor do Jogador ${i}" />
        `;
        configGrid.appendChild(row);
    }

    const confirmButton = panel.querySelector("#confirm-players-btn");
    confirmButton.addEventListener("click", () => confirmPlayersAndStart(playerCount));
}

function confirmPlayersAndStart(playerCount) {
    const players = createPlayers(playerCount);
    if (!players) {
        return;
    }

    // Persist player setup so game.html can initialize match state.
    sessionStorage.setItem("meiose-players", JSON.stringify(players));

    if (setup.playerConfigPanel) {
        setup.playerConfigPanel.remove();
        setup.playerConfigPanel = null;
    }

    setup.startButton.classList.remove("hidden");

    window.location.href = "game.html";
}

function createPlayers(playerCount) {
    const players = [];
    const usedNames = new Set();
    const usedColors = new Set();

    for (let i = 1; i <= playerCount; i += 1) {
        const input = document.getElementById(`player-name-${i}`);
        const colorInput = document.getElementById(`player-color-${i}`);
        const customName = input ? input.value.trim() : "";
        const customColor = colorInput && colorInput.value ? colorInput.value : PLAYER_COLORS[i - 1];

        if (!customName) {
            alert(`Informe o nome do Jogador ${i}.`);
            return null;
        }

        if (customName.length > 20) {
            alert(`O nome do Jogador ${i} deve ter no maximo 20 caracteres.`);
            return null;
        }

        const normalizedName = normalizePlayerName(customName);
        if (usedNames.has(normalizedName)) {
            alert("Nao pode ter jogadores com nomes iguais.");
            return null;
        }

        if (!customColor) {
            alert(`Escolha uma cor para o Jogador ${i}.`);
            return null;
        }

        const normalizedColor = customColor.toLowerCase();
        if (usedColors.has(normalizedColor)) {
            alert("Nao pode ter jogadores com cores iguais.");
            return null;
        }

        usedNames.add(normalizedName);
        usedColors.add(normalizedColor);

        players.push({
            id: i,
            name: customName,
            position: 1,
            color: customColor,
            token: null
        });
    }

    return players;
}

function normalizePlayerName(name) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
