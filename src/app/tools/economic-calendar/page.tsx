"use client";
import EconomicCalendar from "@/components/economic-calendar";
import TickerTape from "@/components/ticker-tape";
import { TextAnimate } from "@/components/ui/text-animate";
import ToolNavbar from "../toolsNavbar";

const Page = () => {
  return (
    <>
      <div className="flex flex-row items-center py-6">
        <ToolNavbar />
        <TextAnimate className="text-4xl font-semibold dark:text-white/75">
          Economic Calendar
        </TextAnimate>
        <div className="flex-1" />
      </div>
      <TickerTape />
      <div className="flex justify-center items-center px-15">
        <EconomicCalendar />
      </div>
    </>
  );
};

export default Page;
