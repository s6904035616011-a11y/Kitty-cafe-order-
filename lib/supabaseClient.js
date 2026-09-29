import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fgryzxuisfcfywdqfmom.supabase.co/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZncnl6eHVpc2ZjZnl3ZHFmbW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc1MzI5MjMsImV4cCI6MjA0MzEwODkyM30';

export const supabase = createClient(supabaseUrl, supabaseKey);
