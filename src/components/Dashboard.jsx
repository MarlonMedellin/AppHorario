import React, { useState, useEffect } from 'react';
import { fetchMatrizFlexible } from '../services/sheetService';
import HorarioTable from './HorarioTable';
import SidebarFilters from './SidebarFilters';
import DayTabs from './DayTabs';

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);

    // Filtros de estado
    const [currentDay, setCurrentDay] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilters, setActiveFilters] = useState({
        Area: new Set(),
        Sede: new Set(),
        Asesor: new Set()
    });

    // Carga de datos inicial
    useEffect(() => {
        async function loadData() {
            try {
                const fetchedData = await fetchMatrizFlexible();
                setData(fetchedData);
                setFilteredData(fetchedData);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Lógica de filtrado centralizada
    useEffect(() => {
        if (!data.length) return;

        let result = data.filter(item => {
            // 1. Filtro por Día (Tab)
            if (currentDay && item.Día !== currentDay) return false;

            // 2. Filtro por Búsqueda
            if (searchTerm) {
                const searchString = `${item.Día} ${item.Asignatura} ${item.Asesor} ${item.Sede} ${item.Ubicación_Detalle || ''}`.toLowerCase();
                if (!searchString.includes(searchTerm.toLowerCase())) return false;
            }

            // 3. Filtros del Sidebar (Area, Sede, Asesor)
            // Area (Normalizado)
            if (activeFilters.Area.size > 0) {
                const normalize = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
                const itemAreaNorm = normalize(item.Area);
                let matchesArea = false;
                for (let filterVal of activeFilters.Area) {
                    if (normalize(filterVal) === itemAreaNorm) {
                        matchesArea = true;
                        break;
                    }
                }
                if (!matchesArea) return false;
            }

            // Sede
            if (activeFilters.Sede.size > 0 && !activeFilters.Sede.has(item.Sede)) return false;

            // Asesor
            if (activeFilters.Asesor.size > 0 && !activeFilters.Asesor.has(item.Asesor)) return false;

            return true;
        });

        setFilteredData(result);
    }, [data, currentDay, searchTerm, activeFilters]);

    const handleFilterChange = (newFilters) => {
        setActiveFilters(newFilters);
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-slate-500 font-medium">Cargando agenda...</span>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-72 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg hidden md:block">
                <SidebarFilters
                    allData={data}
                    currentFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                />
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por asesor, asignatura, sede..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <DayTabs activeDay={currentDay} onDayChange={setCurrentDay} />

                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    Mostrando <span className="font-bold text-blue-600 dark:text-blue-400">{filteredData.length}</span> registros
                </div>

                <HorarioTable data={filteredData} />
            </main>
        </div>
    );
}
