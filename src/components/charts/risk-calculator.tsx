"use client";

import { useState } from 'react';

interface RiskCalculatorProps {
  theme?: 'dark' | 'light';
  language?: string;
}

export default function RiskCalculator({
  theme = 'dark',
  language = 'en',
}: RiskCalculatorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get Autochartist API configuration from environment variables
  const BROKER_ID = process.env.NEXT_PUBLIC_AUTOCHARTIST_BROKER_ID;
  const TOKEN = process.env.NEXT_PUBLIC_AUTOCHARTIST_TOKEN;
  const EXPIRE = process.env.NEXT_PUBLIC_AUTOCHARTIST_EXPIRE;
  
  // Construct the URL directly based on theme
  const autochartistUrl = theme === 'dark' 
    ? `https://component.autochartist.com/rc/?broker_id=${BROKER_ID}&token=${TOKEN}&expire=${EXPIRE}&user=Zuperior&locale=en&account_type=LIVE&css=https://broker-resources.autochartist.com/css/components/997-rc-app_ds.css#!/`
    : `https://component.autochartist.com/rc/?broker_id=${BROKER_ID}&token=${TOKEN}&expire=${EXPIRE}&user=Zuperior&locale=en&account_type=LIVE&css=https://broker-resources.autochartist.com/css/components/997-rc-app.css#!/`;
  
  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load risk calculator');
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
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading risk calculator...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={autochartistUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Autochartist Risk Calculator"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-top-navigation"
        loading="eager"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </div>
  );
}
