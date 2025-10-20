"use client";

import React, { useEffect, useRef, memo } from "react";

function FundamentalData(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "isTransparent": false,
        "largeChartUrl": "",
        "displayMode": "regular",
        "width": 600,
        "height": 550,
        "colorTheme": "dark",
        "symbol": "NASDAQ:AAPL",
        "locale": "en"
      }
    `;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ width: "600px", height: "550px" }}
    >
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(FundamentalData);
