import {createClient} from '@supabase/supabase-js';

//credenciales borradas para seguridad

export const supabase = createClient(supabaseUrl, supabaseApiKey)