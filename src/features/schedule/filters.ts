import type { ScheduleItem } from "./types";

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const PUBLIC_TIPOS = [
  "Asesoría Académica",
  "Asesoría Academica",
  "Asesoría Virtual",
];

export function getTodayName(date: Date = new Date()): string {
  return DAY_NAMES[date.getDay()] || "";
}

export function filterTodayPublicSchedule(
  data: ScheduleItem[],
  date: Date = new Date(),
): ScheduleItem[] {
  const todayName = getTodayName(date);

  return data.filter(
    (item) =>
      item.Día === todayName &&
      typeof item.Tipo === "string" &&
      PUBLIC_TIPOS.includes(item.Tipo),
  );
}

export function filterPersonalizedSchedule(
  data: ScheduleItem[],
): ScheduleItem[] {
  return data.filter(
    (item) =>
      typeof item.Tipo === "string" &&
      item.Tipo.toLowerCase().includes("personalizada"),
  );
}

export function getUniqueAsesores(data: ScheduleItem[]): string[] {
  return [
    ...new Set(
      data
        .map((item) => item.Asesor)
        .filter(
          (asesor): asesor is string =>
            typeof asesor === "string" && asesor.trim() !== "",
        ),
    ),
  ].sort();
}
