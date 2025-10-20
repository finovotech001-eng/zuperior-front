"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const TickerTape = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const currentContainer = containerRef.current; // Cache the value

    if (currentContainer) {
      currentContainer.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: "FOREXCOM:SPXUSD",
          title: "S&P 500 Index",
        },
        {
          proName: "FOREXCOM:NSXUSD",
          title: "US 100 Cash CFD",
        },
        {
          proName: "FX_IDC:EURUSD",
          title: "EUR to USD",
        },
        {
          proName: "BITSTAMP:BTCUSD",
          title: "Bitcoin",
        },
        {
          proName: "BITSTAMP:ETHUSD",
          title: "Ethereum",
        },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "adaptive",
      colorTheme: theme === "dark" ? "dark" : "light",
      locale: "en",
    });

    if (currentContainer) {
      currentContainer.appendChild(script);
    }

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = "";
      }
    };
  }, [theme]); // Added theme as dependency

  return (
    <div
      className="tradingview-widget-container mb-5"
      ref={containerRef}
      id="tradingview-widget-container">
      <div className="tradingview-widget-container__widget" />
    </div>
  );
};

export default TickerTape;
