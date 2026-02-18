/**
 * Determine if a time slot is currently active based on browser time.
 * @param {string} horaInicio - Start time in 24h format (e.g. "7:00", "14:00")
 * @param {string} horaFin - End time in 24h format (e.g. "8:00", "16:00")
 * @returns {boolean} True if current time falls within [horaInicio, horaFin)
 */
export function isTimeSlotActive(horaInicio, horaFin) {
    if (!horaInicio || !horaFin) return false;
    const now = new Date();
    const [hI, mI = 0] = horaInicio.split(":").map(Number);
    const [hF, mF = 0] = horaFin.split(":").map(Number);
    if (isNaN(hI) || isNaN(hF)) return false;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = hI * 60 + mI;
    const endMinutes = hF * 60 + mF;
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

/**
 * Check if a given day name matches today's day (Spanish).
 * @param {string} dayName - Spanish day name (e.g. "Lunes", "Martes")
 * @returns {boolean}
 */
export function isTodayName(dayName) {
    if (!dayName) return false;
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return days[new Date().getDay()] === dayName;
}
