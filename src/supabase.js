import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mnkbfqrtdjczcgxsznow.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ua2JmcXJ0ZGpjemNneHN6bm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4OTM5NDMsImV4cCI6MjA5NjQ2OTk0M30.JX88MN--xq_drk4u6m8_2LTo6L95hO3zkgQC9thLhus'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)