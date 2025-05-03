'use client';

import SingleListItem from '@/components/Shop/SingleListItem';
import { Product } from '@/types/product';
import { useState, useEffect } from 'react';
import { startSpeechRecognition } from '@/utils/speechRecognition';
import { speakText } from '@/utils/textToSpeech';
import { detectUserLanguage } from '@/utils/languageDetection';
import SkeletonLoading from '../Common/SkeletonLoading';
import SearchItem from '../Shop/SearchItem';
import Image from 'next/image';
import { Sparkles, X } from 'lucide-react';

const AiSearch = () => {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false); // Toggle between text and voice mode
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string>('Welcome! Ask me anything.'); // Default welcome message
  const [userLanguage, setUserLanguage] = useState<string>('en-US'); // Default language
  const [loading, setLoading] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState<string>(''); // Updated to store voice command or user input

  // Fetch products on page load
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/data');
      const data = await response.json();
      setProducts(data.products || []);
    };
    fetchProducts();
  }, []);

  const handlePrompt = async (command: string, isVoice: boolean) => {
    const detectedLanguage = detectUserLanguage(command);
    setUserLanguage(detectedLanguage);

    const response = await fetch('/api/ai-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voiceCommand: command }),
    });

    const data = await response.json();
    setSearchResults(data.products || []);

    // Speak the message only if the input was via voice
    if (isVoice && data.message) {
      speakText(data.message, detectedLanguage); // Use the detected language
    }

    console.log('Search Results:', data.products);
    setMessage(data.message || ''); // Update message
    setLoading(false);
    setIsRecording(false); // Re-enable the record button
  };

  const handleVoiceCommand = async () => {
    setIsRecording(true);

    startSpeechRecognition(
      userLanguage, // Use the detected language for speech recognition
      async (transcript) => {
        console.log('Voice Command:', transcript);
        setVoiceCommand(transcript); // Display voice command in textarea
        setLoading(true);
        await handlePrompt(transcript, true); // Pass true for voice input
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsRecording(false);
      }
    );
  };

  const cancelVoiceCommand = () => {
    setIsRecording(false);
    setVoiceCommand('');
    setSearchResults([]); // Clear search results
    setMessage('Welcome! Ask me anything.'); // Reset to welcome message
    setLoading(false); // Stop loading state
    console.log('Voice recording and search operation canceled.');
    // Stop the speech recognition process if applicable
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (typeof window !== 'undefined' && (window as any).SpeechRecognition) {
      const recognition = new (window as any).SpeechRecognition();
      recognition.abort(); // Stop the speech recognition process
    }
  };

  const handleTextAreaKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (voiceCommand.trim()) {
        setLoading(true);
        await handlePrompt(voiceCommand, false); // Pass false for text input
      }
    }
  };

  return (
    <div className=''>
      <div className='flex w-full relative justify-end mb-2 px-4'>
        <div className='flex gap-2 items-center'>
          <span className='text-[9px] text-dark-4'>Powered by</span>
        <Image src='/images/logo/DeepSeek_logo.png' alt='AI Search' width={60} height={60} />
        </div>
      </div>
      <div className='w-full  border-gray-2 border relative rounded-3xl p-3'>
        <textarea
          value={voiceCommand}
          onChange={(e) => setVoiceCommand(e.target.value)} // Update voiceCommand on user input
          onKeyDown={handleTextAreaKeyDown} // Handle Enter key submission
          autoFocus
          className='w-full h-full flex outline-none bg-transparent p-4 border-none'
          placeholder="Ask anything"
          data-virtualkeyboard="true"
        ></textarea>
        <button
          onClick={handleVoiceCommand}
          disabled={isRecording}
          className="absolute bottom-5 right-5 flex h-9 items-center justify-center rounded-full bg-primary text-white transition-colors focus-visible:outline-none focus-visible:outline-black disabled:text-gray-50 disabled:opacity-30 can-hover:hover:opacity-70 dark:bg-white dark:text-black w-9"
        >
          {isRecording ? (
            <div className='relative flex items-center justify-center'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 4C8.67157 4 8 4.67157 8 5.5V18.5C8 19.3284 8.67157 20 9.5 20C10.3284 20 11 19.3284 11 18.5V5.5C11 4.67157 10.3284 4 9.5 4Z" fill="currentColor"></path>
                <path d="M13 8.5C13 7.67157 13.6716 7 14.5 7C15.3284 7 16 7.67157 16 8.5V15.5C16 16.3284 15.3284 17 14.5 17C13.6716 17 13 16.3284 13 15.5V8.5Z" fill="currentColor"></path>
                <path d="M4.5 9C3.67157 9 3 9.67157 3 10.5V13.5C3 14.3284 3.67157 15 4.5 15C5.32843 15 6 14.3284 6 13.5V10.5C6 9.67157 5.32843 9 4.5 9Z" fill="currentColor"></path>
                <path d="M19.5 9C18.6716 9 18 9.67157 18 10.5V13.5C18 14.3284 18.6716 15 19.5 15C20.3284 15 21 14.3284 21 13.5V10.5C21 9.67157 20.3284 9 19.5 9Z" fill="currentColor"></path>
              </svg>
              <div className='absolute w-10 h-10 border-4 border-primary/50 rounded-full animate-ping'></div>
              <div className='absolute w-12 h-12 border-4 border-primary/30 rounded-full animate-pulse'></div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.5 4C8.67157 4 8 4.67157 8 5.5V18.5C8 19.3284 8.67157 20 9.5 20C10.3284 20 11 19.3284 11 18.5V5.5C11 4.67157 10.3284 4 9.5 4Z" fill="currentColor"></path>
                <path d="M13 8.5C13 7.67157 13.6716 7 14.5 7C15.3284 7 16 7.67157 16 8.5V15.5C16 16.3284 15.3284 17 14.5 17C13.6716 17 13 16.3284 13 15.5V8.5Z" fill="currentColor"></path>
                <path d="M4.5 9C3.67157 9 3 9.67157 3 10.5V13.5C3 14.3284 3.67157 15 4.5 15C5.32843 15 6 14.3284 6 13.5V10.5C6 9.67157 5.32843 9 4.5 9Z" fill="currentColor"></path>
                <path d="M19.5 9C18.6716 9 18 9.67157 18 10.5V13.5C18 14.3284 18.6716 15 19.5 15C20.3284 15 21 14.3284 21 13.5V10.5C21 9.67157 20.3284 9 19.5 9Z" fill="currentColor"></path>
              </svg>
            </div>
          )}
        </button>
        {isRecording && (
          <button
            onClick={cancelVoiceCommand}
                  className="absolute bottom-5 right-16 flex h-7 items-center justify-center rounded-full bg-gray-2 text-gray-4  transition-colors focus-visible:outline-none focus-visible:outline-black disabled:text-gray-50 disabled:opacity-30 can-hover:hover:opacity-70 dark:bg-white dark:text-black w-7"
          >
        <X  size={16}/>
          </button>
        )}
      </div>

 
      <div className='w-full  border-b flex'>
      <p className={`mt-2 text-center p-2 ${message || loading ? 'w-full' : 'w-0'} duration-300 ease-in-out`}>
          {loading ? (
            <div className='flex items-center gap-2'>
              <span className='text-sm opacity-50'>{'Thinking...'}</span>
              <Sparkles className='text-primary animate-pulse' size={15} />
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <span className='text-sm opacity-70'>{message}</span>
              <Sparkles className='text-primary' size={15} />
            </div>
          )}
        </p>
      </div>
        <div className=" h-[42vh]  overflow-y-auto no-scrollbar">
        <div className='w-full mt-4'>
        {searchResults&&products&&!loading&&
       <>
         {filterByReferenceIds(searchResults,products).map((product) => (
          <SearchItem key={product.id} item={product} />
        ))}
       </>
        }
        </div>
        <span className="relative inline-block w-4 h-4 rounded-full bg-black animate-spinx">
  <span className="absolute inset-0 rounded-full bg-black animate-[spin_1s_infinite_linear] transform translate-x-[150%]"></span>
  <span className="absolute inset-0 rounded-full bg-black animate-[spin_1s_infinite_linear] transform translate-x-[150%] delay-500"></span>
</span>
        {loading && <SkeletonLoading count={3}/> }
      </div>
    </div>
  );
};

export default AiSearch;

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
// components/SkeletonLoading.js





