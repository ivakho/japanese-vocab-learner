import type { ParseResult, TranslationLanguage, WordPair } from '../types/vocabulary';
import { createId } from './ids';

function cleanText(text: string): string {
  return text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

function fail(
  code: NonNullable<Extract<ParseResult, { ok: false }>['error']>['code'],
  message: string,
  line?: number,
): ParseResult {
  return { ok: false, error: { code, message, line } };
}

export function parseWordSetFile(file: File, text: string): ParseResult {
  if (!file.name.toLowerCase().endsWith('.txt')) {
    return fail('file-type', 'Import failed: the file must be a .txt file.');
  }

  const normalized = cleanText(text);
  if (!normalized.trim()) {
    return fail('empty-file', 'Import failed: the file is empty.');
  }

  let title: string | null = null;
  let language: TranslationLanguage | null = null;
  const words: WordPair[] = [];
  const japaneseSeen = new Set<string>();
  const lines = normalized.split('\n');

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    const lineNumber = index + 1;

    if (!line || line.startsWith('#')) return;

    if (line.startsWith('@')) {
      if (line.startsWith('@title:')) {
        if (title !== null) {
          throw new Error(`Duplicate @title at line ${lineNumber}.`);
        }
        title = line.slice('@title:'.length).trim();
        return;
      }

      if (line.startsWith('@translation:')) {
        if (language !== null) {
          throw new Error(`Duplicate @translation at line ${lineNumber}.`);
        }
        const rawLanguage = line.slice('@translation:'.length).trim();
        if (rawLanguage !== 'en' && rawLanguage !== 'ru') {
          throw new Error(`Invalid translation language at line ${lineNumber}.`);
        }
        language = rawLanguage;
        return;
      }

      throw new Error(`Unexpected metadata at line ${lineNumber}.`);
    }

    const delimiterIndex = line.indexOf('|||');
    if (delimiterIndex === -1 || line.indexOf('|||', delimiterIndex + 3) !== -1) {
      throw new Error(`Invalid row at line ${lineNumber}.`);
    }

    const japanese = line.slice(0, delimiterIndex).trim();
    const translation = line.slice(delimiterIndex + 3).trim();

    if (!japanese) {
      throw new Error(`Empty Japanese word at line ${lineNumber}.`);
    }
    if (!translation) {
      throw new Error(`Empty translation at line ${lineNumber}.`);
    }
    if (japaneseSeen.has(japanese)) {
      throw new Error(`Duplicate Japanese word "${japanese}" at line ${lineNumber}.`);
    }

    japaneseSeen.add(japanese);
    words.push({ id: createId('word'), japanese, translation });
  });

  if (title === null) return fail('missing-title', 'Import failed: @title is missing.');
  if (!title) return fail('empty-title', 'Import failed: @title cannot be empty.');
  if (language === null) return fail('missing-translation', 'Import failed: @translation is missing.');
  if (words.length === 0) return fail('no-words', 'Import failed: the vocabulary contains no word pairs.');
  if (words.length > 100) {
    return fail(
      'too-many-words',
      'Import failed: this word set contains more than 100 word pairs. The maximum is 100.',
    );
  }

  return {
    ok: true,
    wordSet: {
      id: createId('set'),
      title,
      language,
      words,
      createdAt: Date.now(),
    },
  };
}

export function parseWordSetFileSafely(file: File, text: string): ParseResult {
  try {
    return parseWordSetFile(file, text);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Import failed: the file could not be processed.';

    if (message.startsWith('Duplicate @title')) {
      const match = message.match(/line (\d+)/);
      return fail('unexpected-metadata', 'Import failed: @title appears more than once.', match ? Number(match[1]) : undefined);
    }
    if (message.startsWith('Duplicate @translation')) {
      const match = message.match(/line (\d+)/);
      return fail('unexpected-metadata', 'Import failed: @translation appears more than once.', match ? Number(match[1]) : undefined);
    }
    if (message.startsWith('Invalid translation language')) {
      const match = message.match(/line (\d+)/);
      return fail('invalid-language', 'Import failed: @translation must be either "en" or "ru".', match ? Number(match[1]) : undefined);
    }
    if (message.startsWith('Unexpected metadata')) {
      const match = message.match(/line (\d+)/);
      return fail('unexpected-metadata', 'Import failed: the file contains unsupported metadata.', match ? Number(match[1]) : undefined);
    }
    if (message.startsWith('Invalid row')) {
      const match = message.match(/line (\d+)/);
      return fail('invalid-row', 'Import failed: the vocabulary file contains an invalid row. Use: Japanese ||| Translation', match ? Number(match[1]) : undefined);
    }
    if (message.startsWith('Empty Japanese')) {
      const match = message.match(/line (\d+)/);
      return fail('empty-japanese', 'Import failed: the Japanese word cannot be empty.', match ? Number(match[1]) : undefined);
    }
    if (message.startsWith('Empty translation')) {
      const match = message.match(/line (\d+)/);
      return fail('empty-translation', 'Import failed: the translation cannot be empty.', match ? Number(match[1]) : undefined);
    }
    if (message.startsWith('Duplicate Japanese')) {
      const match = message.match(/Duplicate Japanese word "([^"]+)" at line (\d+)/);
      return fail('duplicate-japanese', match ? `Import failed: duplicate Japanese word "${match[1]}" was found.` : 'Import failed: duplicate Japanese word was found.', match ? Number(match[2]) : undefined);
    }

    return fail('invalid-row', 'Import failed: the file could not be processed. Please check that it uses the required TXT format.');
  }
}
