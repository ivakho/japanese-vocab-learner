import type { WordPair, WordSet } from '../types/vocabulary';

const STORAGE_KEY = 'japanese-vocabulary-sets';

function isWordPair(value: unknown): value is WordPair {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string' && typeof item.japanese === 'string' && typeof item.translation === 'string';
}

function isWordSet(value: unknown): value is WordSet {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    (item.language === 'en' || item.language === 'ru') &&
    Array.isArray(item.words) &&
    item.words.every(isWordPair) &&
    item.words.length >= 1 &&
    item.words.length <= 100 &&
    typeof item.createdAt === 'number'
  );
}

export function loadWordSets(): WordSet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isWordSet).sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export function saveWordSets(wordSets: WordSet[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wordSets));
}
