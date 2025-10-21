"use client";

import { useMemo } from 'react';
import { useAutochartist, AutochartistConfig } from '@/hooks/useChartToken';

interface MarketNewsProps {
  theme?: 'light' | 'dark';
  language?: string;
}

export default function MarketNews({
  theme = 'light',
  language = 'en',
}: MarketNewsProps) {
  const config: AutochartistConfig = useMemo(() => ({
    theme,
    type: 'market-news',
    language
  }), [theme, language]);

  const { url, error } = useAutochartist(config);



  if (error) {
    return (
      <div className={` flex flex-col items-center justify-center p-4 text-red-500 min-h-screen`}>
        <div>{error}</div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className={` flex items-center justify-center min-h-screen`}>
        Market news URL not available
      </div>
    );
  }

  return (
    <div className="w-full min-h-[800px] h-[65vh] max-h-[800px] rounded-lg overflow-hidden shadow-sm">
      <iframe
        src={url}
        frameBorder="0"
          width="100%"
        height="100%"
        title="Autochartist Market News"
        sandbox="allow-scripts allow-same-origin"
        key={url}
      />
    </div>
  );
}

