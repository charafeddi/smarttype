export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
}

export type KeyboardMode = 'letters' | 'numbers' | 'symbols';

export type ShiftState = 'off' | 'once' | 'locked';

export interface KeyData {
  label: string;
  value: string;
  flex?: number;
  type?: 'character' | 'backspace' | 'shift' | 'mode' | 'space' | 'enter' | 'globe';
}

export interface TranslationHistoryItem {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}
