"use client";

import { useState, useEffect } from 'react';

export default function TechnicalAnalysis({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get Autochartist API configuration from environment variables
  const BROKER_ID = process.env.NEXT_PUBLIC_AUTOCHARTIST_BROKER_ID;
  const TOKEN = process.env.NEXT_PUBLIC_AUTOCHARTIST_TOKEN;
  const EXPIRE = process.env.NEXT_PUBLIC_AUTOCHARTIST_EXPIRE;
  
  // Construct the URL directly based on theme
  const autochartistUrl = `https://component.autochartist.com/to/?broker_id=${BROKER_ID}&token=${TOKEN}&expire=${EXPIRE}&user=Zuperior&locale=en_GB&layout=horizontal&account_type=LIVE&trade_now=n&enable_timeframe=y${theme === 'dark' ? '&style=ds' : ''}#/results`;
  
  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load technical analysis chart');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500 min-h-[400px]">
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[800px] h-[65vh] max-h-[800px] rounded-lg overflow-hidden shadow-sm relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center  justify-center bg-white dark:bg-gray-900 z-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading technical analysis...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={autochartistUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Autochartist Technical Analysis"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-top-navigation"
        loading="eager" // Changed to eager for faster loading
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </div>
  );
}