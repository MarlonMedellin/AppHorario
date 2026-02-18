export interface ScheduleItem {
  Orden_Dia?: number | string;
  Día?: string;
  Hora_Inicio?: string;
  Hora_Fin?: string;
  Asesor?: string;
  Asignatura?: string;
  Sede?: string;
  Modalidad?: string;
  Ubicación_Detalle?: string;
  Estado?: string;
  AUTO_ID_Unico?: string;
  Area?: string;
  Tipo?: string;
  [key: string]: unknown;
}
