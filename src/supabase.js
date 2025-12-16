import { createClient } from '@supabase/supabase-js'

// Pegue essas chaves no site do Supabase (Project Settings -> API)
const supabaseUrl = 'https://wubanvdleloqjhaodjpx.supabase.co'
const supabaseKey = 'sb_publishable_55QuqHvU0iggYHdc9GWQow_DVz4eWyh'

export const supabase = createClient(supabaseUrl, supabaseKey)