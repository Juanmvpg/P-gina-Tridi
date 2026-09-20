(function() {
    const TIMEOUT_MS = 12 * 60 * 60 * 1000; // 12 horas de inactividad
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
    function updateActivity() {
        const currentTime = Date.now();
        if (currentTime - lastUpdate > 15000) { // Throttle a 15 segundos
            localStorage.setItem('tridi_last_activity', currentTime.toString());
            lastUpdate = currentTime;
        }
    }

    document.addEventListener('mousemove', updateActivity);
    document.addEventListener('keydown', updateActivity);
    document.addEventListener('click', updateActivity);
    document.addEventListener('scroll', updateActivity);

    setInterval(() => {
        const latestActivity = parseInt(localStorage.getItem('tridi_last_activity') || '0', 10);
        if (Date.now() - latestActivity > TIMEOUT_MS) {
            localStorage.removeItem('tridi_session_active');
            localStorage.removeItem('tridi_last_activity');
            window.location.replace('login.html');
        }
    }, 5 * 60 * 1000); // Verificar cada 5 minutos
})();
