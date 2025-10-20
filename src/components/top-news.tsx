"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";

function TopNews(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "feedMode": "all_symbols",
        "isTransparent": false,
        "displayMode": "regular",
        "width": "100%",
        "height": 700,
        "colorTheme": "${theme === "dark" ? "dark" : "light"}",
        "locale": "en",
        "backgroundColor": "${theme === "dark" ? "#1D222D" : "#FFFFFF"}"
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
      className="tradingview-widget-container w-full px-4"
      ref={containerRef}
      style={{ height: "700px" }}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(TopNews);
