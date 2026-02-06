import React, { useState } from 'react';

export default function SidebarFilters({ allData, currentFilters, availableOptions, onFilterChange }) {
    const [showOtherSedes, setShowOtherSedes] = useState(false);
    const [modal, setModal] = useState({ show: false, title: "", message: "" });

    // 1. Áreas (Dinámicas a partir de la data completa + disponibilidad)
    // Obtenemos TODAS las áreas posibles de la data estática o cruda para mostrar, 
    // pero marcamos como disabled/dimmed las que no están en availableOptions.
    const allAreas = [
        "Matemáticas", "Cálculos", "Álgebra Lineal y Geometrías",
        "Estadísticas", "Físicas", "Químicas"
    ]; // Preferimos mantener este orden "lógico" si es posible.

    // 2. Sedes
    // Prioridad visual
    const prioritySedes = ["Robledo", "C4TA", "Virtual"];
    // Extraer todas de availableOptions o allData
    // Si queremos listar TO_DAS pero deshabilitar inaccesibles:
    const allUniqueSedes = [...new Set(allData.map(d => d.Sede).filter(Boolean))].sort();
    const otherSedes = allUniqueSedes.filter(s => !prioritySedes.includes(s));

    // 3. Asesores (Totalmente dinámico basado en disponibilidad)
    // Mostramos solo los disponibles para no saturar, u obtenemos todos y ordenamos?
    // Petición: "Smart Filters... las listas... se reduzcan".
    // Entonces mostramos solo `availableOptions.Asesor`.
    const availableAsesoresList = [...availableOptions.Asesor].sort();


    const handleCheckboxChange = (type, value, checked) => {
        const newSet = new Set(currentFilters[type]);
        if (checked) {
            newSet.add(value);
        } else {
            newSet.delete(value);
        }
        onFilterChange({ ...currentFilters, [type]: newSet });
    };

    const clearFilters = () => {
        onFilterChange({
            Area: new Set(),
            Sede: new Set(),
            Asesor: new Set()
        });
    };

    const hasFilters =
        currentFilters.Area.size > 0 ||
        currentFilters.Sede.size > 0 ||
        currentFilters.Asesor.size > 0;

    return (
        <div className="bg-white dark:bg-slate-800 h-full p-6 overflow-y-auto relative">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Filtros</h2>
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition font-medium flex items-center gap-1"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        Limpiar
                    </button>
                )}
            </div>

            {/* Áreas */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Áreas</h3>
                <div className="space-y-2">
                    {allAreas.map(area => {
                        const isAvailable = availableOptions.Area.has(area);
                        const isChecked = currentFilters.Area.has(area);

                        return (
                            <label key={area} className={`flex items-center space-x-2 cursor-pointer group ${!isAvailable && !isChecked ? 'opacity-50' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    disabled={!isAvailable && !isChecked}
                                    onChange={(e) => handleCheckboxChange('Area', area, e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                    {area} {!isAvailable && !isChecked && '(0)'}
                                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Sede */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Sede</h3>
                <div className="space-y-2 mb-2">
                    {prioritySedes.map(sede => {
                        const isAvailable = availableOptions.Sede.has(sede);
                        const isChecked = currentFilters.Sede.has(sede);
                        return (
                            <label key={sede} className={`flex items-center space-x-2 cursor-pointer group ${!isAvailable && !isChecked ? 'opacity-50' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    disabled={!isAvailable && !isChecked}
                                    onChange={(e) => handleCheckboxChange('Sede', sede, e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{sede}</span>
                            </label>
                        );
                    })}
                </div>

                {/* Other Sedes Collapsible */}
                <div className="mt-2 text-sm">
                    <button
                        onClick={() => setShowOtherSedes(!showOtherSedes)}
                        className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-1 flex items-center gap-1"
                    >
                        {showOtherSedes ? 'Ver menos' : 'Otras sedes'}
                        <svg className={`w-3 h-3 transition-transform ${showOtherSedes ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {showOtherSedes && (
                        <div className="space-y-2 mt-2 pl-2 border-l-2 border-slate-100 dark:border-slate-700">
                            {otherSedes.length > 0 ? otherSedes.map(sede => {
                                const isAvailable = availableOptions.Sede.has(sede);
                                const isChecked = currentFilters.Sede.has(sede);
                                return (
                                    (
                                        <label key={sede} className={`flex items-center space-x-2 cursor-pointer group ${!isAvailable && !isChecked ? 'opacity-50' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                disabled={!isAvailable && !isChecked}
                                                onChange={(e) => handleCheckboxChange('Sede', sede, e.target.checked)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{sede}</span>
                                        </label>
                                    )
                                )
                            }) : <p className="text-xs text-gray-400">Cargando sedes...</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Asesores */}
            <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Asesores</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableAsesoresList.length > 0 ? availableAsesoresList.map(asesor => (
                        <label key={asesor} className="flex items-center space-x-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={currentFilters.Asesor.has(asesor)}
                                onChange={(e) => handleCheckboxChange('Asesor', asesor, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{asesor}</span>
                        </label>
                    )) : (
                        <p className="text-xs text-slate-500 italic">No hay asesores disponibles con los filtros actuales.</p>
                    )}
                </div>
            </div>

            {/* Feedback Modal */}
            {modal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl max-w-sm mx-4 text-center">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{modal.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">{modal.message}</p>
                        <button
                            onClick={() => setModal({ ...modal, show: false })}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
