// utils/useSupabase.ts
import { supabase } from '@/utils/supabase/client';

// Define a type for the possible columns
type UserColumn = 'LpWelle' | 'Fotobook' | 'WorkBench';

// Fetch all user data including all columns
export const fetchUserData = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_data')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user data:', error);
    return null;
  }

  return data;
};

// Fetch specific page data for the user
export const fetchText = async (userId: string, column: 'LpWelle' | 'Fotobook' | 'WorkBench') => {
  const { data, error } = await supabase
    .from('user_data')
    .select(column)
    .eq('id', userId)
    .single();

  if (error) {
    console.error(`Error fetching data for ${column}:`, error);
    return null;
  }

  // Ensure the column data is available in the returned data object
  if (data && data[column as keyof typeof data]) {
    return data[column as keyof typeof data] as Record<string, any>;
  } else {
    return {};
  }
};

// Save data for a specific page and diagram
export const savePageData = async (
  userId: string,
  column: 'LpWelle' | 'Fotobook' | 'WorkBench',
  pageData: Record<string, any>
) => {
  console.log('Attempting to save pageData to Supabase:', pageData);
  const { error } = await supabase
    .from('user_data')
    .update({ [column]: pageData })
    .eq('id', userId);

  if (error) {
    console.error(`Error saving data for ${column}:`, error);
  } else {
    console.log('Data saved successfully for column:', column);
  }
};


// Delete a specific text entry from the page data
export const deleteText = async (
  userId: string,
  column: 'LpWelle' | 'Fotobook' | 'WorkBench',
  diagramIndex: number,
  textKey: string
) => {
  const { data, error } = await supabase
    .from('user_data')
    .select(column)
    .eq('id', userId)
    .single();

  if (error) {
    console.error(`Error fetching data for deletion in ${column}:`, error);
    return;
  }

  // Type guard to check that column exists in the data
  if (!data || !data[column as keyof typeof data]) {
    console.error(`Column ${column} not found in data.`);
    return;
  }

  // Get the current data and remove the specific text entry
  const currentData = data[column as keyof typeof data] as Record<string, any>;
  const currentDiagram = currentData[`diagram${diagramIndex + 1}`];

  if (currentDiagram) {
    delete currentDiagram[textKey];
    currentData[`diagram${diagramIndex + 1}`] = currentDiagram;

    // Save the updated data
    await savePageData(userId, column, currentData);
  }
};