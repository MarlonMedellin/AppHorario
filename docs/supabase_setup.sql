-- Script de Inicialización Supabase (AppHorario)
-- Ejecutar este script en el "SQL Editor" de tu panel de Supabase

-- 1. Crear la Tabla de Horarios
CREATE TABLE IF NOT EXISTS public.horarios (
    id SERIAL PRIMARY KEY,
    "Asesor" TEXT NOT NULL,
    "Día" TEXT NOT NULL,
    "Area" TEXT NOT NULL,
    "Hora_Inicio" TEXT NOT NULL,
    "Hora_Fin" TEXT NOT NULL,
    "Sede" TEXT NOT NULL,
    "Tipo" TEXT,
    "Asignatura" TEXT,
    "Modalidad" TEXT,
    "Ubicación_Detalle" TEXT,
    "CTA" TEXT,
    "Link_Foto" TEXT,
    "Estado" TEXT,
    "hasTypoError" BOOLEAN DEFAULT FALSE,
    "typoDetails" TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Configurar Seguridad a Nivel de Fila (RLS)
-- Habilitar RLS en la tabla
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;

-- 3. Crear Políticas
-- Política 1: Lectura Pública OBLIGATORIA (Cualquiera puede consultar la tabla sin necesidad de login en Supabase)
CREATE POLICY "Permitir lectura pública a horarios" 
ON public.horarios 
FOR SELECT 
USING (true);

-- Nota: No creamos política de INSERT, UPDATE o DELETE, por lo que bloquea todo intento anónimo.
-- Sólo la llave secreta `SERVICE_ROLE_KEY` que usaremos en tu script de NodeJS `syncMatriz.mjs` podrá hacer escrituras.
