import React, { useState, useEffect } from "react";
import { isTimeSlotActive, isTodayName } from "../utils/timeUtils";

const areaColorMap = {
    "Matemáticas": "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    "Cálculos": "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    "Calculos": "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    "Álgebra Lineal y Geometrías": "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
    "Físicas": "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    "Fisicas": "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    "Estadísticas": "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    "Estadisticas": "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    "Químicas": "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    "Quimicas": "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
};

// Links for virtual modalities
const modalidadLinks = {
    "Virtual (Meet)": "https://meet.google.com/test-meet-link",
    "Virtual (Teams)": "https://teams.microsoft.com/test-teams-link",
    "Virtual (Whatsapp)": "https://wa.me/p/9161411507267624/573013333758",
    "Híbrido": "https://meet.google.com/test-hibrido-link",
};

const Icons = {
    Calculator: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
    ),
    Infinity: () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2C8.2 7.18 6.84 6.62 5.4 6.62 2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12c1.02 1.01 2.37 1.57 3.82 1.57 2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37z"></path></svg>
    ),
    Ruler: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>
    ),
    Sigma: () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 20H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1zM18 6H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1zm-7 6l-4.5 4.5c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.83l4.09 4.08c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13 12l4.5-4.5c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L12 10.17 7.91 6.09c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L11 12z"></path></svg>
    ),
    Magnet: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
    ),
    Flask: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
    ),
    Location: () => (
        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
    User: () => (
        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    ),
    ExternalLink: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
    )
};

const getAreaIcon = (area) => {
    switch (area) {
        case "Matemáticas": return <Icons.Calculator />;
        case "Cálculos": case "Calculos": return <Icons.Infinity />;
        case "Álgebra Lineal y Geometrías": return <Icons.Ruler />;
        case "Estadísticas": case "Estadisticas": return <Icons.Sigma />;
        case "Físicas": case "Fisicas": return <Icons.Magnet />;
        case "Químicas": case "Quimicas": return <Icons.Flask />;
        default: return null;
    }
};

