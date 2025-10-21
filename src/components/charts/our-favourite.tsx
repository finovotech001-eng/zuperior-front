"use client";

import { useMemo } from 'react';
import { useAutochartist, AutochartistConfig } from '@/hooks/useChartToken';

interface OurFavoritesProps {
  theme?: 'light' | 'dark';
  language?: string;

}

export default function OurFavorites({
  theme = 'light',
  language = 'en',

}: OurFavoritesProps) {
  // ✅ Memoize the config object to avoid unnecessary re-renders
  const config: AutochartistConfig = useMemo(() => ({
    theme,
    type: 'favorites',
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
        Favorites URL not available
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
        title="Autochartist Our Favorites"
        sandbox="allow-scripts allow-same-origin"
        key={url}
      />
    </div>
  );
}
