import { supabase } from '@/utils/supabase/client';

// Fetch text data from the database
export const fetchText = async (userId: string) => {
  const { data, error } = await supabase
    .from('lpwelle')
    .select('texts')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching texts:', error);
    return null;
  }

  return data?.texts || {};
};

// Save or update text in the database
export const saveText = async (
  userId: string,
  diagramIndex: number,
  textField: string,
  newText: string,
  newPosition: { x: number; y: number },
  newSize: { width: string; height: string },
  newStyling: {
    backgroundColor: string;
    borderColor: string;
    borderSize: number;
    isBgTransparent: boolean;
    isBorderTransparent: boolean;
    rotation: number;
  }
) => {
  const { data, error } = await supabase
    .from('lpwelle')
    .select('texts')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching texts:', error);
    return;
  }

  const existingTexts = data?.texts || {};

  const updatedTexts = {
    ...existingTexts,
    [`diagram${diagramIndex + 1}`]: {
      ...existingTexts[`diagram${diagramIndex + 1}`],
      [textField]: {
        content: newText,
        position: newPosition,
        size: newSize,
        ...newStyling,
      },
    },
  };

  const { error: updateError } = await supabase
    .from('lpwelle')
    .update({ texts: updatedTexts })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating texts:', updateError);
  }
};

// Delete text from the database
export const deleteText = async (userId: string, diagramIndex: number, textField: string) => {
  const { data, error } = await supabase
    .from('lpwelle')
    .select('texts')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching texts:', error);
    return;
  }

  const existingDiagram = data?.texts?.[`diagram${diagramIndex + 1}`] || {};

  // Delete the specific text field from the diagram
  delete existingDiagram[textField];

  const updatedTexts = {
    ...data.texts,
    [`diagram${diagramIndex + 1}`]: existingDiagram,
  };

  const { error: updateError } = await supabase
    .from('lpwelle')
    .update({ texts: updatedTexts })
    .eq('id', userId);

  if (updateError) {
    console.error('Error deleting text:', updateError);
  }
};
