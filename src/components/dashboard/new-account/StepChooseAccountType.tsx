import React, { useEffect } from "react";
import { Button } from "../../ui/button";
import { DialogTitle } from "../../ui/dialog";
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
      <DialogTitle className="text-[20px] md:text-[28px] font-bold text-center text-black dark:text-white/75 tracking-tighter leading-11 px-4">
        Choose account type
      </DialogTitle>
      <div className="space-y-4 md:space-y-6 mt-4 md:mt-6 px-2 md:px-0">
        <div className="relative w-full flex justify-center">
          <div className="flex flex-col md:flex-row gap-4 md:gap-4 w-full max-w-[540px] md:w-[540px]">
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
          className="bg-gradient-to-tr from-[#6242a5] to-[#9f8bcf] cursor-pointer mb-1 text-white w-full font-semibold text-xs md:text-sm leading-[14px] py-3 md:py-2 items-center flex justify-center mt-4 md:mt-0"
          onClick={nextStep}
          disabled={!accountPlan}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
