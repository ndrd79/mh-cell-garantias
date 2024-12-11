import { createClient } from '@supabase/supabase-js'

// Verifica se estamos no ambiente de desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development'

// Define as variáveis com valores padrão apenas em desenvolvimento
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (isDevelopment ? 'https://eftuqucfzxjuebydvxtm.supabase.co' : '')
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (isDevelopment ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmdHVxdWNmenhqdWVieWR2eHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NDExNjUsImV4cCI6MjA0OTUxNzE2NX0.GbebnI-yhhyqNJkhI_6fGrvkbuzbPeryUuVRuPGRwhI' : '')

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
