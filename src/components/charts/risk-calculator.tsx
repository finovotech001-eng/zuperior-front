"use client";

import { useMemo } from 'react';
import { useAutochartist, AutochartistConfig } from '@/hooks/useChartToken';

interface RiskCalculatorProps {
  theme?: 'light' | 'dark';
  language?: string;

}

export default function RiskCalculator({
  theme = 'light',
  language = 'en',

}: RiskCalculatorProps) {
  // ✅ Memoize config to avoid unnecessary re-fetches and fix ESLint warnings
  const config: AutochartistConfig = useMemo(() => ({
    theme,
    type: 'risk-calculator',
    language,
  }), [theme, language]);

  const { url,  error } = useAutochartist(config);


  if (error) {
    return (
      <div className={` flex flex-col items-center justify-center p-4 text-red-500`} >
        <div> {error}</div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className={` flex items-center justify-center`} >
        Risk calculator URL not available
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
        title="Autochartist Risk Calculator"
        sandbox="allow-scripts allow-same-origin"
        key={url}
      />
    </div>
  );
}
