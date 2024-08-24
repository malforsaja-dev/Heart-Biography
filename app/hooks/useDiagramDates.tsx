import { useState, useEffect } from 'react';
import clientData from '../data/clientData.json';

const calculateDates = (birthDate: string, diagramIndex: number) => {
  const startDate = new Date(birthDate);
  startDate.setFullYear(startDate.getFullYear() + 7 * diagramIndex);

  const dates = [];
  const day = startDate.getDate();
  const month = startDate.getMonth();

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setFullYear(currentDate.getFullYear() + i);
    currentDate.setDate(day);
    currentDate.setMonth(month);
    dates.push(currentDate.toLocaleDateString('de-DE'));
  }

  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 7);
  endDate.setDate(day - 1);
  dates.push(endDate.toLocaleDateString('de-DE'));

  return dates;
};

const useDiagramDates = (diagramIndex: number) => {
  const [dates, setDates] = useState<string[]>([]);
  const [maxDiagrams, setMaxDiagrams] = useState<number>(0);

  useEffect(() => {
    const birthDate = new Date(clientData.birthdate);
    const today = new Date();

    const age = today.getFullYear() - birthDate.getFullYear();
    const maxDiagramsBasedOnAge = Math.min(Math.ceil(age / 7), 15);
    setMaxDiagrams(maxDiagramsBasedOnAge);

    const calculatedDates = calculateDates(clientData.birthdate, diagramIndex);
    setDates(calculatedDates);
  }, [diagramIndex]);

  return { dates, maxDiagrams };
};

export default useDiagramDates;
