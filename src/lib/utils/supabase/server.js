import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://oxbiapcwfjnnlszugcaf.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94YmlhcGN3ZmpubmxzenVnY2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTg3MTMsImV4cCI6MjA1ODY3NDcxM30.SSnmCuBEFCHfI2FvqqwzW2BKvPjdyuThbWt4W5eciBA'
)

// Example query - you should wrap this in an async function
// async function fetchTodos() {
//   const { data, error } = await supabase
//     .from('todos')
//     .select()
//   
//   if (error) {
//     console.error('Error fetching todos:', error)
//     return null
//   }
//   
//   return data
// }

export default supabase