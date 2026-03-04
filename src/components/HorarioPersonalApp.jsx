import React, { useState, useMemo } from 'react';
import HorarioTable from './HorarioTable';
import DayTabs from './DayTabs';

export default function HorarioPersonalApp({ initialData }) {
    const [selectedAsesores, setSelectedAsesores] = useState(new Set());
    const [currentDay, setCurrentDay] = useState("");

    const uniqueAsesores = useMemo(() => {
        return [...new Set(initialData.map(item => item.Asesor).filter(Boolean))].sort();
    }, [initialData]);

    const filteredData = useMemo(() => {
        let result = initialData;

        if (selectedAsesores.size > 0) {
            result = result.filter(item => selectedAsesores.has(item.Asesor));
        }

        if (currentDay) {
            result = result.filter(item => item.Día === currentDay);
        }

        return result;
    }, [initialData, selectedAsesores, currentDay]);

    const toggleAsesor = (asesor) => {
        setSelectedAsesores(prev => {
            const next = new Set(prev);
            if (next.has(asesor)) {
                next.delete(asesor);
            } else {
                next.add(asesor);
            }
            return next;
        });
    };

    const clearFilters = () => {
        setSelectedAsesores(new Set());
    };

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Title Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Mi Horario Personal
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Consulta y filtra tu programación académica.
                </p>
            </div>

            {/* Asesor Filter Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Filtrar por Asesores
                    </h3>
                    {selectedAsesores.size > 0 && (
                        <button
                            onClick={clearFilters}
                            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition font-medium"
                            title="Limpiar filtro de asesores"
                        >
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                Limpiar
                            </span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {uniqueAsesores.map(asesor => (
                        <label key={asesor} className="flex items-center space-x-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                value={asesor}
                                checked={selectedAsesores.has(asesor)}
                                onChange={() => toggleAsesor(asesor)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition cursor-pointer"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                                {asesor}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto scrollbar-hide mb-4">
                <DayTabs activeDay={currentDay} onDayChange={setCurrentDay} />
            </div>

            {/* Table */}
            <div className="mt-6 flex-1">
                <HorarioTable data={filteredData} />
            </div>
        </div>
    );
}
