"use client";

import React, { useEffect, useRef, memo, JSX } from "react";

interface TradingViewSingleTickerProps {
  symbol: string;
  theme: "light" | "dark"; // Pass theme as prop
  width?: number | string;
  height?: number; // Add height prop
}

function TradingViewSingleTicker({
  symbol,
  theme,
  width = "100%",
  height = 40, // Add height prop with default value
}: TradingViewSingleTickerProps): JSX.Element {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = ""; // Clear old widget

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbol": "${symbol}",
        "colorTheme": "${theme}",
        "isTransparent": false,
        "locale": "en",
        "width": "${width}",
        "height": ${height}
      }
    `;

    container.current.appendChild(script);
  }, [symbol, theme, width, height]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ minHeight: height, height }}
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TradingViewSingleTicker);
