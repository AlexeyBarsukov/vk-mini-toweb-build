// Восстанавливаем оригинальный метод play для HTMLMediaElement
if (HTMLMediaElement.prototype.playOriginal) {
    HTMLMediaElement.prototype.play = HTMLMediaElement.prototype.playOriginal;
}

// Восстанавливаем оригинальный конструктор Audio
if (window._Audio) {
    window.Audio = window._Audio;
}

// Восстанавливаем оригинальный AudioContext
if (window._AudioContext) {
    window.AudioContext = window._AudioContext;
}

// Включаем звук для всех элементов
function enableAllSounds() {
    // 1️⃣ Включаем звук для стандартных тегов <audio> и <video>
    document.querySelectorAll('audio, video').forEach(media => {
        media.muted = false;
        media.play(); // Возобновляем воспроизведение
    });

    // 2️⃣ Включаем Web Audio API
    if (window.AudioContext || window.webkitAudioContext) {
        try {
            window.audioCtx = window.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
            window.audioCtx.resume();
        } catch (error) {
            console.warn('Ошибка при управлении Web Audio API:', error);
        }
    }

    // 3️⃣ Включаем все активные AudioContext
    if (window.AudioContexts) {
        window.AudioContexts.forEach(ctx => {
            ctx.resume();
        });
    }

    // 4️⃣ Включаем звук для элементов, созданных через new Audio()
    if (window.allAudioElements) {
        window.allAudioElements.forEach(audio => {
            audio.muted = false;
            audio.play(); // Возобновляем воспроизведение
        });
    }

    // 5️⃣ Включаем Howler.js (если используется)
    if (window.Howler) {
        window.Howler.mute(false);
    }
}

// Инициализация (включаем звук)
function init() {
    localStorage.setItem('mute', 'false'); // Устанавливаем состояние звука в "включен"
    enableAllSounds();
}

// Запускаем инициализацию
init();