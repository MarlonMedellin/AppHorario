// Authentication Service
// Manages user authentication and session

const SESSION_KEY = 'horarios_session';

/**
 * Validate user email against CONFIG data
 * @param {string} email - User email to validate
 * @param {Array} configUsers - Array of user objects from CONFIG sheet
 * @returns {Object|null} User object if found, null otherwise
 */
export function validateUser(email, configUsers) {
    if (!email || !configUsers) return null;

    const normalizedEmail = email.toLowerCase().trim();
    return configUsers.find(user =>
        user.Correo && user.Correo.toLowerCase().trim() === normalizedEmail
    ) || null;
}

/**
 * Log in user and store session in localStorage
 * @param {Object} user - User object from CONFIG
 */
export function login(user) {
    const session = {
        user: {
            nombre: user.Asesores,
            correo: user.Correo,
            rol: user.Rol,
            whatsapp: user.WhatsApp,
            foto: user.Link_Foto
        },
        loginTime: Date.now()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Log out user and clear session
 */
export function logout() {
    localStorage.removeItem(SESSION_KEY);
    // Emit event for UI updates
    window.dispatchEvent(new CustomEvent('auth-changed'));
}

/**
 * Get current logged-in user
 * @returns {Object|null} User object if logged in, null otherwise
 */
export function getCurrentUser() {
    try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (!sessionData) return null;

        const session = JSON.parse(sessionData);
        return session.user || null;
    } catch (error) {
        console.error('Error reading session:', error);
        return null;
    }
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
    return getCurrentUser() !== null;
}

/**
 * Check if user has specific role
 * @param {string} role - Role to check (Asesor, Psicoeducador, Ambos)
 * @returns {boolean}
 */
export function hasRole(role) {
    const user = getCurrentUser();
    if (!user) return false;

    // "Ambos" has access to everything
    if (user.rol === 'Ambos') return true;

    return user.rol === role;
}

/**
 * Check if user can access personalizados page
 * @returns {boolean}
 */
export function canAccessPersonalizados() {
    const user = getCurrentUser();
    if (!user) return false;

    return user.rol === 'Psicoeducador' || user.rol === 'Ambos';
}
