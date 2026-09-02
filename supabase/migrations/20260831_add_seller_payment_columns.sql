-- Fix seller application submission failure (PGRST204: missing payment columns).
-- The code inserts payment_method, payment_phone_or_code, payment_account_name into
-- both seller_applications and sellers, but these columns do not exist in the schema.
-- Run this in the Supabase SQL Editor (or via `supabase db push`).

ALTER TABLE public.seller_applications
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS payment_phone_or_code text,
  ADD COLUMN IF NOT EXISTS payment_account_name text;

ALTER TABLE public.sellers
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS payment_phone_or_code text,
  ADD COLUMN IF NOT EXISTS payment_account_name text;
