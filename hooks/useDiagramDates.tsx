import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

const calculateDates = (birthDate: string, diagramIndex: number) => {
  const startDate = new Date(birthDate);
  startDate.setFullYear(startDate.getFullYear() + 7 * diagramIndex);

  const dates = [];
  const day = startDate.getDate();
  const month = startDate.getMonth();

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setFullYear(currentDate.getFullYear() + i);
    currentDate.setMonth(month);
    currentDate.setDate(day + 1);
    dates.push(currentDate.toLocaleDateString('de-DE'));
  }

  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 7);
  endDate.setDate(day);
  dates.push(endDate.toLocaleDateString('de-DE'));

  return dates;
};

const useDiagramDates = (diagramIndex: number) => {
  const [dates, setDates] = useState<string[]>([]);
  const [maxDiagrams, setMaxDiagrams] = useState<number>(0);

  useEffect(() => {
    const fetchBirthDate = async () => {

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }

      if (user) {
        const { data, error } = await supabase
          .from('lpwelle')
          .select('birth_date')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching birth date:', error);
        } else {
          const birthDate = data.birth_date;
          const today = new Date();

          const age = today.getFullYear() - new Date(birthDate).getFullYear();
          const maxDiagramsBasedOnAge = Math.min(Math.ceil(age / 7), 15);
          setMaxDiagrams(maxDiagramsBasedOnAge);

          const calculatedDates = calculateDates(birthDate, diagramIndex);
          setDates(calculatedDates);
        }
      }
    };

    fetchBirthDate();
  }, [diagramIndex]);

  return { dates, maxDiagrams };
};

export default useDiagramDates;
