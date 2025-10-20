"use client";

import { useState, useEffect } from 'react';

export default function TechnicalAnalysis({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme, type: 'technical' }),
        });

        if (!response.ok) {
          throw new Error('Failed to get chart URL');
        }

        const { url } = await response.json();
        setUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Chart load error:', err);
      } finally {
      }
    };

    fetchUrl();
  }, [theme]);



  if (error) {
    return (
      <div className={"flex flex-col items-center justify-center p-4 text-red-500"} >
        <div> {error}</div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        Technical analysis not available
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
        title="Autochartist Technical Analysis"
        sandbox="allow-scripts allow-same-origin allow-popups"
        loading="lazy"
        key={url}
      />
    </div>
  );
}