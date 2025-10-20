import React from "react";
import { DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import Image from "next/image";
import mt5 from "@/assets/mt5.png";
import globe from "@/assets/globe.svg";
import download from "@/assets/Download.svg";
import web from "@/assets/web.png";
import copy from "@/assets/copy.svg";

interface StepAccountCreatedProps {
  latestAccount: {
    status?: string;
    status_code?: string;
    message?: string;
    _token?: string;
    object?: {
      crm_account_id?: number;
      crm_tp_account_id?: number;
      tp_id?: string;
      tp_creation_error?: string;
    };
    // Real MT5 account data
    accountId?: string;
    name?: string;
    group?: string;
    leverage?: number;
    balance?: number;
    equity?: number;
    credit?: number;
    margin?: number;
    marginFree?: number;
    marginLevel?: number;
    profit?: number;
    isEnabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
  } | null;
  password: string;
  onOpenChange: (open: boolean) => void;
}

export const StepAccountCreated: React.FC<StepAccountCreatedProps> = ({
  latestAccount,
  password,
  onOpenChange,
}) => (
  <div className="w-full">
    <DialogTitle className="text-[20px] md:text-[28px] text-center mt-4 font-semibold dark:text-white/75 text-black">
      Account created successfully
    </DialogTitle>
    <DialogTitle className="text-[14px] text-center md:mt-4 font-semibold dark:text-white/75 text-black py-[5.5px]">
      Copy the credentials and enter into MetaTrader 5
    </DialogTitle>
    <div className="md:space-y-6">
      <div className="rounded-[15px] leading-8 bg-white dark:bg-[#050105] px-6 border border-[#251e25] mt-2 md:mt-4 mx-auto w-auto md:w-[396px]">
        <div className="py-2">
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-semibold pr-2 text-black dark:text-[#8e8c8f]">
              Server:
            </span>
            <span className="text-[14px] font-semibold text-start w-[140px] text-black dark:text-white capitalize">
              ZuperiorFX-Limited
            </span>
            <Image className="h-4 w-4 cursor-pointer" src={copy} alt="" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-semibold text-black dark:text-[#8e8c8f]">
              MT5 Login:
            </span>
            <span className="text-[14px] font-semibold text-black dark:text-white/74 w-[140px]">
              {latestAccount?.object?.tp_id || latestAccount?.object?.crm_account_id || "N/A"}
            </span>
            <Image className="h-4 w-4 cursor-pointer" src={copy} alt="" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-black dark:text-[#8e8c8f]">
              Password:
            </span>
            <span className="text-[14px] font-semibold text-black dark:text-white/75 w-[150px]">
              {password || "N/A"}
            </span>
            <Image className="h-4 w-4 cursor-pointer" src={copy} alt="" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-semibold text-black dark:text-[#8e8c8f]">
              Account Type:
            </span>
            <span className="text-[14px] font-semibold text-black dark:text-white/74 w-[140px]">
              Live
            </span>
            <Image className="h-4 w-4 cursor-pointer" src={copy} alt="" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-semibold text-black dark:text-[#8e8c8f]">
              Leverage:
            </span>
            <span className="text-[14px] font-semibold text-black dark:text-white/75 w-[140px]">
              1:{latestAccount?.leverage || "N/A"}
            </span>
            <Image className="h-4 w-4 cursor-pointer" src={copy} alt="" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-semibold text-black dark:text-[#8e8c8f]">
              Balance:
            </span>
            <span className="text-[14px] font-semibold text-black dark:text-white/74 w-[140px]">
              ${latestAccount?.balance || "0.00"}
            </span>
            <Image className="h-4 w-4 cursor-pointer" src={copy} alt="" />
          </div>
          <div className="flex justify-between items-center md:mb-4">
            <span className="text-[14px] font-semibold text-black dark:text-[#8e8c8f]">
              Account Group:
            </span>
            <span className="text-[14px] font-semibold text-black dark:text-white/75 w-[140px]">
              {latestAccount?.group?.replace(/real\\|demo\\/g, '') || "N/A"}
            </span>
            <Image className="h-4 w-4 cursor-pointer" src={copy} alt="" />
          </div>
        </div>
      </div>
      <div className="rounded-[15px] bg-white dark:bg-[#050105] px-6 border border-[#1a131a] mt-2 md:mt-4 mx-auto w-auto md:w-[396px]">
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Image className="h-9 w-9 mr-4 cursor-pointer" src={mt5} alt="" />
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-black dark:text-white">
                  MetaTrader 5
                </span>
                <span className="text-[13px] font-semibold text-black dark:text-white/75">
                  Download & Install
                </span>
              </div>
            </div>
            <Image className="h-4 w-4 cursor-pointer" src={download} alt="" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Image className="h-9 w-9 mr-4 cursor-pointer" src={web} alt="" />
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-black dark:text-white/75">
                  Web Terminal
                </span>
                <span className="text-[13px] font-medium text-black dark:text-white/75">
                  Trade directly from browser
                </span>
              </div>
            </div>
            <Image className="h-4 w-4 cursor-pointer" src={globe} alt="" />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-center items-center">
          <Button
            className="cursor-pointer mt-3 md:mt-0 w-auto md:w-[400px] bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white"
            onClick={() => onOpenChange(false)}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  </div>
);

