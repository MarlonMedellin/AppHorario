import React, { useState, useEffect } from 'react';
import { fetchMatrizFlexible } from '../services/sheetService';
import HorarioTable from './HorarioTable';
import SidebarFilters from './SidebarFilters';
import DayTabs from './DayTabs';

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState([]);

    // Mapeo de días (0=Domingo, 1=Lunes...)
    const daysMap = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    // Estados iniciales
    const [currentDay, setCurrentDay] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilters, setActiveFilters] = useState({
        Area: new Set(),
        Sede: new Set(),
        Asesor: new Set()
    });
    const [availableOptions, setAvailableOptions] = useState({
        Area: new Set(),
        Sede: new Set(),
        Asesor: new Set()
    });

    // 1. Carga inicial + Deep Linking + Auto-Day
    useEffect(() => {
        async function init() {
            try {
                // Fetch Data
                const fetchedData = await fetchMatrizFlexible();
                setData(fetchedData);
                setFilteredData(fetchedData);

                // Auto-Day
                const todayIndex = new Date().getDay();
                const todayName = daysMap[todayIndex];
                // Si es domingo (0), tal vez mostrar Lunes o dejar vacío. Asumimos mostrar día actual si existe en tabs.
                // Ajuste: si hoy es sábado/domingo y no hay asesoria, igual seteamos el día.
                setCurrentDay(todayName === "Domingo" ? "Lunes" : todayName);

                // Deep Linking
                const params = new URLSearchParams(window.location.search);
                const initialFilters = {
                    Area: new Set(),
                    Sede: new Set(),
                    Asesor: new Set()
                };
                let hasDeepLinks = false;

                if (params.has('asesor')) {
                    const asesorParam = params.get('asesor');
                    // Buscar coincidencia inexacta o exacta?
                    // Por exactitud, asumimos que viene limpio o intentamos calzar.
                    // Iteramos datos para buscar match
                    const match = fetchedData.find(d => d.Asesor.toLowerCase().includes(asesorParam.toLowerCase()));
                    if (match) initialFilters.Asesor.add(match.Asesor);
                    hasDeepLinks = true;
                }
                if (params.has('sede')) {
                    const sedeParam = params.get('sede');
                    // Similar logic or direct add
                    const match = fetchedData.find(d => d.Sede.toLowerCase() === sedeParam.toLowerCase());
                    if (match) initialFilters.Sede.add(match.Sede);
                    hasDeepLinks = true;
                }
                if (params.has('area')) {
                    const areaParam = params.get('area');
                    // Note: Area param might need normalization match
                    const match = fetchedData.find(d => d.Area.toLowerCase() === areaParam.toLowerCase());
                    if (match) initialFilters.Area.add(match.Area);
                    hasDeepLinks = true;
                }

                if (hasDeepLinks) {
                    setActiveFilters(initialFilters);
                    // Si aplicamos deep link, el día tal vez deba resetearse o mantenerse?
                    // Mantenemos Auto-Day salvo que no haya resultados, pero dejemoslo así.
                }

            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    // 2. Lógica de Filtrado y Smart Filters Calculations
    useEffect(() => {
        if (!data.length) return;

        // --- A. Calcular Data Filtrada para la Tabla ---
        const result = data.filter(item => {
            if (currentDay && item.Día !== currentDay) return false;

            if (searchTerm) {
                const searchString = `${item.Día} ${item.Asignatura} ${item.Asesor} ${item.Sede} ${item.Ubicación_Detalle || ''}`.toLowerCase();
                if (!searchString.includes(searchTerm.toLowerCase())) return false;
            }

            // Default Filter: Show ONLY "Asesoría Académica" unless searching
            // Si el usuario busca algo específico, tal vez quiera ver todo?
            // Requerimiento: "el horario principal solo debe mostrar las filas en las cuales tipo=Asesoría Académica"
            // Asumimos que esto aplica siempre en la vista principal.
            if (item.Tipo !== "Asesoría Académica" && item.Tipo !== "Asesoría Academica") return false;

            // Check Filters
            // Area
            if (activeFilters.Area.size > 0) {
                const normalize = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
                const itemAreaNorm = normalize(item.Area);
                let matches = false;
                for (let f of activeFilters.Area) {
                    if (normalize(f) === itemAreaNorm) { matches = true; break; }
                }
                if (!matches) return false;
            }
            // Sede
            if (activeFilters.Sede.size > 0 && !activeFilters.Sede.has(item.Sede)) return false;
            // Asesor
            if (activeFilters.Asesor.size > 0 && !activeFilters.Asesor.has(item.Asesor)) return false;

            return true;
        });

        setFilteredData(result);

        // --- B. Calcular Opciones Disponibles (Smart Filters) ---
        // Para cada grupo de filtros, calculamos qué opciones son válidas BASADO EN LOS OTROS filtros activos.
        // Ejemplo: Si filtro Sede=Robledo, availableAsesores debe ser solo los de Robledo.
        // Pero availableSedes debe seguir mostrando todas (para poder cambiar), o al menos las compatibles con los *otros* filtros (Area/Asesor).

        const calculateAvailable = (excludeType) => {
            return new Set(data.filter(item => {
                // Aplicar todos los filtros EXCEPTO el del tipo actual 'excludeType' y Día/Search
                // (Normalmente los filtros laterales son globales sobre la data, el día es una vista)
                // Decisión: Smart Filters consideran Día? -> Usualmente sí, "Asesores disponibles hoy".
                // Pero si el usuario cambia de día, las opciones cambiarían.
                // Vamos a incluír el filtro de día para que sea "Asesores disponibles ESTE DÍA con ESTA SEDE".

                if (currentDay && item.Día !== currentDay) return false;

                // Aplicar Search? -> Sí, si busco "Math", solo asesores de Math.
                if (searchTerm) {
                    const searchString = `${item.Día} ${item.Asignatura} ${item.Asesor} ${item.Sede} ${item.Ubicación_Detalle || ''}`.toLowerCase();
                    if (!searchString.includes(searchTerm.toLowerCase())) return false;
                }

                if (excludeType !== 'Area' && activeFilters.Area.size > 0) {
                    const normalize = (str) => str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
                    const itemAreaNorm = normalize(item.Area);
                    let matches = false;
                    for (let f of activeFilters.Area) if (normalize(f) === itemAreaNorm) matches = true;
                    if (!matches) return false;
                }

                if (excludeType !== 'Sede' && activeFilters.Sede.size > 0 && !activeFilters.Sede.has(item.Sede)) return false;

                if (excludeType !== 'Asesor' && activeFilters.Asesor.size > 0 && !activeFilters.Asesor.has(item.Asesor)) return false;

                return true;
            }));
        };

        // Extraer valores únicos de los sets filtrados
        const availableSedesData = calculateAvailable('Sede');
        const availableAreasData = calculateAvailable('Area');
        const availableAsesoresData = calculateAvailable('Asesor');

        setAvailableOptions({
            Sede: new Set([...availableSedesData].map(d => d.Sede)),
            Area: new Set([...availableAreasData].map(d => d.Area)),
            Asesor: new Set([...availableAsesoresData].map(d => d.Asesor))
        });

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
                    allData={data} // Pass full data if needed for static lists fallback
                    currentFilters={activeFilters}
                    availableOptions={availableOptions} // NEW: Smart Options
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
