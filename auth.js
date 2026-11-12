/**
 * @fileoverview Gestiona la sesión de usuario y la inactividad en la plataforma Tridi.
 * Comprueba el estado de la sesión, renueva el token de actividad y expulsa al usuario si expira el tiempo de inactividad.
 */
(function() {
    /** @constant {number} TIMEOUT_MS - Tiempo máximo de inactividad permitido en milisegundos (12 horas). */
    const TIMEOUT_MS = 12 * 60 * 60 * 1000; 
    const sessionActive = localStorage.getItem('tridi_session_active') === 'true';
    const lastActivity = localStorage.getItem('tridi_last_activity');
    const now = Date.now();

    if (!sessionActive) {
        window.location.replace('login.html');
        return;
    }

    if (lastActivity && (now - parseInt(lastActivity, 10) > TIMEOUT_MS)) {
        localStorage.removeItem('tridi_session_active');
        localStorage.removeItem('tridi_last_activity');
        window.location.replace('login.html');
        return;
    }

    localStorage.setItem('tridi_last_activity', now.toString());

    let lastUpdate = now;

    /**
     * Actualiza la marca de tiempo de la última actividad del usuario en `localStorage`.
     * Utiliza un throttling de 15 segundos para evitar escrituras excesivas en el disco
     * por eventos rápidos continuos (ej. mover el ratón o hacer scroll).
     * 
     * @function updateActivity
     * @returns {void}
     */
    function updateActivity() {
        const currentTime = Date.now();
        if (currentTime - lastUpdate > 15000) {
            localStorage.setItem('tridi_last_activity', currentTime.toString());
            lastUpdate = currentTime;
        }
    }

    // Monitorear interacción del usuario
    document.addEventListener('mousemove', updateActivity);
    document.addEventListener('keydown', updateActivity);
    document.addEventListener('click', updateActivity);
    document.addEventListener('scroll', updateActivity);

    // Bucle en segundo plano para verificar expiración mientras el usuario no interactúa
    setInterval(() => {
        const latestActivity = parseInt(localStorage.getItem('tridi_last_activity') || '0', 10);
        if (Date.now() - latestActivity > TIMEOUT_MS) {
            localStorage.removeItem('tridi_session_active');
            localStorage.removeItem('tridi_last_activity');
            window.location.replace('login.html');
        }
    }, 5 * 60 * 1000); // Verificación cada 5 minutos
})();
