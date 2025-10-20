"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export interface AutochartistConfig {
  theme?: 'light' | 'dark';
  type?: 'technical' | 'sentiment' | 'market-news' | 'risk-calculator' | 
         'performance-stats' | 'calendar' | 'volatility' | 'favorites';
  language?: string;
  showAll?: boolean;
  nextDays?: number;
}


export const useAutochartist = (config: AutochartistConfig) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/token", config, {
          headers: { "Content-Type": "application/json" }
        });

        const data = response.data;

        setUrl(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, [config]); // ✅ safe now because config is memoized

  return { url, loading, error };
};
