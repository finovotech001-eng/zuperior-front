import { Tabs } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TextAnimate } from "@/components/ui/text-animate";
import React from "react";
import { useTheme } from "next-themes";

interface Props {
  activeTab: "all" | "deposits" | "withdrawals";
  setActiveTab: (tab: "all" | "deposits" | "withdrawals") => void;
  cardMaskStyle: React.CSSProperties;
}

export const TransactionsHeader: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  cardMaskStyle,
}) => {
  const { theme } = useTheme(); // Added theme here

  return (
    <>
      <TextAnimate
        duration={0.2}
        as={"h1"}
        className="text-3xl font-bold text-[#000000] dark:text-[#FFFFFF]"
      >
        Transactions
      </TextAnimate>
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(value) => {
          if (
            value &&
            (value === "all" || value === "deposits" || value === "withdrawals")
          ) {
            setActiveTab(value);
          }
        }}
        className="mb-[16px]"
      >
        <div className="flex items-center mt-3">
          <ToggleGroup
            type="single"
            value={activeTab}
            onValueChange={(value) => {
              if (
                value &&
                (value === "all" ||
                  value === "deposits" ||
                  value === "withdrawals")
              ) {
                setActiveTab(value);
              }
            }}
            className="p-2 relative rounded-[10px]"
          >
            {theme === "dark" ? ( // Using theme here
              <div style={cardMaskStyle} className="border border-white/45" />
            ) : (
              <div
                style={{
                  borderRadius: "15px",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 0,
                  pointerEvents: "none",
                }}
                className="border border-[#dad8d8]"
              />
            )}
            <ToggleGroupItem value="all" className="z-10 cursor-pointer">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="deposits" className="z-10 cursor-pointer">
              Deposits
            </ToggleGroupItem>
            <ToggleGroupItem value="withdrawals" className="z-10 cursor-pointer">
              Withdrawals
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Tabs>
    </>
  );
};
