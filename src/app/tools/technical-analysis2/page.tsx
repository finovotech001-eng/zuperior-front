"use client";
import TechnicalAnalysis from "@/components/technical-analysis";
import FundamentalData from "@/components/fundamental-data";
import TickerTape from "@/components/ticker-tape";
import { TextAnimate } from "@/components/ui/text-animate";
import ToolNavbar from "../toolsNavbar";

const Page = () => {
  return (
    <>
      <div className="flex items-center justify-between py-6">
        <ToolNavbar />
        <TextAnimate className="text-4xl font-semibold dark:text-white/75">
          Technical Analysis & Fundamental Data
        </TextAnimate>
        <div className="flex-1" />
      </div>
      <TickerTape />
      <div className="flex gap-6 justify-center items-center px-15">
        <TechnicalAnalysis />
        <FundamentalData />
      </div>
    </>
  );
};

export default Page;
