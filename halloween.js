/**
 * @fileoverview Capa visual temática de Halloween para Tridimensionando Ideas.
 * Totalmente desacoplada de la lógica de negocio: solo añade estilos, decoraciones SVG
 * (telarañas, araña animada, partículas flotantes) y un selector de ambiente sin alterar
 * ningún ID, evento o funcionalidad existente.
 */
(function () {
    function initHalloweenTheme() {
        if (document.getElementById('tridi-halloween-styles')) return;

        // Estado del modo noche de brujas (por defecto activado en modo Halloween cálido, con opción a Noche Oscura)
        let darkSpooky = localStorage.getItem('tridi_halloween_dark') === 'true';

        const style = document.createElement('style');
        style.id = 'tridi-halloween-styles';
        style.textContent = `
            /* === ANIMACIONES HALLOWEEN === */
            @keyframes hw-float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-12px) rotate(6deg); }
            }
            @keyframes hw-spider-drop {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(18px); }
            }
            @keyframes hw-pulse-glow {
                0%, 100% { filter: drop-shadow(0 0 6px rgba(252, 76, 0, 0.55)); transform: scale(1); }
                50% { filter: drop-shadow(0 0 12px rgba(147, 51, 234, 0.75)); transform: scale(1.08); }
            }
            @keyframes hw-border-flow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes hw-bat-fly {
                0% { transform: translateX(-10vw) translateY(0px) scale(0.8); opacity: 0; }
                10% { opacity: 0.22; }
                50% { transform: translateX(50vw) translateY(-25px) scale(1); opacity: 0.22; }
                90% { opacity: 0.22; }
                100% { transform: translateX(110vw) translateY(10px) scale(0.85); opacity: 0; }
            }

            /* === FONDO Y AMBIENTE PRINCIPAL === */
            body.hw-active {
                background-color: #fdf6ec !important;
                background-image:
                    radial-gradient(circle at 8% 12%, rgba(252, 76, 0, 0.10), transparent 38%),
                    radial-gradient(circle at 92% 18%, rgba(147, 51, 234, 0.10), transparent 38%),
                    radial-gradient(circle at 85% 88%, rgba(252, 76, 0, 0.08), transparent 42%),
                    linear-gradient(to right, rgba(252, 76, 0, 0.07) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(147, 51, 234, 0.06) 1px, transparent 1px) !important;
                background-size: 100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px !important;
                background-attachment: fixed !important;
                transition: background-color 0.35s ease, color 0.35s ease;
            }

            /* === MODO NOCHE DE BRUJAS (OSCURO OPCIONAL) === */
            body.hw-active.hw-dark {
                background-color: #0f0b1a !important;
                color: #f3e8ff !important;
                background-image:
                    radial-gradient(circle at 12% 15%, rgba(252, 76, 0, 0.16), transparent 40%),
                    radial-gradient(circle at 88% 20%, rgba(147, 51, 234, 0.20), transparent 42%),
                    radial-gradient(circle at 50% 90%, rgba(252, 76, 0, 0.12), transparent 45%),
                    linear-gradient(to right, rgba(147, 51, 234, 0.10) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(252, 76, 0, 0.08) 1px, transparent 1px) !important;
                --bg: #0f0b1a;
                --surface: #1a1429;
                --surface-alt: #241c38;
                --border: #3b2d54;
                --text: #f8fafc;
                --text-secondary: #cbd5e1;
            }
            body.hw-active.hw-dark header,
            body.hw-active.hw-dark footer,
            body.hw-active.hw-dark nav.fixed {
                background-color: rgba(22, 16, 36, 0.94) !important;
                border-color: rgba(147, 51, 234, 0.3) !important;
                backdrop-filter: blur(10px);
            }
            body.hw-active.hw-dark .bg-white,
            body.hw-active.hw-dark .bg-surface-container-lowest,
            body.hw-active.hw-dark .bg-surface-container-low,
            body.hw-active.hw-dark .bg-surface-container {
                background-color: #1b142b !important;
                border-color: rgba(147, 51, 234, 0.28) !important;
                color: #f8fafc !important;
            }
            body.hw-active.hw-dark h1,
            body.hw-active.hw-dark h2,
            body.hw-active.hw-dark h3,
            body.hw-active.hw-dark .text-gray-900,
            body.hw-active.hw-dark .text-gray-800,
            body.hw-active.hw-dark .text-gray-700 {
                color: #fdf4ff !important;
            }
            body.hw-active.hw-dark p,
            body.hw-active.hw-dark .text-gray-600,
            body.hw-active.hw-dark .text-gray-500 {
                color: #cbd5e1 !important;
            }
            body.hw-active.hw-dark input {
                background-color: #120d1f !important;
                border-color: #4c376b !important;
                color: #ffffff !important;
            }
            body.hw-active.hw-dark tr:hover {
                background-color: rgba(147, 51, 234, 0.12) !important;
            }

            /* === BARRA SUPERIOR FESTIVA === */
            header {
                position: sticky;
                top: 0;
                border-top: 3px solid transparent !important;
                border-image: linear-gradient(90deg, #fc4c00, #9333ea, #f59e0b, #fc4c00) 1 !important;
                box-shadow: 0 4px 20px -4px rgba(252, 76, 0, 0.12) !important;
            }

            /* === RESPLANDOR EN TARJETAS Y BOTONES === */
            body.hw-active main .bg-white:hover,
            body.hw-active main a.bg-white:hover {
                border-color: rgba(252, 76, 0, 0.45) !important;
                box-shadow: 0 10px 25px -5px rgba(252, 76, 0, 0.18), 0 4px 10px -4px rgba(147, 51, 234, 0.15) !important;
            }

            /* === BADGE HALLOWEEN EN EL LOGO === */
            .hw-logo-pumpkin {
                display: inline-block;
                margin-right: 6px;
                animation: hw-pulse-glow 3s ease-in-out infinite;
                font-style: normal;
            }
            .hw-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                margin-left: 10px;
                padding: 2px 9px;
                font-size: 11px;
                font-weight: 700;
                font-family: 'Inter', sans-serif;
                border-radius: 9999px;
                background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 55%, #fc4c00 100%);
                color: #fff7ed;
                letter-spacing: 0.02em;
                box-shadow: 0 2px 8px rgba(147, 51, 234, 0.35);
                vertical-align: middle;
            }
            @media (max-width: 640px) {
                .hw-badge { display: none; }
            }

            /* === TELARAÑAS EN LAS ESQUINAS === */
            .hw-cobweb {
                position: fixed;
                pointer-events: none;
                z-index: 40;
                opacity: 0.22;
                transition: opacity 0.3s ease;
            }
            body.hw-dark .hw-cobweb {
                opacity: 0.38;
            }
            .hw-cobweb-tl {
                top: 0;
                left: 0;
                width: 150px;
                height: 150px;
            }
            .hw-cobweb-tr {
                top: 0;
                right: 0;
                width: 150px;
                height: 150px;
                transform: scaleX(-1);
            }

            /* === ARAÑITA COLGANTE === */
            .hw-spider-wrap {
                position: fixed;
                top: 0;
                right: 42px;
                z-index: 45;
                pointer-events: none;
                display: flex;
                flex-direction: column;
                align-items: center;
                animation: hw-spider-drop 5s ease-in-out infinite;
            }
            .hw-spider-thread {
                width: 1.5px;
                height: 68px;
                background: linear-gradient(to bottom, rgba(147, 51, 234, 0.45), rgba(252, 76, 0, 0.6));
            }
            .hw-spider-icon {
                font-size: 20px;
                line-height: 1;
                margin-top: -4px;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
            }

            /* === PARTÍCULAS AMBIENTALES FLOTANTES === */
            .hw-particles {
                position: fixed;
                inset: 0;
                pointer-events: none;
                z-index: 1;
                overflow: hidden;
            }
            .hw-particle {
                position: absolute;
                font-size: 22px;
                opacity: 0.14;
                user-select: none;
                animation: hw-float 6s ease-in-out infinite;
            }
            body.hw-dark .hw-particle {
                opacity: 0.24;
            }
            .hw-bat-runner {
                position: fixed;
                top: 18%;
                left: -10vw;
                font-size: 20px;
                pointer-events: none;
                z-index: 2;
                animation: hw-bat-fly 24s linear infinite;
            }

            /* === BOTÓN CONMUTADOR MODO NOCHE DE BRUJAS === */
            .hw-toggle-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 60;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 14px;
                border-radius: 9999px;
                font-family: 'Sora', sans-serif;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                border: 1.5px solid rgba(252, 76, 0, 0.45);
                background: linear-gradient(135deg, #1e1b4b, #3b0764);
                color: #ffedd5;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25), 0 0 12px rgba(252, 76, 0, 0.25);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .hw-toggle-btn:hover {
                transform: translateY(-2px) scale(1.03);
                box-shadow: 0 8px 22px rgba(147, 51, 234, 0.4), 0 0 16px rgba(252, 76, 0, 0.4);
            }
            @media (max-width: 768px) {
                .hw-toggle-btn {
                    bottom: 92px;
                    right: 14px;
                    padding: 6px 12px;
                    font-size: 11px;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.classList.add('hw-active');
        if (darkSpooky) {
            document.body.classList.add('hw-dark');
        }

        // 1. Decorar el logo en el Header si existe
        const headerLogo = document.querySelector('header a[href="index.html"]');
        if (headerLogo && !headerLogo.querySelector('.hw-logo-pumpkin')) {
            const pumpkin = document.createElement('span');
            pumpkin.className = 'hw-logo-pumpkin';
            pumpkin.textContent = '🎃';
            headerLogo.prepend(pumpkin);

            const badge = document.createElement('span');
            badge.className = 'hw-badge';
            badge.innerHTML = '🕸️ Halloween';
            headerLogo.appendChild(badge);
        }

        // 2. Si estamos en login.html, decorar la tarjeta de acceso sin tocar la lógica
        const loginLockIcon = document.querySelector('#btn-login') ? document.querySelector('.material-symbols-outlined.text-4xl') : null;
        if (loginLockIcon && loginLockIcon.textContent.trim() === 'lock') {
            loginLockIcon.parentElement.style.background = 'linear-gradient(135deg, rgba(252,76,0,0.15), rgba(147,51,234,0.18))';
            loginLockIcon.parentElement.style.boxShadow = '0 0 20px rgba(252, 76, 0, 0.25)';
            const h2 = document.querySelector('h2');
            if (h2 && !h2.dataset.hwDecorated) {
                h2.dataset.hwDecorated = 'true';
                h2.innerHTML = '🎃 ' + h2.innerHTML + ' 🕸️';
            }
        }

        // 3. Inyectar Telarañas SVG en las esquinas superiores y la araña colgante
        const cobwebSvg = `
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <g stroke="#fc4c00" stroke-width="1.5">
                    <line x1="0" y1="0" x2="200" y2="25"/>
                    <line x1="0" y1="0" x2="185" y2="85"/>
                    <line x1="0" y1="0" x2="145" y2="145"/>
                    <line x1="0" y1="0" x2="85" y2="185"/>
                    <line x1="0" y1="0" x2="25" y2="200"/>
                    <path d="M 40 5 Q 35 20 37 37 Q 20 35 5 40" stroke="#9333ea"/>
                    <path d="M 80 10 Q 68 38 74 74 Q 38 68 10 80" stroke="#fc4c00"/>
                    <path d="M 125 16 Q 105 58 112 112 Q 58 105 16 125" stroke="#9333ea"/>
                    <path d="M 170 22 Q 142 78 145 145 Q 78 142 22 170" stroke="#fc4c00"/>
                </g>
            </svg>
        `;

        const webLeft = document.createElement('div');
        webLeft.className = 'hw-cobweb hw-cobweb-tl';
        webLeft.innerHTML = cobwebSvg;

        const webRight = document.createElement('div');
        webRight.className = 'hw-cobweb hw-cobweb-tr';
        webRight.innerHTML = cobwebSvg;

        const spider = document.createElement('div');
        spider.className = 'hw-spider-wrap';
        spider.innerHTML = `
            <div class="hw-spider-thread"></div>
            <div class="hw-spider-icon" title="¡Feliz Halloween!">🕷️</div>
        `;

        // 4. Partículas ambientales sutiles
        const particles = document.createElement('div');
        particles.className = 'hw-particles';
        particles.innerHTML = `
            <span class="hw-particle" style="top: 16%; left: 5%; animation-delay: 0s;">🎃</span>
            <span class="hw-particle" style="top: 32%; right: 6%; animation-delay: 1.5s;">🦇</span>
            <span class="hw-particle" style="top: 68%; left: 4%; animation-delay: 2.8s;">👻</span>
            <span class="hw-particle" style="top: 78%; right: 7%; animation-delay: 0.9s;">🍬</span>
            <span class="hw-particle" style="top: 48%; left: 8%; animation-delay: 3.6s; font-size: 18px;">🕸️</span>
            <div class="hw-bat-runner">🦇</div>
        `;

        // 5. Botón flotante para alternar entre Modo Halloween Claro y Modo Noche de Brujas (Oscuro)
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'hw-toggle-btn';
        function updateToggleText() {
            toggleBtn.innerHTML = darkSpooky
                ? '<span>🌕</span><span>Modo Calabaza (Claro)</span>'
                : '<span>🌙</span><span>Modo Noche de Brujas</span>';
        }
        updateToggleText();

        toggleBtn.addEventListener('click', () => {
            darkSpooky = !darkSpooky;
            localStorage.setItem('tridi_halloween_dark', darkSpooky ? 'true' : 'false');
            document.body.classList.toggle('hw-dark', darkSpooky);
            updateToggleText();
        });

        document.body.appendChild(webLeft);
        document.body.appendChild(webRight);
        document.body.appendChild(spider);
        document.body.appendChild(particles);
        document.body.appendChild(toggleBtn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHalloweenTheme);
    } else {
        initHalloweenTheme();
    }
})();