export default function HorarioTable({ data }) {
    // Re-render every 60s to update active time slot highlighting
    const [, setTick] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(timer);
    }, []);

    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg text-center border border-slate-100 dark:border-slate-700">
                <p className="text-gray-500 dark:text-gray-400">No se encontraron resultados para los filtros seleccionados.</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse horario-table">
                        <thead>
                            <tr className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                                <th className="px-6 py-4 w-32">Horario</th>
                                <th className="px-6 py-4">Asignatura</th>
                                <th className="px-6 py-4">Asesor</th>
                                <th className="px-6 py-4">Ubicación</th>
                                <th className="px-6 py-4 text-center">Día</th>
                                <th className="px-6 py-4 text-right">Sede</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {data.map((item, index) => {
                                const areaClass = areaColorMap[item.Area] || "bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400";
                                const isCancelado = item.Estado === "Cancelado";
                                const isInterno = item.Estado === "Interno";
                                const isVirtual = (item.Modalidad || "").includes("Virtual") || (item.Modalidad || "").includes("WhatsApp") || (item.Modalidad || "") === "Híbrido";
                                const modalidadLink = modalidadLinks[item.Modalidad] || null;
                                const hasLink = (item.Ubicación_Detalle && item.Ubicación_Detalle.startsWith("http")) || modalidadLink;
                                const virtualHref = (item.Ubicación_Detalle && item.Ubicación_Detalle.startsWith("http")) ? item.Ubicación_Detalle : modalidadLink;
                                const isActive = isTodayName(item.Día) && isTimeSlotActive(item.Hora_Inicio, item.Hora_Fin);

                                return (
                                    <tr key={index} className={`group transition-colors ${isActive ? "bg-green-50 dark:bg-green-900/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-10 w-1 rounded-full ${isCancelado ? "bg-red-400" : isActive ? "bg-green-500" : "bg-slate-200 dark:bg-slate-600"}`} />
                                                <div>
                                                    <span className="block text-slate-900 dark:text-white font-bold">{item.Hora_Inicio}</span>
                                                    <span className="block text-slate-500 dark:text-slate-400 text-xs">{item.Hora_Fin}</span>
                                                    {isActive && (
                                                        <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300 text-[10px] font-semibold">
                                                            <span className="relative flex h-1.5 w-1.5">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                                                            </span>
                                                            En curso
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${areaClass}`}>
                                                    {getAreaIcon(item.Area) || <span className="font-bold text-sm">{(item.Asignatura || "AS").substring(0, 2).toUpperCase()}</span>}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                                        {item.Asignatura || "Asesoría General"}
                                                    </h4>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                                                        {item.Modalidad || "Presencial"}
                                                    </span>
                                                    {isInterno && (
                                                        <span className="block text-xs text-yellow-700 dark:text-yellow-400 mt-1">⚠️ Solo contratistas/docentes</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Icons.User />
                                                <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">{item.Asesor}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                                                {item.Ubicación_Detalle || "Consultar en sede"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wide">
                                                {item.Día?.substring(0, 3)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {isVirtual && hasLink ? (
                                                <div className="flex items-center gap-2 justify-end">
                                                    <span className="inline-flex px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm font-bold">{item.Sede}</span>
                                                    <a href={virtualHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors text-sm font-bold">
                                                        <span>Consultar</span>
                                                        <Icons.ExternalLink />
                                                    </a>
                                                </div>
                                            ) : isCancelado ? (
                                                <span className="inline-flex px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold">Cancelado</span>
                                            ) : (
                                                <span className="inline-flex px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm font-bold">{item.Sede}</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
                {data.map((item, index) => {
                    const isCancelado = item.Estado === "Cancelado";
                    const isInterno = item.Estado === "Interno";
                    const isVirtual = (item.Modalidad || "").includes("Virtual") || (item.Modalidad || "").includes("WhatsApp") || (item.Modalidad || "") === "Híbrido";
                    const modalidadLink = modalidadLinks[item.Modalidad] || null;
                    const hasLink = (item.Ubicación_Detalle && item.Ubicación_Detalle.startsWith("http")) || modalidadLink;
                    const virtualHref = (item.Ubicación_Detalle && item.Ubicación_Detalle.startsWith("http")) ? item.Ubicación_Detalle : modalidadLink;
                    const isActive = isTodayName(item.Día) && isTimeSlotActive(item.Hora_Inicio, item.Hora_Fin);

                    return (
                        <div key={index} className={`relative rounded-2xl p-4 shadow-lg border ${isActive ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded-md bg-blue-600/10 dark:bg-blue-600/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">
                                        {item.Día?.substring(0, 3)}
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-bold text-slate-900 dark:text-white">{item.Hora_Inicio}</span>
                                        <span className="text-xs text-slate-500">-</span>
                                        <span className="text-xs font-medium text-slate-500">{item.Hora_Fin}</span>
                                    </div>
                                    {isActive && (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300 text-[10px] font-semibold">
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                                            </span>
                                            En curso
                                        </span>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-3">
                                {item.Asignatura || "Asesoría General"}
                            </h3>

                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-1.5 truncate">
                                    <Icons.User />
                                    <span className="truncate">{item.Asesor}</span>
                                </div>
                                <div className="flex items-center gap-1.5 truncate">
                                    <Icons.Location />
                                    <span className="truncate">{item.Ubicación_Detalle || item.Sede}</span>
                                </div>
                            </div>

                            {isInterno && (
                                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2">⚠️ Solo para contratistas/docentes</p>
                            )}

                            <div className="mt-3 flex justify-end">
                                {isVirtual && hasLink ? (
                                    <a href={virtualHref} target="_blank" rel="noopener noreferrer" className="w-full text-center py-2 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1">
                                        <span>Consultar</span>
                                        <Icons.ExternalLink />
                                    </a>
                                ) : isCancelado ? (
                                    <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 px-3 py-1 rounded-md">Cancelado</span>
                                ) : (
                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-md">{item.Sede}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
