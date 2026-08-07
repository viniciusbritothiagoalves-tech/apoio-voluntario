// Carrega a API do IFrame do YouTube de forma assíncrona
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let progressInterval;
const UNLOCK_TIME_SECONDS = 170; // 2 minutos e 50 segundos

// Inicialização do Player do YouTube (Função global requerida pela API)
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('youtube-player', {
        videoId: 'y-320qq746o',
        playerVars: {
            'controls': 0,
            'modestbranding': 1,
            'rel': 0,
            'fs': 0,
            'iv_load_policy': 3,
            'disablekb': 1,
            'origin': window.location.origin
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    const playBtnControl = document.getElementById('btn-play-control');
    const playBtnOverlay = document.getElementById('btn-play-overlay');
    const playBtnThumbnail = document.getElementById('btn-play-thumbnail');
    const videoBlocker = document.getElementById('video-blocker');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    function togglePlay() {
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }

    // Toggle ao clicar na área do vídeo (click blocker)
    if (videoBlocker) {
        videoBlocker.addEventListener('click', togglePlay);
    }

    // Toggle nos botões de controle
    if (playBtnControl) {
        playBtnControl.addEventListener('click', togglePlay);
    }

    if (playBtnOverlay) {
        playBtnOverlay.addEventListener('click', () => {
            player.playVideo();
        });
    }

    if (playBtnThumbnail) {
        playBtnThumbnail.addEventListener('click', () => {
            player.playVideo();
        });
    }

    // Inicia o observador de Autoplay por rolagem de tela
    startAutoplayObserver();
}

function onPlayerStateChange(event) {
    const pauseMsg = document.getElementById('video-pause-msg');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    const lockedContent = document.getElementById('locked-content');

    if (event.data === YT.PlayerState.PLAYING) {
        // Oculta a mensagem de pausa
        if (pauseMsg) pauseMsg.classList.remove('show');
        
        // Oculta a thumbnail customizada ao começar a reproduzir
        const thumbnail = document.getElementById('video-thumbnail');
        if (thumbnail) {
            thumbnail.classList.add('hide');
        }
        
        // Altera o ícone para "pause" nos controles customizados
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconPause) iconPause.style.display = 'block';

        // Monitora o tempo assistido
        clearInterval(progressInterval);
        progressInterval = setInterval(() => {
            if (player && typeof player.getCurrentTime === 'function') {
                const currentTime = player.getCurrentTime();
                if (currentTime >= UNLOCK_TIME_SECONDS) {
                    clearInterval(progressInterval);
                    unlockContent();
                }
            }
        }, 1000);

    } else if (event.data === YT.PlayerState.PAUSED) {
        // Exibe a mensagem acolhedora de pausa
        if (pauseMsg) pauseMsg.classList.add('show');
        
        // Altera o ícone para "play" nos controles customizados
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconPause) iconPause.style.display = 'none';
        
        clearInterval(progressInterval);

    } else if (event.data === YT.PlayerState.ENDED) {
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconPause) iconPause.style.display = 'none';
        clearInterval(progressInterval);
    }
}

function unlockContent() {
    const lockedContent = document.getElementById('locked-content');
    if (lockedContent) {
        // Salva a flag na memória local para evitar pedir para assistir de novo na próxima visita
        localStorage.setItem('apoio_video_assistido', 'true');
        
        // Exibe a seção de checkout e FAQ
        lockedContent.style.display = 'block';
        
        // Scroll suave sutil até a seção de checkout para guiar o olhar
        const checkoutSection = document.getElementById('apoiar');
        if (checkoutSection) {
            checkoutSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

let hasAutoplayed = false;
const observerOptions = {
    root: null,
    threshold: 0.5 // Aciona quando 50% do player estiver visível na tela
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAutoplayed && player && typeof player.playVideo === 'function') {
            player.playVideo();
            hasAutoplayed = true;
            observer.disconnect(); // Desconecta para tocar apenas uma vez por visita
        }
    });
}, observerOptions);

