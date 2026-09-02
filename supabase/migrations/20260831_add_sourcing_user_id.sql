-- Fix "Request Failed" on sourcing requests: the sourcing_requests table is missing the
-- user_id column that createSourcingRequest inserts (and SourcingPage filters "My Requests" by).
-- Run this in the Supabase SQL Editor (or `supabase db push`).

ALTER TABLE public.sourcing_requests
  ADD COLUMN IF NOT EXISTS user_id UUID;
