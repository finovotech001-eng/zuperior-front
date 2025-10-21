"use client";
import TickerTape from "@/components/ticker-tape";
import { TextAnimate } from "@/components/ui/text-animate";
import { useTheme } from "next-themes";
import PerformanceStats from "@/components/charts/performance-statistics";
import ToolNavbar from "../toolsNavbar";

const Page = () => {
  const { theme } = useTheme();
  return (
    <div className="bg-[#060a10] min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between py-3 sm:py-4 md:py-6 px-4">
        <ToolNavbar />
        <TextAnimate className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center font-semibold text-white/75 dark:text-white/75 mt-2 sm:mt-0">
          Performance Statistics
        </TextAnimate>
        <div className="hidden sm:block flex-1" />
      </div>
      <TickerTape />
      <div className="flex gap-4 md:gap-6 justify-center items-center px-2 sm:px-6 md:px-10 lg:px-15 w-full overflow-x-hidden">
        <PerformanceStats
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      </div>
    </div>
  );
};

export default Page;
