"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";

function StockHeatmap(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Cleanup to prevent duplication on route change or reload
    element.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "exchanges": [],
        "dataSource": "SPX500",
        "grouping": "sector",
        "blockSize": "market_cap_basic",
        "blockColor": "change",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "${theme === "dark" ? "dark" : "light"}",
        "hasTopBar": false,
        "isDataSetEnabled": false,
        "isZoomEnabled": true,
        "hasSymbolTooltip": true,
        "isMonoSize": false,
        "width": "100%",
        "height": "600"
      }
    `;

    element.appendChild(script);

    return () => {
      element.innerHTML = "";
    };
  }, [theme]); // Added theme as dependency

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(StockHeatmap);
