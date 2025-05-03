import speech, { protos } from '@google-cloud/speech';

export function startSpeechRecognition(
  lang: string,
  onResult: (transcript: string) => void,
  onError: (error: string) => void
) {
  if (!('webkitSpeechRecognition' in window)) {
    onError('Your browser does not support Speech Recognition.');
    return;
  }

  const recognition = new (window as any).webkitSpeechRecognition();
  recognition.lang = lang; // Set the language (e.g., 'en-US', 'fr-FR', 'ar-SA', 'es-ES')
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  recognition.start();
}
