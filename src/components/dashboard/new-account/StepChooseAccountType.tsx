import React, { useEffect } from "react";
import { Button } from "../../ui/button";
import { DialogTitle } from "../../ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AccountTypeCard } from "./accountTypeCard";
import { mt5Service } from "@/services/api.service";

interface StepChooseAccountTypeProps {
  accountPlan: string;
  setAccountPlan: (plan: string) => void;
  nextStep: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  isDragging: boolean;
  handleScrollLeft: () => void;
  handleScrollRight: () => void;
  arrowMaskStyle: React.CSSProperties;
}

export const StepChooseAccountType: React.FC<StepChooseAccountTypeProps> = ({
  accountPlan,
  setAccountPlan,
  nextStep,
  scrollRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  isDragging,
  handleScrollLeft,
  handleScrollRight,
  arrowMaskStyle,
}) => {
  // Test Groups API call
  useEffect(() => {
    const testGroupsAPI = async () => {
      try {
        console.log('🔄 Calling Groups API...');
        const response = await mt5Service.getMt5Groups();
        console.log('✅ Groups API Response:', response);

        // Filter to only allowed groups
        const allowedGroups = [
          'real\\Bbook\\Pro\\dynamic-2000x-10P',
          'real\\Bbook\\Standard\\dynamic-2000x-20Pips'
        ];

        const filteredGroups = Array.isArray(response)
          ? response.filter((group: any) => allowedGroups.includes(group.Group))
          : [];

        console.log('🔍 Filtered Groups (Pro & Standard only):', filteredGroups);
      } catch (error) {
        console.error('❌ Groups API Error:', error);
      }
    };

    testGroupsAPI();
  }, []);

  return (
    <div className="w-full relative">
      <DialogTitle className="text-[20px] md:text-[28px] font-bold text-center text-black dark:text-white/75 tracking-tighter leading-11">
        Choose account type
      </DialogTitle>
      <div className="space-y-6 mt-6">
        <div
          className="relative w-full overflow-hidden"
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <div className="flex space-x-4 w-[450px] md:w-max overflow-x-auto scrollbar-hide scroll-smooth">
            <AccountTypeCard
              userRole="For Beginners"
              title="Standard"
              selected={accountPlan === "standard"}
              onClick={() => setAccountPlan("standard")}
            />
            <AccountTypeCard
              userRole="For Experts"
              title="Pro"
              selected={accountPlan === "pro"}
              onClick={() => setAccountPlan("pro")}
            />
          </div>
        </div>
        <Button
          className="bg-gradient-to-tr from-[#6242a5] to-[#9f8bcf] cursor-pointer mb-1 text-white w-full font-semibold text-xs leading-[14px] py-2 items-center flex justify-center"
          onClick={nextStep}
          disabled={!accountPlan}
        >
          Continue
        </Button>
      </div>
      <button
        onClick={handleScrollLeft}
        className="absolute -left-8 md:-left-10 top-1/2 -translate-y-1/2 z-10 p-1 md:p-2 rounded-full cursor-pointer dark:text-white text-black hover:bg-white/5"
      >
        <ChevronLeft size={20} />
        <div
          style={arrowMaskStyle as React.CSSProperties}
          className="border dark:border-white/50 border-black pointer-events-none"
        />
      </button>
      <button
        onClick={handleScrollRight}
        className="absolute -right-8 md:-right-10 top-1/2 -translate-y-1/2 z-10 p-1 md:p-2 rounded-full dark:text-white text-black cursor-pointer hover:bg-white/5"
      >
        <ChevronRight size={20} />
        <div
          style={arrowMaskStyle as React.CSSProperties}
          className="border dark:border-white/50 border-black pointer-events-none rotate-180"
        />
      </button>
    </div>
  );
};
