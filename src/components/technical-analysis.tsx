"use client";

import React, { useEffect, useRef, memo } from "react";

function TechnicalAnalysis(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "interval": "1m",
        "width": 425,
        "isTransparent": false,
        "height": 550,
        "symbol": "NASDAQ:AAPL",
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "en",
        "colorTheme": "dark"
      }
    `;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ width: "425px", height: "550px" }}
    >
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(TechnicalAnalysis);

