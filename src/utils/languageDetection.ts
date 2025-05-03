import { franc } from 'franc';

export function detectUserLanguage(text: string): string {
  const langCode = franc(text); // Detect language from text
  const languageMap: { [key: string]: string } = {
    eng: 'en-US',
    fra: 'fr-FR',
    ara: 'ar-SA',
    spa: 'es-ES',
  };

  return languageMap[langCode] || 'en-US'; // Default to English if language is not recognized
}
