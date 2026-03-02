import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jgbyungwgmjglsrrdoua.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYnl1bmd3Z21qZ2xzcnJkb3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzAxOTYsImV4cCI6MjA4Nzk0NjE5Nn0.ouVeEX31ATRBQxd6WMLG91_lLsqASx-Y84sHbgdAs54'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)