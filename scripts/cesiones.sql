-- Tabla de cesiones de derechos de imagen — /cesion
--
-- Se corre una sola vez, a mano, en el SQL Editor de Supabase.
--
-- No hay un initSchema() en el arranque como en la defensa de clics de Aqua
-- Climas: eso tenía sentido con SQLite y un proceso largo. Acá cada request
-- puede levantar una instancia nueva, y hacer DDL en cada cold start sería
-- pagar el mismo peaje miles de veces para no cambiar nada.

create extension if not exists "pgcrypto";

create table if not exists public.cesiones (
  -- El id lo genera el servidor (crypto.randomUUID) y viaja en el insert: es
  -- el número de comprobante que se le muestra a quien firma, así que tiene
  -- que ser el mismo dato en los dos lados.
  id                    uuid primary key,

  -- Hora del servidor con offset de Buenos Aires. Es timestamptz, no text:
  -- Postgres la guarda normalizada y las comparaciones por rango —las del
  -- freno por IP— funcionan de verdad.
  creado_en             timestamptz not null,
  registrado_en         timestamptz not null default now(),

  -- ── Participante ────────────────────────────────────────────────────────
  nombre                text        not null,
  dni                   text        not null,
  fecha_nacimiento      date        not null,
  edad                  smallint    not null,
  domicilio             text        not null,
  telefono              text        not null,
  email                 text        not null,
  instagram             text,
  numero_orden          text,

  -- ── Adulto responsable (solo si es menor) ───────────────────────────────
  es_menor              boolean     not null default false,
  adulto_nombre         text,
  adulto_dni            text,
  adulto_vinculo        text,
  adulto_telefono       text,

  -- ── Firmas ──────────────────────────────────────────────────────────────
  -- PNG con fondo transparente, como data URL. Van en la fila y no en Storage
  -- a propósito: son 10-40 KB, el insert queda atómico y no hay forma de que
  -- quede una firma huérfana sin su registro, ni un registro sin su firma.
  firma_png             text        not null,
  firma_adulto_png      text,

  -- ── Integridad del documento ────────────────────────────────────────────
  -- Qué versión del texto se exhibió, y el SHA-256 de esa redacción exacta.
  -- Con los dos se prueba después qué leyó cada persona, aunque el texto haya
  -- cambiado. El hash lo calcula el servidor, nunca el navegador.
  texto_version         text        not null,
  texto_sha256          text        not null,

  -- ── Constancia técnica del acto de firma ────────────────────────────────
  ip                    text        not null,
  ip_hash               text        not null,
  user_agent            text        not null,
  browser               text,
  os                    text,
  device_type           text,
  screen_resolution     text,
  viewport              text,
  language              text,
  timezone_dispositivo  text,
  referrer              text,

  -- Un menor sin adulto responsable no es una cesión válida: que lo impida la
  -- base y no solo el handler, que es el que se puede llegar a tocar.
  constraint cesiones_menor_con_adulto check (
    not es_menor
    or (adulto_nombre is not null
        and adulto_dni is not null
        and adulto_vinculo is not null
        and adulto_telefono is not null
        and firma_adulto_png is not null)
  )
);

-- El freno por IP consulta por ip + ventana de tiempo; el índice cubre las dos.
create index if not exists idx_cesiones_ip_creado on public.cesiones (ip, creado_en desc);
create index if not exists idx_cesiones_creado    on public.cesiones (creado_en desc);
create index if not exists idx_cesiones_dni       on public.cesiones (dni);

-- RLS prendido y sin políticas: nadie llega a esta tabla con la clave anónima.
-- El único acceso es el route handler con la service_role key, que la saltea
-- por diseño. Son datos personales y firmas: el default tiene que ser "nadie".
alter table public.cesiones enable row level security;
