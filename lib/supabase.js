import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lokkybgzwaobrorpunkd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxva2t5Ymd6d2FvYnJvcnB1bmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTM2NDgsImV4cCI6MjA5Nzc2OTY0OH0.6WaudIk7-KPkn3xNUglYVRRWJJOAtL6PiQogLXbATC8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
