HTMLMediaElement.prototype.playOriginal = HTMLMediaElement.prototype.play;

HTMLMediaElement.prototype.play = function() {
    this.muted = true; // Заглушаем звук
    // return Promise.resolve(); // Возвращаем успешный промис, чтобы не ломать логику
};

// Перехватываем создание new Audio()
(function() {
    const _Audio = window.Audio; // Переименовываем в уникальное имя
    window.Audio = function(src) {
        const audio = new _Audio(src);
        audio.muted = true; // Заглушаем звук
        return audio;
    };
})();

// Приостанавливаем все AudioContext
(function() {
    if (window.AudioContext || window.webkitAudioContext) {
        const _AudioContext = window.AudioContext || window.webkitAudioContext; // Переименовываем в уникальное имя
        window.AudioContext = function() {
            const audioContext = new _AudioContext();
            audioContext.suspend(); // Приостанавливаем контекст
            return audioContext;
        };
    }
})();

// Глобальное отключение звука через gainNode
(function() {
    if (window.AudioContext || window.webkitAudioContext) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0; // Устанавливаем громкость на 0
        gainNode.connect(audioContext.destination);
    }
})();

// Переключение звука
function toggleSound() {
    const isMuted = sprite.classList.toggle('clicked');
    localStorage.setItem('mute', isMuted);
    muteAllSounds(isMuted);
}

// Функция отключения всех звуков
function muteAllSounds(mute) {
    // 1️⃣ Глушим стандартные теги <audio> и <video>
    document.querySelectorAll('audio, video').forEach(media => {
        media.muted = mute;
        if (mute) media.pause(); // Останавливаем воспроизведение, если звук отключен
    });

    // 2️⃣ Отключаем Web Audio API
    if (window.AudioContext || window.webkitAudioContext) {
        try {
            window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            if (mute) {
                window.audioCtx.suspend();
            } else {
                window.audioCtx.resume();
            }
        } catch (error) {
            console.warn('Ошибка при управлении Web Audio API:', error);
        }
    }

    // 3️⃣ Останавливаем ВСЕ активные AudioContext (если игра создает новые)
    if (window.AudioContexts) {
        window.AudioContexts.forEach(ctx => {
            if (mute) ctx.suspend();
            else ctx.resume();
        });
    }

    // 4️⃣ Глушим звуки, созданные через new Audio()
    if (window.allAudioElements) {
        window.allAudioElements.forEach(audio => {
            audio.muted = mute;
            if (mute) audio.pause(); // Останавливаем воспроизведение, если звук отключен
        });
    }

    // 5️⃣ Отключаем Howler.js (если используется)
    if (window.Howler) {
        window.Howler.mute(mute);
    }
}

// Инициализация (проверяем состояние)
function init() {
    const isMuted = localStorage.getItem('mute') === 'true';
    if (isMuted) {
        sprite.classList.add('clicked');
        muteAllSounds(false);
    }
}
