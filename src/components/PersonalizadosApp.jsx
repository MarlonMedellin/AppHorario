import React, { useState, useMemo } from 'react';
import HorarioTable from './HorarioTable';
import DayTabs from './DayTabs';

export default function PersonalizadosApp({ initialData }) {
    const [currentDay, setCurrentDay] = useState("");

    const filteredData = useMemo(() => {
        let result = initialData;
        if (currentDay) {
            result = result.filter(item => item.Día === currentDay);
        }
        return result;
    }, [initialData, currentDay]);

    return (
        <div className="relative min-h-screen flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Asesorías Personalizadas
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Vista de todas las asesorías personalizadas
                </p>
            </div>

            <div className="overflow-x-auto scrollbar-hide mb-4">
                <DayTabs activeDay={currentDay} onDayChange={setCurrentDay} />
            </div>

            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Mostrando <span className="font-bold text-blue-600">{filteredData.length}</span> asesorías personalizadas para {currentDay || "todos los días"}
            </div>

            <div className="flex-1">
                <HorarioTable data={filteredData} />
            </div>
        </div>
    );
}
