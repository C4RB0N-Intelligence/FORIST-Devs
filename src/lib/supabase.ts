import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://url.supabase.co';
const supabaseKey = 'key';

export const supabase = createClient(supabaseUrl, supabaseKey);
