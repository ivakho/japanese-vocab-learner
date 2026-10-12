export type TranslationLanguage = 'en' | 'ru';

export interface WordPair {
  id: string;
  japanese: string;
  translation: string;
}

export interface WordSet {
  id: string;
  title: string;
  language: TranslationLanguage;
  words: WordPair[];
  createdAt: number;
}

export type ParserErrorCode =
  | 'file-type'
  | 'empty-file'
  | 'missing-title'
  | 'empty-title'
  | 'missing-translation'
  | 'invalid-language'
  | 'invalid-row'
  | 'empty-japanese'
  | 'empty-translation'
  | 'duplicate-japanese'
  | 'no-words'
  | 'too-many-words'
  | 'unexpected-metadata';

export interface ParserError {
  code: ParserErrorCode;
  message: string;
  line?: number;
}

export type ParseResult =
  | { ok: true; wordSet: WordSet }
  | { ok: false; error: ParserError };
