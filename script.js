document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-button');
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.getElementById('progress-bar');
    const loadingText = document.getElementById('loading-text');
    const mainContent = document.getElementById('main-content');
    const startScreen = document.getElementById('start-screen');
    const codeInput = document.getElementById('code-input');
    const submitButton = document.getElementById('submit-button');
    const successMessage = document.getElementById('success-message');
    const ambientSound = document.getElementById('ambient-sound');

    loadingScreen.classList.add('hidden');
    mainContent.classList.add('hidden');

    function fadeInAudio() {
        ambientSound.volume = 0;
        ambientSound.play();

        let fadeAudio = setInterval(function () {
            if (ambientSound.volume < 0.5) {
                ambientSound.volume += 0.05;
            } else {
                clearInterval(fadeAudio);
            }
        }, 200);
    }

    startButton.addEventListener('click', function() {
        this.style.transform = 'translateY(2px)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);

        startScreen.classList.add('hidden');
        loadingScreen.classList.remove('hidden');

        fadeInAudio();

        // Тексты для загрузки
        const loadingPhrases = [
            'ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ...',
            'ПОДКЛЮЧЕНИЕ К СЕРВЕРУ...',
            'АНАЛИЗ ПРОТОКОЛА...',
            'ПРОВЕРКА КВАНТОВОЙ СИГНАТУРЫ...',
            'ЗАВЕРШЕНИЕ...'
        ];

        let progress = 0;
        let phraseIndex = 0;
        const totalDuration = 3000;
        const intervalTime = 30;
        const increment = 100 / (totalDuration / intervalTime);

        // Установим первую фразу
        loadingText.textContent = loadingPhrases[phraseIndex];
        phraseIndex++;

        // Запускаем анимацию прогресса
        const progressInterval = setInterval(() => {
            progress += increment;
            progressBar.style.width = progress + '%';

            // Обновляем текст в определенные моменты
            if (progress >= phraseIndex * 20 && phraseIndex < loadingPhrases.length) {
                loadingText.textContent = loadingPhrases[phraseIndex];
                phraseIndex++;
            }

            // Завершение загрузки
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    mainContent.classList.remove('hidden');
                    // Устанавливаем курсор в поле ввода
                    codeInput.focus();

                    // Анимация появления основного контента
                    mainContent.style.animation = 'fadeIn 0.8s forwards';
                }, 500);
            }
        }, intervalTime);
    });

    submitButton.addEventListener('click', function() {
        // Анимация нажатия кнопки
        this.style.transform = 'translateY(2px)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);

        const enteredCode = codeInput.value.trim().toUpperCase();
        if (enteredCode === 'ГИДРА') {
            successMessage.classList.remove('hidden');
            // Убираем пульсацию и центрируем сообщение
            document.querySelector('.success-content').style.display = 'flex';
            document.querySelector('.success-content').style.flexDirection = 'column';
            document.querySelector('.success-content').style.alignItems = 'center';
            document.querySelector('.success-text').style.textAlign = 'center';
        } else {
            // Анимация ошибки
            codeInput.style.animation = 'shake 0.5s';
            codeInput.style.borderColor = '#f00';
            setTimeout(() => {
                codeInput.style.animation = '';
                codeInput.style.borderColor = '#0f0';
            }, 500);
        }
    });

    if (window.innerWidth <= '768px') {
        const startButton = document.getElementById('start-button');
        startButton.style.width = '90%';
        startButton.style.maxWidth = '280px';
        startButton.style.margin = '10px auto';
    }

    // Обработка нажатия Enter в поле ввода
    codeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitButton.click();
        }
    });

    // HEX Puzzle Game
    const hexPuzzleScreen = document.getElementById('hex-puzzle-screen');
    const nextStageButton = document.getElementById('next-stage-button');

// Game configuration
    const config = {
        matrixSize: 6,
        minSequenceLength: 4,
        maxSequenceLength: 6
    };

// Game state
    let gameState = {
        matrix: [],
        targetSequence: [],
        selectedCells: [],
        gameActive: false,
        availableCells: [],
        firstCellHighlighted: false
    };

// DOM elements
    const elements = {
        matrix: document.getElementById('matrix'),
        targetSequence: document.getElementById('target-sequence'),
        buffer: document.getElementById('buffer'),
        message: document.getElementById('message'),
        restartBtn: document.getElementById('restart-btn')
    };

