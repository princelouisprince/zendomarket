-- Global Sourcing RFQ system: store a unique RFQ number and tracking code on
-- each sourcing request so customers can track progress by code and admins can
-- reference requests by RFQ number. Existing rows are populated with synthetic
-- values so nothing breaks.
-- Run this in the Supabase SQL Editor (or `supabase db push`).

ALTER TABLE public.sourcing_requests
  ADD COLUMN IF NOT EXISTS rfq_number TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS tracking_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS specifications TEXT;

-- Backfill any existing rows
UPDATE public.sourcing_requests
   SET rfq_number = COALESCE(rfq_number, 'RFQ-' || UPPER(SUBSTRING(id::text, 1, 8))),
       tracking_code = COALESCE(tracking_code, 'ZND-RFQ-' || UPPER(SUBSTRING(id::text, 1, 8)));

CREATE UNIQUE INDEX IF NOT EXISTS sourcing_requests_rfq_number_idx
  ON public.sourcing_requests (rfq_number);
CREATE UNIQUE INDEX IF NOT EXISTS sourcing_requests_tracking_code_idx
  ON public.sourcing_requests (tracking_code);
