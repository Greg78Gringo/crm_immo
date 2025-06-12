import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase.immo.autonobotique.com';
const supabaseKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc0ODc4MDEwMCwiZXhwIjo0OTA0NDUzNzAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.k6c2DG0PVuniBSTxIgh30an1QSgrmUDw5OGyAVIHPqY';

export const supabase = createClient(supabaseUrl, supabaseKey);