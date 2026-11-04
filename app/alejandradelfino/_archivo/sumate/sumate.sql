-- Quienes se suman desde el formulario de /alejandradelfino.
--
-- Se corre una sola vez, a mano, en el SQL Editor de Supabase (el mismo
-- proyecto que /cesion, mientras el sitio viva en hivrido).

create extension if not exists "pgcrypto";

create table if not exists public.delfino_sumate (
  id              uuid        primary key default gen_random_uuid(),
  creado_en       timestamptz not null default now(),

  nombre          text        not null,
  localidad       text        not null,
  whatsapp        text        not null,
  ayudas          text[]      not null default '{}',

  -- El texto exacto que la persona aceptó (Ley 25.326): si la redacción
  -- cambia, cada fila conserva la suya.
  consentimiento  text        not null,

  -- Solo el hash de la IP, para el freno de envíos en serie.
  ip_hash         text        not null,
  user_agent      text
);

create index if not exists idx_delfino_sumate_ip  on public.delfino_sumate (ip_hash, creado_en desc);
create index if not exists idx_delfino_sumate_loc on public.delfino_sumate (localidad);

-- RLS prendido y sin políticas: solo el route handler, con la service_role
-- key, llega a estos datos personales.
alter table public.delfino_sumate enable row level security;
