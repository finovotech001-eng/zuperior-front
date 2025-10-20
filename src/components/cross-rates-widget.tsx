"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";

function ForexCrossRates(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget if any
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "width": "100%",
        "height": "700",
        "currencies": [
          "EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD",
          "CNY", "TRY", "SEK", "NOK", "DKK", "ZAR", "HKD", "SGD",
          "THB", "MXN", "IDR", "KRW", "PLN", "ISK", "KWD", "PHP",
          "MYR", "INR", "TWD", "SAR", "AED", "RUB", "ILS", "ARS",
          "CLP", "COP", "PEN", "UYU"
        ],
        "isTransparent": false,
        "colorTheme": "${theme === 'dark' ? 'dark' : 'light'}",
        "locale": "en",
        "backgroundColor": "${theme === 'dark' ? '#1D222D' : '#FFFFFF'}"
      }
    `;
    container.appendChild(script);

    // Cleanup on unmount
    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [theme]); // Added theme as dependency

  return (
    <div
      className="tradingview-widget-container w-full"
      ref={containerRef}
      style={{ height: "700px" }}
    >
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(ForexCrossRates);