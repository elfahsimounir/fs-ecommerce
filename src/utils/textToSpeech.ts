export function speakText(text: string, lang: string, voiceName?: string) {
  if (!('speechSynthesis' in window)) {
    console.error('Your browser does not support Speech Synthesis.');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang; // Set the language (e.g., 'en-US', 'fr-FR', 'ar-SA', 'es-ES')

  // Select a specific voice if provided
  const voices = window.speechSynthesis.getVoices();
  if (voiceName) {
    const selectedVoice = voices.find((voice) => voice.name === voiceName);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}
