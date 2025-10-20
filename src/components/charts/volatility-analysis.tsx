"use client";

import { useMemo } from 'react';
import { useAutochartist, AutochartistConfig } from '@/hooks/useChartToken';

interface VolatilityAnalysisProps {
  theme?: 'light' | 'dark';
  language?: string;
}

export default function VolatilityAnalysis({
  theme = 'light',
  language = 'en',
}: VolatilityAnalysisProps) {
  // ✅ Memoized config to avoid useEffect dependency warning
  const config: AutochartistConfig = useMemo(() => ({
    theme,
    type: 'volatility',
    language
  }), [theme, language]);

  const { url, error } = useAutochartist(config);



  if (error) {
    return (
      <div className={` flex flex-col items-center justify-center p-4 text-red-500`} >
        <div>{error}</div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className={` flex items-center justify-center`} >
        Volatility analysis URL not available
      </div>
    );
  }

  return (
    <div className="w-full min-h-[800px] h-[65vh] max-h-[800px] rounded-lg overflow-hidden shadow-sm">
      <iframe
        src={url}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Autochartist Volatility Analysis"
        sandbox="allow-scripts allow-same-origin"
        key={url}
      />
    </div>
  );
}
