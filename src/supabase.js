import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fhazueesaadbkrcdfymm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoYXp1ZWVzYWFkYmtyY2RmeW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTAzNDgsImV4cCI6MjA5MjQyNjM0OH0.gQChmEcf-Dbm2f99pn6-llCgx5NVCVJ4FiUCsNC38MU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
