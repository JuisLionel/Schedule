
import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

const supabaseUrl = "https://tnjpsqaldpurznsciarp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuanBzcWFsZHB1cnpuc2NpYXJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI4Njg5NSwiZXhwIjoyMDYyODYyODk1fQ.WlSS0XkRX_TMk0rMXiRGrnEdkKhjuNkbzqp-b7jTBhU"

export const supabase = createClient(supabaseUrl, supabaseKey);
