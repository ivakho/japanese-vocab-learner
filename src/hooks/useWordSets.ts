import { useCallback, useEffect, useState } from 'react';
import type { ParseResult, WordSet } from '../types/vocabulary';
import { loadWordSets, saveWordSets } from '../utils/storage';

export function useWordSets() {
  const [wordSets, setWordSets] = useState<WordSet[]>(() => loadWordSets());

  useEffect(() => {
    saveWordSets(wordSets);
  }, [wordSets]);

  const addWordSet = useCallback((result: ParseResult) => {
    if (!result.ok) return;
    setWordSets((current) => [result.wordSet, ...current]);
  }, []);

  const deleteWordSet = useCallback((id: string) => {
    setWordSets((current) => current.filter((set) => set.id !== id));
  }, []);

  return { wordSets, addWordSet, deleteWordSet };
}
