'use client';

import SingleListItem from '@/components/Shop/SingleListItem';
import { Product } from '@/types/product';
import { useState, useEffect } from 'react';
import { startSpeechRecognition } from '@/utils/speechRecognition';
import { speakText } from '@/utils/textToSpeech';
import { detectUserLanguage } from '@/utils/languageDetection';

const AiSearchPage = () => {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false); // Toggle between text and voice mode
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<any>();
  const [userLanguage, setUserLanguage] = useState<string>('en-US'); // Default language

  // Fetch products on page load
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/data');
      const data = await response.json();
      setProducts(data.products || []);
    };
    fetchProducts();
  }, []);

  const handlePrompt = async (voiceCommand: string) => {
    const detectedLanguage = detectUserLanguage(voiceCommand);
    setUserLanguage(detectedLanguage);

    const response = await fetch('/api/ai-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voiceCommand }),
    });

    const data = await response.json();
    setSearchResults(data.products || []);

    // Convert the message to speech in the detected language
    if (data.message) {
      speakText(data.message, detectedLanguage); // Use the detected language
    }

    console.log('Search Results:', data.products);
    setMessage(data.message);
  };

  const handleVoiceCommand = async () => {
    setIsRecording(true);

    startSpeechRecognition(
      userLanguage, // Use the detected language for speech recognition
      async (transcript) => {
        console.log('Voice Command:', transcript);
        setIsRecording(false);
        await handlePrompt(transcript);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsRecording(false);
      }
    );
  };

  const handleTextCommand = async () => {
    const textCommand = prompt('Enter your search query:');
    if (textCommand) {
      await handlePrompt(textCommand);
    }
  };

  return (
    <div className='mt-[100px] p-4'>
      <h1 className='text-3xl font-bold text-center'>AI Search</h1>
      <div className='flex justify-center mt-6'>
        <button
          className={`px-4 py-2 mx-2 rounded-md ${
            isVoiceMode ? 'bg-blue-500 ' : 'bg-gray-200'
          }`}
          onClick={() => setIsVoiceMode(true)}
        >
          Voice Prompt
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded-md ${
            !isVoiceMode ? 'bg-blue-500 ' : 'bg-gray-200'
          }`}
          onClick={() => setIsVoiceMode(false)}
        >
          Text Prompt
        </button>
      </div>
      <div className='flex justify-center mt-6'>
        {isVoiceMode ? (
          <button
            onClick={handleVoiceCommand}
            disabled={isRecording}
            className='relative px-6 py-3 bg-blue-500  rounded-full'
          >
            {isRecording ? (
              <div className='relative flex items-center justify-center'>
                <span>Listening...</span>
                <div className='absolute w-12 h-12 border-4 border-blue-300 rounded-full animate-ping'></div>
                <div className='absolute w-16 h-16 border-4 border-blue-500 rounded-full animate-pulse'></div>
              </div>
            ) : (
              'Start Speaking'
            )}
          </button>
        ) : (
          <button
            onClick={handleTextCommand}
            className='px-6 py-3 bg-blue-500  rounded-full'
          >
            Enter Text Prompt
          </button>
        )}
      </div>
        {message && <p className='mt-4 text-center'>{message}</p>}
      <div className='mt-8'>
        <h2 className='text-2xl font-semibold'>Search Results:</h2>
        <div className='w-full mt-4'>
          {filterByReferenceIds(searchResults,products).map((product) => (
            <SingleListItem key={product.id} item={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiSearchPage;

interface Identifiable {
    id: string | number; // Assuming ID can be string or number
  }
  
  function filterByReferenceIds<T extends Identifiable, U extends Identifiable>(
    referenceArray: T[],
    targetArray: U[]
  ): U[] {
    // Create a Set of reference IDs for faster lookup
    const referenceIds = new Set(referenceArray.map(item => item.id));
    
    // Filter target array based on reference IDs
    return targetArray.filter(item => referenceIds.has(item.id));
  }
