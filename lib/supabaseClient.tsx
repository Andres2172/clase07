import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mufyvgmlwfmhfealqcka.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Znl2Z21sd2ZtaGZlYWxxY2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1Mjk0NjcsImV4cCI6MjA3ODEwNTQ2N30.lMVczstkfLZf_Juu2pCwUKj7Ce3BjtlyWI7ESLyaJA0';
export const supabase = createClient(supabaseUrl, supabaseKey);