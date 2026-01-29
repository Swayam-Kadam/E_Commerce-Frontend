import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://stzxarfqjessjrtsqwbp.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0enhhcmZxamVzc2pydHNxd2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MDI4MjYsImV4cCI6MjA3MjI3ODgyNn0.Zbw0b46x-2FPPZdw-vbgbpq31fTVMoo4PyexosUAcOI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)