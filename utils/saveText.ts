import { supabase } from '@/utils/supabase/client';

export const saveText = async (userId: string, diagramIndex: number, textField: string, newText: string) => {
  const { data, error } = await supabase
    .from('lpwelle')
    .select('texts')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching texts:', error);
    return;
  }

  const updatedTexts = {
    ...data.texts,
    [`diagram${diagramIndex + 1}`]: {
      ...data.texts[`diagram${diagramIndex + 1}`],
      [textField]: newText,
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
