"use client";
import { useTheme } from "next-themes";

export default function TerminalPage() {
  const { theme } = useTheme();
  const themeMode = theme === "light" ? 0 : 1;

  return (
    <div className="flex-1 h-full">
      <iframe
        src={`https://trade.zuperior.com/terminal?utm_campaign=Webterminal&utm_source=www.zuperior.com&lang=en&theme-mode=${themeMode}&theme=greenRed&marketwatch=EURUSD`}
        className="w-full h-full"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
}
