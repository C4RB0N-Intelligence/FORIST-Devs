import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mfzrfxdfegrsilthepuf.supabase.co';
const supabaseKey = 'sb_publishable__zVIUoOt5g1-bOTuyq7LVQ_RhLeUaqh';

export const supabase = createClient(supabaseUrl, supabaseKey);
