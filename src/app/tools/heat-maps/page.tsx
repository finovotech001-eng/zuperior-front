"use client";

import { useState } from "react";
import CryptoHeatmap from "@/components/crypto-heatmap";
import ForexHeatmap from "@/components/forex-heatmap";
import StockHeatmap from "@/components/stock-heatmap";
import TickerTape from "@/components/ticker-tape";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextAnimate } from "@/components/ui/text-animate";
import ToolNavbar from "../toolsNavbar";

const Page = () => {
  const [activeTab, setActiveTab] = useState("forex");

  return (
    <div className=" bg-[#FFFFFF] dark:bg-[#000000] ">

      <div className="flex py-6">
        <ToolNavbar />

        <TextAnimate className="text-4xl flex-1 font-semibold dark:text-white/75">
          Heat Maps
        </TextAnimate>
      </div>
      <div className="flex justify-center mb-6">
        <Tabs defaultValue="forex" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className=" bg-transparent px-4 py-4 gap-1">
            <TabsTrigger
              value="forex"
              className="data-[state=active]:bg-gradient-to-r from-[#1E1429] to-[#311B47]/95 px-6 cursor-pointer data-[state=active]:text-white text-zinc-400 rounded-md transition-all duration-200 border border-gray-300 dark:border-gray-900"
            >
              Forex
            </TabsTrigger>
            <TabsTrigger
              value="crypto"
              className="data-[state=active]:bg-gradient-to-r from-[#1E1429] to-[#311B47]/95 px-4 cursor-pointer data-[state=active]:text-white text-zinc-400 rounded-md transition-all duration-200 border border-gray-300 dark:border-gray-900"
            >
              Crypto
            </TabsTrigger>
            <TabsTrigger
              value="stock"
              className="data-[state=active]:bg-gradient-to-r from-[#1E1429] to-[#311B47]/95 px-4 cursor-pointer data-[state=active]:text-white text-zinc-400 rounded-md transition-all duration-200 border border-gray-300 dark:border-gray-900"
            >
              Stock Heat Map
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TickerTape />


      <div className="flex w-full justify-center mt-7  text-[#000000] dark:text-white px-15">
        {activeTab === "forex" && (
          <div className="w-full ">
            <TextAnimate className=" text-xl font-semibold text-center mb-5">
              Forex Heatmap
            </TextAnimate>
            <ForexHeatmap />
          </div>
        )}
        {activeTab === "crypto" && (
          <div className="w-full">
            <TextAnimate className="mb-5 text-xl font-semibold text-center">
              Crypto Heatmap
            </TextAnimate>
            <CryptoHeatmap />
          </div>
        )}
        {activeTab === "stock" && (
          <div className="w-full ">
            <TextAnimate className="mb-5 text-xl font-semibold text-center">
              Stock Heatmap
            </TextAnimate>
            <StockHeatmap />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