function startAutoplayObserver() {
    const playerContainer = document.querySelector('.video-player-outer');
    if (playerContainer) {
        observer.observe(playerContainer);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // === VERIFICAÇÃO INICIAL DE MEMÓRIA (FLAG DE VÍDEO ASSISTIDO) ===
    const lockedContent = document.getElementById('locked-content');
    const isAlreadyWatched = localStorage.getItem('apoio_video_assistido') === 'true';
    
    if (isAlreadyWatched && lockedContent) {
        lockedContent.style.display = 'block';
    }

    // === FAQ ACCORDION ===
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    
    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.faq-item');
            const content = item.querySelector('.faq-content');
            const isActive = item.classList.contains('active');
            
            // Fecha outros FAQs abertos
            document.querySelectorAll('.faq-item.active').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('active');
                    openItem.querySelector('.faq-content').style.maxHeight = null;
                }
            });
            
            // Alterna o FAQ clicado
            if (isActive) {
                item.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // === LINKS DE CHECKOUT E ALTERNÂNCIA MENSAL/ÚNICA ===
    const tabBtns = document.querySelectorAll('.tab-btn');
    const valueLinks = document.querySelectorAll('.value-btn');
    
    const checkoutLinks = {
        mensal: {
            '10': 'https://pay.kiwify.com.br/iIyhkIR',
            '15': 'https://pay.kiwify.com.br/raRLFdO',
            '20': 'https://pay.kiwify.com.br/KBu9d8j',
            '25': 'https://pay.kiwify.com.br/0GA3vYX',
            '50': 'https://pay.kiwify.com.br/FV9NlOh',
            '100': 'https://pay.kiwify.com.br/5NCQXdZ',
            '150': 'https://pay.kiwify.com.br/B4ygOjr',
            '200': 'https://pay.kiwify.com.br/NAzO8tO'
        },
        unica: {
            '10': 'https://pay.kiwify.com.br/1dTgTv5',
            '15': 'https://pay.kiwify.com.br/ocKh8Uq',
            '20': 'https://pay.kiwify.com.br/xYB0hBF',
            '25': 'https://pay.kiwify.com.br/KdyO5lF',
            '50': 'https://pay.kiwify.com.br/CateQr5',
            '100': 'https://pay.kiwify.com.br/LGoTzhx',
            '150': 'https://pay.kiwify.com.br/lGt6jeu',
            '200': 'https://pay.kiwify.com.br/5BelBuR'
        }
    };

    function updateCheckoutLinks(type) {
        valueLinks.forEach(link => {
            const value = link.getAttribute('data-value');
            if (checkoutLinks[type] && checkoutLinks[type][value]) {
                link.setAttribute('href', checkoutLinks[type][value]);
            }
        });
    }

    const frequencyWarning = document.getElementById('frequency-warning');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.classList.remove('pulse-highlight');
            });
            btn.classList.add('active');
            
            if (frequencyWarning) {
                frequencyWarning.style.display = 'none';
            }
            
            const selectedType = btn.getAttribute('data-tab');
            updateCheckoutLinks(selectedType);
        });
    });

    // Monitora o clique nos valores para garantir seleção prévia
    valueLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const hasSelection = document.querySelector('.tab-btn.active');
            if (!hasSelection) {
                e.preventDefault();
                
                if (frequencyWarning) {
                    frequencyWarning.style.display = 'flex';
                    frequencyWarning.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Ativa a animação de piscar nos botões de alternância
                tabBtns.forEach(b => b.classList.add('pulse-highlight'));
            }
        });
    });

    // === ACCORDION DE VALORES MAIORES ===
    const toggleLargerBtn = document.getElementById('toggle-larger-values');
    const largerValuesPanel = document.getElementById('larger-values-panel');

    toggleLargerBtn.addEventListener('click', () => {
        const isOpen = largerValuesPanel.classList.contains('open');
        
        if (isOpen) {
            largerValuesPanel.classList.remove('open');
            toggleLargerBtn.classList.remove('active');
            largerValuesPanel.style.maxHeight = null;
        } else {
            largerValuesPanel.classList.add('open');
            toggleLargerBtn.classList.add('active');
            largerValuesPanel.style.maxHeight = largerValuesPanel.scrollHeight + 'px';
        }
    });

    // === LINKS DE ROLAGEM SUAVE ===
    const scrollBtns = document.querySelectorAll('.scroll-to-btn');
    scrollBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // === ANO ATUAL AUTOMÁTICO NO RODAPÉ ===
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});
