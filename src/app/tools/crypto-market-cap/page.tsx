"use client";
import TickerTape from "@/components/ticker-tape";
import { TextAnimate } from "@/components/ui/text-animate";
import CryptoMarketCap from "@/components/crypto-market-cap";
import ToolNavbar from "../toolsNavbar";

const Page = () => {
  return (
    <div>
      <div className="flex flex-row items-center justify-between py-6">
        <ToolNavbar />
        <TextAnimate className="text-4xl font-semibold dark:text-white/75">
          Crypto Market Cap
        </TextAnimate>
        <div className="flex-1" />
      </div>

      <TickerTape />
      <div className="flex gap-6 justify-center items-center px-15">
        <CryptoMarketCap />
      </div>
    </div>
  );
};

export default Page;