// Initialize the game
    function initHexPuzzle() {
        resetGameState();
        createMatrix();
        generateTargetSequence();
        renderGame();
        highlightFirstCell();
    }

    function resetGameState() {
        gameState = {
            matrix: [],
            targetSequence: [],
            selectedCells: [],
            gameActive: true,
            availableCells: [],
            firstCellHighlighted: false
        };

        clearElement(elements.matrix);
        clearElement(elements.buffer);
        clearElement(elements.message);
        elements.message.className = 'message';
    }

    function clearElement(element) {
        element.innerHTML = '';
    }

    function createMatrix() {
        for (let i = 0; i < config.matrixSize; i++) {
            gameState.matrix[i] = [];
            for (let j = 0; j < config.matrixSize; j++) {
                gameState.matrix[i][j] = generateHexCode();
            }
        }
    }

    function generateHexCode() {
        const chars = '0123456789ABCDEF';
        return chars[Math.floor(Math.random() * 16)] + chars[Math.floor(Math.random() * 16)];
    }

    function generateTargetSequence() {
        const length = getRandomLength();
        let path = createRandomPath(length);

        gameState.targetSequence = path.map(pos =>
            gameState.matrix[pos.x][pos.y]
        );
    }

    function getRandomLength() {
        return Math.floor(Math.random() *
            (config.maxSequenceLength - config.minSequenceLength + 1)) + config.minSequenceLength;
    }

    function createRandomPath(length) {
        let path = [];
        let visited = new Set();

        // Start with random position
        let current = getRandomPosition();
        path.push(current);
        visited.add(getPositionKey(current));

        // Generate path with rook moves
        for (let i = 1; i < length; i++) {
            let nextPositions = getValidMoves(current, visited);

            if (nextPositions.length === 0) {
                nextPositions = getAnyAvailablePositions(visited);

                if (nextPositions.length === 0) {
                    return createRandomPath(length);
                }
            }

            current = nextPositions[Math.floor(Math.random() * nextPositions.length)];
            path.push(current);
            visited.add(getPositionKey(current));
        }

        return path;
    }

    function getRandomPosition() {
        return {
            x: Math.floor(Math.random() * config.matrixSize),
            y: Math.floor(Math.random() * config.matrixSize)
        };
    }

    function getPositionKey(pos) {
        return `${pos.x},${pos.y}`;
    }

    function getValidMoves(current, visited) {
        let moves = [];

        // Horizontal moves
        for (let y = 0; y < config.matrixSize; y++) {
            if (y !== current.y) {
                const pos = {x: current.x, y};
                if (!visited.has(getPositionKey(pos))) {
                    moves.push(pos);
                }
            }
        }

        // Vertical moves
        for (let x = 0; x < config.matrixSize; x++) {
            if (x !== current.x) {
                const pos = {x, y: current.y};
                if (!visited.has(getPositionKey(pos))) {
                    moves.push(pos);
                }
            }
        }

        return moves;
    }

    function getAnyAvailablePositions(visited) {
        let positions = [];

        for (let x = 0; x < config.matrixSize; x++) {
            for (let y = 0; y < config.matrixSize; y++) {
                const pos = {x, y};
                if (!visited.has(getPositionKey(pos))) {
                    positions.push(pos);
                }
            }
        }

        return positions;
    }

    function highlightFirstCell() {
        if (gameState.firstCellHighlighted) return;

        const firstValue = gameState.targetSequence[0];
        const cells = elements.matrix.querySelectorAll('.cell');

        for (let cell of cells) {
            if (cell.textContent === firstValue) {
                cell.classList.add('start-hint');
                gameState.firstCellHighlighted = true;
                break;
            }
        }
    }

    function removeHighlightFromFirstCell() {
        const firstValue = gameState.targetSequence[0];
        const cells = elements.matrix.querySelectorAll('.cell');

        for (let cell of cells) {
            if (cell.textContent === firstValue) {
                cell.classList.remove('start-hint');
                break;
            }
        }
    }

    function renderGame() {
        clearElement(elements.matrix);

        for (let i = 0; i < config.matrixSize; i++) {
            for (let j = 0; j < config.matrixSize; j++) {
                const cell = createCellElement(i, j);
                elements.matrix.appendChild(cell);
            }
        }

        renderTargetSequence();
        updateBuffer();
    }

    function createCellElement(x, y) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = gameState.matrix[x][y];
        cell.dataset.x = x;
        cell.dataset.y = y;

        if (isSelected(x, y)) {
            cell.classList.add('selected');
        }

        if (isRemoved(x, y)) {
            cell.classList.add('removed');
        }

        if (isAvailable(x, y)) {
            cell.classList.add('available');
        }

        cell.addEventListener('click', () => handleCellClick(x, y));
        return cell;
    }

    function isSelected(x, y) {
        return gameState.selectedCells.some(cell =>
            cell.x === x && cell.y === y && !cell.removed
        );
    }

    function isRemoved(x, y) {
        return gameState.selectedCells.some(cell =>
            cell.x === x && cell.y === y && cell.removed
        );
    }

    function isAvailable(x, y) {
        return gameState.availableCells.some(pos =>
            pos.x === x && pos.y === y
        );
    }

    function renderTargetSequence() {
        elements.targetSequence.innerHTML = gameState.targetSequence.map((hex, index) =>
            `<span style="display: inline-block; padding: 3px; margin: 2px;
              background-color: rgba(0, 30, 0, 0.3); border-radius: 2px; border: 1px solid #0a0; ${
                index === 0 ? 'font-weight: bold; border: 1px solid #0f0' : ''
            }">${hex}</span>`
        ).join('');
    }

    function updateBuffer() {
        elements.buffer.innerHTML = gameState.selectedCells.map((cell, index) =>
            `<div class="buffer-hex" style="${
                index === gameState.selectedCells.length - 1 ?
                    'font-weight: bold; border: 1px solid #0f0' : ''
            }">${cell.value}</div>`
        ).join('');
    }

    function handleCellClick(x, y) {
        if (!gameState.gameActive) return;

        const cellValue = gameState.matrix[x][y];

        if (isRemoved(x, y)) return;

        // Remove highlight when any cell is clicked
        if (gameState.firstCellHighlighted) {
            removeHighlightFromFirstCell();
        }

        if (gameState.selectedCells.length === 0) {
            handleFirstSelection(x, y, cellValue);
        } else {
            handleNextSelection(x, y, cellValue);
        }
    }

    function handleFirstSelection(x, y, value) {
        if (value === gameState.targetSequence[0]) {
            selectCell(x, y, value);
            updateAvailableCells(x, y);
            renderGame();
        } else {
            showMessage("ОШИБКА: НАЧНИТЕ С ПЕРВОГО ЭЛЕМЕНТА ПОСЛЕДОВАТЕЛЬНОСТИ!", false);
            endGame();
        }
    }

    function handleNextSelection(x, y, value) {
        if (!isValidMove(x, y)) {
            showMessage("ОШИБКА: НЕВЕРНЫЙ ХОД! ВЫБИРАЙТЕ ЯЧЕЙКИ В ТОЙ ЖЕ СТРОКЕ ИЛИ СТОЛБЦЕ.", false);
            endGame();
            return;
        }

        if (value === gameState.targetSequence[gameState.selectedCells.length]) {
            clearAvailableCells();
            selectCell(x, y, value);

            if (isSequenceComplete()) {
                showMessage("УСПЕХ: ПОСЛЕДОВАТЕЛЬНОСТЬ ДЕШИФРОВАНА!", true);
                endGame();
            } else {
                updateAvailableCells(x, y);
            }

            renderGame();
        } else {
            showMessage("ОШИБКА: НЕВЕРНЫЙ ЭЛЕМЕНТ ПОСЛЕДОВАТЕЛЬНОСТИ!", false);
            endGame();
        }
    }

    function isValidMove(x, y) {
        return gameState.availableCells.some(pos =>
            pos.x === x && pos.y === y
        );
    }

    function isSequenceComplete() {
        return gameState.selectedCells.length === gameState.targetSequence.length;
    }

    function selectCell(x, y, value) {
        if (gameState.selectedCells.length > 0) {
            const last = gameState.selectedCells[gameState.selectedCells.length - 1];
            last.removed = true;
        }

        gameState.selectedCells.push({x, y, value, removed: false});
        updateBuffer();
    }

    function updateAvailableCells(x, y) {
        gameState.availableCells = [];

        // Horizontal moves
        for (let j = 0; j < config.matrixSize; j++) {
            if (j !== y && !isRemoved(x, j)) {
                gameState.availableCells.push({x, y: j});
            }
        }

        // Vertical moves
        for (let i = 0; i < config.matrixSize; i++) {
            if (i !== x && !isRemoved(i, y)) {
                gameState.availableCells.push({x: i, y});
            }
        }
    }

    function clearAvailableCells() {
        gameState.availableCells = [];
    }

    function showMessage(text, isSuccess) {
        elements.message.textContent = text;
        elements.message.className = `message visible ${isSuccess ? 'success' : 'error'}`;

        if (isSuccess) {
            document.getElementById('document-link').classList.remove('hidden');
        }
    }

    function endGame() {
        gameState.gameActive = false;
        clearAvailableCells();
        renderGame();
    }

    document.getElementById('view-document').addEventListener('click', function() {
        window.open('https://www.youtube.com/watch?v=KOOhPfMbuIQ', '_blank');
    });

    nextStageButton.addEventListener('click', function() {
        mainContent.classList.add('hidden');
        hexPuzzleScreen.classList.remove('hidden');
        initHexPuzzle();
    });

    elements.restartBtn.addEventListener('click', function() {
        initHexPuzzle();
    });
});