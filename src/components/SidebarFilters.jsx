import React, { useState } from 'react';

export default function SidebarFilters({ allData, currentFilters, onFilterChange }) {
    const [showOtherSedes, setShowOtherSedes] = useState(false);
    const [modal, setModal] = useState({ show: false, title: "", message: "" });

    // Listas estáticas
    const staticAreas = [
        "Matemáticas", "Cálculos", "Álgebra Lineal y Geometrías",
        "Estadísticas", "Físicas", "Químicas"
    ];

    const staticAsesores = [
        "Alejandro Martínez Valencia", "Efraín Palacios Mosquera",
        "Faidher Galindo", "Tobias Garcia Mejia",
        "Xiomara Quintero Gómez", "Yohana Ramírez Suárez",
        "Marlon Arcila Vanegas", "Maribel Castrillon Zuluaga"
    ];

    const prioritySedes = ["Robledo", "C4TA", "Virtual"];

    // Obtener todas las sedes dinámicamente de los datos (aunque data puede estar vacía al inicio)
    // Es mejor usar un Set de lo que llegue en allData si queremos que sea dinámico, 
    // pero si allData está vacío al principio, no mostrará nada.
    // Usaremos los priority siempre visibles.
    const uniqueSedes = [...new Set(allData.map(d => d.Sede).filter(Boolean))].sort();
    const otherSedes = uniqueSedes.filter(s => !prioritySedes.includes(s));

    const handleCheckboxChange = (type, value, checked) => {
        const newSet = new Set(currentFilters[type]);
        if (checked) {
            newSet.add(value);
        } else {
            newSet.delete(value);
        }

        const newFilters = { ...currentFilters, [type]: newSet };

        // Verificar si la combinación devuelve resultados
        // Esto es una optimización/feedback visual opcional, 
        // pero podemos delegarlo al Dashboard o hacerlo aquí si tenemos 'allData'.
        // Por simplicidad, solo actualizamos los filtros. El conteo se actualiza en Dashboard.

        onFilterChange(newFilters);
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
                    {staticAreas.map(area => (
                        <label key={area} className="flex items-center space-x-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={currentFilters.Area.has(area)}
                                onChange={(e) => handleCheckboxChange('Area', area, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{area}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sede */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Sede</h3>
                <div className="space-y-2 mb-2">
                    {prioritySedes.map(sede => (
                        <label key={sede} className="flex items-center space-x-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={currentFilters.Sede.has(sede)}
                                onChange={(e) => handleCheckboxChange('Sede', sede, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{sede}</span>
                        </label>
                    ))}
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
                            {otherSedes.length > 0 ? otherSedes.map(sede => (
                                <label key={sede} className="flex items-center space-x-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={currentFilters.Sede.has(sede)}
                                        onChange={(e) => handleCheckboxChange('Sede', sede, e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{sede}</span>
                                </label>
                            )) : <p className="text-xs text-gray-400">Cargando sedes...</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Asesores */}
            <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">Asesores</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {staticAsesores.map(asesor => (
                        <label key={asesor} className="flex items-center space-x-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={currentFilters.Asesor.has(asesor)}
                                onChange={(e) => handleCheckboxChange('Asesor', asesor, e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition"
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">{asesor}</span>
                        </label>
                    ))}
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
