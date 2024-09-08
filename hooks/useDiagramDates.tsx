import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

const calculateDates = (birthDate: string) => {
  const allDates = [];
  
  for (let diagramIndex = 0; diagramIndex < 15; diagramIndex++) {
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

    allDates.push(dates);
  }

  return allDates;
};

const useDiagramDates = () => {
  const [allDates, setAllDates] = useState<string[][]>([]);
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

          const calculatedDates = calculateDates(birthDate);
          setAllDates(calculatedDates);
        }
      }
    };

    fetchBirthDate();
  }, []);

  const getDatesForDiagram = (diagramIndex: number) => {
    if (diagramIndex < 0 || diagramIndex >= allDates.length) return [];
    return allDates[diagramIndex];
  };

  return { getDatesForDiagram, maxDiagrams };
};

export default useDiagramDates;
