"use client";

import React, { useEffect, useRef, memo } from "react";
import { useTheme } from "next-themes";

function EconomicCalendar(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "colorTheme": "${theme === "dark" ? "dark" : "light"}",
        "isTransparent": false,
        "width": "100%",
        "height": "650",
        "locale": "en",
        "importanceFilter": "-1,0,1",
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
      className="tradingview-widget-container w-full "
      ref={containerRef}
      style={{ height: "650px" }}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(EconomicCalendar);
