"use client";

import { useState } from 'react';

interface CalendarProps {
  theme?: 'light' | 'dark';
  language?: string;
  showAll?: boolean;
}

export default function Calendar({
  theme = 'light',
  language = 'en',
  showAll = true,
}: CalendarProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get Autochartist API configuration from environment variables
  const BROKER_ID = process.env.NEXT_PUBLIC_AUTOCHARTIST_BROKER_ID;
  const TOKEN = process.env.NEXT_PUBLIC_AUTOCHARTIST_TOKEN;
  const EXPIRE = process.env.NEXT_PUBLIC_AUTOCHARTIST_EXPIRE;
  
  // Construct the URL directly based on theme
  const autochartistUrl = theme === 'dark' 
    ? `https://component.autochartist.com/cal/?broker_id=${BROKER_ID}&token=${TOKEN}&expire=${EXPIRE}&user=Zuperior&locale=en-GB&account_type=LIVE&chart_style=AAz_AAAA_______MzMz_________________o1yi______-jXKL_YkKl______9iQqX______6Ncov______YkKl____________AAAA_xsCLv8kSiz_o1yi_7M8AAAJTS9kIEhIOm1tAAZkL00veXkACiMsIyMwLjAwMDAABUFyaWFs_wAA______________________8BAQH_SHax_2Sxiv__gEAAAAAAAAAAAAAAQCAAAABKaHR0cHM6Ly9icm9rZXJzbG9nb3MuYXV0b2NoYXJ0aXN0LmNvbS9jdXN0b20tY2hhcnRzL2RhcmstenVwZXJpb3ItbG9nby5wbmc-TMzNAA1NaWRkbGUgQ2VudGVyP4AAAAAAAAAAAAAAABBhdXRvY2hhcnRpc3QuY29t__-AQAAAAAEAAAAAAf__gED__4BA__-AQP8bAi4_gAAAP4AAAD-AAAA_gAAAP4AAAD-AAAA_gAAAP4AAAD-AAAA_gAAAP4AAAD-AAAA_gAAAP4AAAD5MzM0_gAAAAAAAAAAAAAAAAAAMAAAADAAAAAAAAAAAAAAAAA4AAAASAQ&style=ds${showAll ? '&show_all=true' : ''}`
    : `https://component.autochartist.com/cal/?broker_id=${BROKER_ID}&token=${TOKEN}&expire=${EXPIRE}&user=Zuperior&locale=en-GB&account_type=LIVE${showAll ? '&show_all=true' : ''}`;
  
  // Handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load calendar');
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
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading calendar...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={autochartistUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Autochartist Calendar"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-top-navigation"
        loading="eager"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
    </div>
  );
}
