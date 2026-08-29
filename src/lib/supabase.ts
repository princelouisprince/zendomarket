import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://xnmfwlyosqbuynekyhia.supabase.co';
export const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubWZ3bHlvc3FidXluZWt5aGlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzgyMTU4NywiZXhwIjoyMTAzMzk3NTg3fQ.ZxYSDBqqkuge-Z2XGry62x-cJTQZU0mCSr6lLT7Work';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubWZ3bHlvc3FidXluZWt5aGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MjE1ODcsImV4cCI6MjEwMzM5NzU4N30.s488seTaxJyPNqK0cKDDfdz6O7p3jb4LXV2DI_C0rqo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

