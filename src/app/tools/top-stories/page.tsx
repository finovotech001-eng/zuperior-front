"use client";
import TickerTape from "@/components/ticker-tape";
import TopNews from "@/components/top-news";
import { TextAnimate } from "@/components/ui/text-animate";
import ToolNavbar from "../toolsNavbar";

const Page = () => {
  return (
    <>
      <div className="flex items-center justify-between py-6">
        <ToolNavbar />
        <TextAnimate className="text-4xl font-semibold dark:text-white/75">
          Top Stories
        </TextAnimate>
        <div className="flex-1" />
      </div>
      <TickerTape />
      <div className="flex gap-6 justify-center items-center px-15">
        <TopNews />
      </div>
    </>
  );
};

export default Page;
