import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://urfzvyfmnjfotibyuvaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZnp2eWZtbmpmb3RpYnl1dmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTYwMTMsImV4cCI6MjA3NDgzMjAxM30.3JcY99R-zn5EqsaOHIZ1ZF_7aFC5DWOZdZOqI2wVv-M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
