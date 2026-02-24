import React from 'react';

const dayAbbr = {
    "Lunes": "L",
    "Martes": "M",
    "Miércoles": "X",
    "Jueves": "J",
    "Viernes": "V",
    "Sábado": "S",
};

export default function DayTabs({ activeDay, onDayChange }) {
    const days = [
        "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
    ];

    return (
        <div className="flex space-x-2">
            <button
                onClick={() => onDayChange("")}
                className={`
                        px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                        ${activeDay === ""
                        ? "bg-blue-600 text-white shadow-md transform scale-105"
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
                    `}
            >
                Todo
            </button>

            {days.map((day) => (
                <button
                    key={day}
                    onClick={() => onDayChange(day)}
                    className={`
                            px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                            ${activeDay === day
                            ? "bg-blue-600 text-white shadow-md transform scale-105"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
                        `}
                >
                    {/* Abreviación en mobile, nombre completo en desktop */}
                    <span className="md:hidden">{dayAbbr[day]}</span>
                    <span className="hidden md:inline">{day}</span>
                </button>
            ))}
        </div>
    );
}
