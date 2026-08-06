document.addEventListener('DOMContentLoaded', () => {
    // === 1. FAQ ACCORDION ===
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

    // === 2. LINKS DE CHECKOUT E ALTERNÂNCIA MENSAL/ÚNICA ===
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
        // Atualiza os links Kiwify dos botões
        valueLinks.forEach(link => {
            const value = link.getAttribute('data-value');
            if (checkoutLinks[type] && checkoutLinks[type][value]) {
                link.setAttribute('href', checkoutLinks[type][value]);
            }
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const selectedType = btn.getAttribute('data-tab');
            updateCheckoutLinks(selectedType);
        });
    });

    // Inicializa os links com a aba ativa (mensal por padrão)
    updateCheckoutLinks('mensal');

    // === 3. ACCORDION DE VALORES MAIORES ===
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

    // === 4. LINKS DE ROLAGEM SUAVE ===
    const scrollBtns = document.querySelectorAll('.scroll-to-btn');
    scrollBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // === 5. ANO ATUAL AUTOMÁTICO NO RODAPÉ ===
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});
