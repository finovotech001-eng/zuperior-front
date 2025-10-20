"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";

function ForexHeatMap(): React.ReactElement {
  const container = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    // Clean up previous widgets
    element.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "width": "100%",
        "height": 600,
        "currencies": [
          "EUR",
          "USD",
          "JPY",
          "GBP",
          "CHF",
          "AUD",
          "CAD",
          "NZD",
          "CNY",
          "INR"
        ],
        "isTransparent": false,
        "colorTheme": "${theme === 'dark' ? 'dark' : 'light'}",
        "locale": "en",
        "backgroundColor": "${theme === 'dark' ? '#1D222D' : '#FFFFFF'}"
      }
    `;
    element.appendChild(script);

    return () => {
      if (element) {
        element.innerHTML = "";
      }
    };
  }, [theme]); // Added theme as a dependency

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ width: "full", height: "full" }}
    >
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(ForexHeatMap);