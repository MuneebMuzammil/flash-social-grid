// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cnfzmvetypsaaktltomr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZnptdmV0eXBzYWFrdGx0b21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MjYzMDAsImV4cCI6MjA2NDMwMjMwMH0.HpUHyz2dCYbUA3XXeiUxQwhZ33VGTtMzmomC9GfS69w";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);