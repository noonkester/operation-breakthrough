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

    // Изначально скрываем экран загрузки и основной контент
    loadingScreen.classList.add('hidden');
    mainContent.classList.add('hidden');

    startButton.addEventListener('click', function() {
        // Анимация нажатия кнопки
        this.style.transform = 'translateY(2px)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);

        startScreen.classList.add('hidden');
        loadingScreen.classList.remove('hidden');

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
});
