"use client";

import { ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Candle from "@/assets/icons/candle.png";
import linearDots from "@/assets/icons/linear-dots.png";
import linearDotsDark from "@/assets/icons/linear-dots-dark.png";
import arrowDepositBlack from "@/assets/icons/arrowDeposit.svg";
import arrowDown from "@/assets/icons/arrow-down.png";
import { useTheme } from "next-themes";
import arrowTopLeft from "@/assets/icons/arrow-top-left.png";
import withdrawBlack from "@/assets/icons/withdrawBlack.svg";
import transfer from "@/assets/icons/transfer.png";
import type { StaticImageData } from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChangePasswordDialog } from "./changePassword-dialogBox";
import { RenameAccountDialog } from "./renameaccount-dialogBox";

import { motion, AnimatePresence } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";
import { useRouter } from "next/navigation";
import ChangeLeverageDialouge from "./changeLeverageDialouge";
import TradeNowDialouge from "./tradeNow-dialouge";
import TransferFundsDialog from "../withdraw/TransferFundsDialog";
import { TpAccountSnapshot } from "@/types/user-details";
import { AccountInfoDialog } from "../AccountInfoDialog";
import { useDispatch } from "react-redux";
import { refreshMt5AccountProfile } from "@/store/slices/mt5AccountSlice";
import { TopUpDialog } from "./topUp-dialogBox";

const AccountDetails = ({
  accountId,
  accountType,
  platformName,
  accountDetails,
  isReady,
}: {
  accountId: number;
  accountType?: string;
  platformName: string;
  accountDetails: TpAccountSnapshot;
  isReady?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inViewRef = useRef<boolean>(true);
  const inFlightRef = useRef<boolean>(false);
  const failureCountRef = useRef<number>(0);

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [tradeNowDialog, setTradeNowDialog] = useState(false);
  const [accountInfoDialogOpen, setAccountInfoDialogOpen] = useState(false);
  const [renameAccountDialog, setRenameAccountDialogOpen] = useState(false);
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  

  // Calculate values from account details with correct relationships:
  // Equity = Balance + P/L
  // Available for Withdrawal = Equity
  // P/L = Equity - Balance (if not directly provided)
  
  const bal = parseFloat(accountDetails.balance || "0");
  const eq = parseFloat(accountDetails.equity || "0");
  
  // Calculate P/L: If equity is available, P/L = Equity - Balance
  // Otherwise, use closed_pnl if available
  const pnl = accountDetails.closed_pnl !== undefined 
    ? parseFloat(accountDetails.closed_pnl) 
    : (eq - bal); // Equity - Balance
  
  // Ensure relationships: Equity = Balance + P/L
  const equity = eq || (bal + pnl);
  
  // Available for Withdrawal = Equity (per user requirement)
  const availableForWithdrawal = equity;
  
  const balance = `$${bal.toFixed(2)}`;
  const equityFormatted = `${equity.toFixed(2)}`;
  const freeMargin = `${parseFloat(accountDetails.margin_free || "0").toFixed(2)}`;
  const credit = `${parseFloat(accountDetails.credit || "0").toFixed(2)}`;
  const leverage = `1:${accountDetails.leverage || 1000}`;
  const availableForWithdrawalFormatted = `$${availableForWithdrawal.toFixed(2)}`;

  // Calculate P/L percentage based on initial balance (balance - P/L)
  const initialBalance = bal - pnl;
  const pnlPercentage = initialBalance !== 0 ? (pnl / initialBalance) * 100 : 0;
  const isProfit = pnl >= 0;

  const buttonAnimation = {
    initial: { x: 40, opacity: 0 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: "easeInOut" as const },
    },
    exit: {
      opacity: 0.5,
      x: 40,
      transition: { duration: 0.05, ease: "easeInOut" as const },
    },
  };

  const maskStyle: React.CSSProperties = {
    WebkitMaskImage:
      "linear-gradient(277deg, rgba(255, 255, 255, 0.25) 10%, rgba(255, 255, 255, 0.1) 100%)",
    maskImage:
      "linear-gradient(277deg, rgba(255, 255, 255, 0.25) 10%, rgba(255, 255, 255, 0.1) 100%)",
    borderRadius: "15px",
    opacity: 0.3,
    inset: 0,
    overflow: "visible",
    position: "absolute",
    zIndex: 0,
  };

  const router = useRouter();
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  // Ensure numbers align vertically across rows (tabular figures)
  const numericStyle: React.CSSProperties = { fontVariantNumeric: 'tabular-nums' };
  
  // Determine if account is Demo
  const isDemoAccount = accountType?.toLowerCase() === 'demo' || accountDetails?.account_type_requested?.toLowerCase() === 'demo';

  // Observe visibility of this account row
  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        inViewRef.current = entry.isIntersecting;
      }
    }, { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // DISABLED: Poll account profile for live updates - polling stopped per user request
  // useEffect(() => {
  //   let timer: any;
  //   const scheduleNext = (delay: number) => {
  //     timer = setTimeout(tick, delay);
  //   };
  //   const tick = () => {
  //     const visibleTab = typeof document !== 'undefined' ? document.visibilityState === 'visible' : true;
  //     if (!visibleTab || !inViewRef.current || inFlightRef.current) {
  //       scheduleNext(isReady ? 5000 : 500);
  //       return;
  //     }
  //     inFlightRef.current = true;
  //     // @ts-ignore dispatch thunk
  //     console.log(`[MT5] ⏩ Polling profile for login=${accountDetails?.acc} (isReady=${Boolean(isReady)})`);
  //     (dispatch as any)(refreshMt5AccountProfile(Number(accountDetails?.acc)))
  //       .then(() => {
  //         failureCountRef.current = 0;
  //       })
  //       .catch((error: any) => {
  //         // Don't count timeouts as failures - they're expected for accounts still initializing
  //         const isTimeout = error?.message?.includes('timeout') || 
  //                          error?.payload?.includes('timeout') ||
  //                          error?.code === 'ECONNABORTED';
  //         
  //         if (!isTimeout) {
  //           failureCountRef.current += 1;
  //         }
  //         
  //         // Only log non-timeout errors
  //         if (!isTimeout && failureCountRef.current <= 3) {
  //           console.log(`[MT5] Profile refresh failed for login=${accountDetails?.acc}:`, error?.message || error?.payload || 'Unknown error');
  //         }
  //       })
  //       .finally(() => {
  //         inFlightRef.current = false;
  //         // Aggressive polling until profile is ready
  //         scheduleNext(isReady ? 5000 : 500);
  //       });
  //   };
  //   // Run immediately if not ready so the loader triggers an instant fetch
  //   if (!isReady) {
  //     tick();
  //   } else {
  //     scheduleNext(5000);
  //   }
  //   return () => { if (timer) clearTimeout(timer); };
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isReady, accountDetails?.acc]);

  return (
    <div ref={rootRef} className="rounded-[15px] p-[15px] pl-2 bg-[#fbfafd] dark:bg-gradient-to-r dark:from-[#110F17] dark:to-[#1E1429] mb-1.5 relative flex flex-col gap-5">
      <div
        style={maskStyle}
        className="border-2 border-black/50 dark:border-white/50 pointer-events-none"
      />
      {/* Header with account details */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 lg:gap-0 xl:gap-2">
          <div className="flex items-center gap-2.5 md:min-w-45">
            <h3 className={`text-[28px] font-bold tracking-tighter leading-8`}>
              {balance}
            </h3>
            <p className="font-semibold opacity-75 text-xs -tracking-[0.03em]">
              PnL
              <span className="ml-1 tracking-tighter font-bold dark:text-[#ff4d4d] text-red-600">
                <span
                  className={`ml-1 tracking-tighter font-bold ${
                    isProfit
                      ? "text-[#8CBD79] dark:text-[#8CBD79]"
                      : "text-red-600 dark:text-[#ff4d4d]"
                  }`}>
                  {pnl.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
                </span>
              </span>
            </p>
          </div>

          {/* Show these only on MD Account Details*/}
          <div className="hidden md:flex items-center md:gap-1 lg:gap-1 xl:gap-2.5">
            {[
              accountType,
              accountDetails?.account_type_requested, // Package from database (Standard/Pro)
              platformName,
              accountDetails?.tp_account_scf.cf_1479, // Name on Account from database
              accountId,
            ]
              .filter((text) => {
                // Only filter out undefined, null, empty strings - but show valid values even if they're "null" string
                if (text === undefined || text === null) return false;
                const str = String(text).trim();
                return str !== "";
              })
              .map((text, index, arr) => (
                <div
                  className="flex bg-[#9F8ACF]/15 p-[5px] rounded-[5px] font-semibold text-black/75 dark:text-white/75 tracking-tighter text-[13px] leading-[1.1em]"
                  key={index}>
                  {index === arr.length - 1 ? (
                    <>
                      Account ID: #
                      <span className="text-[#000000] font-bold dark:text-[#FFFFFF]">
                        {text}
                      </span>
                    </>
                  ) : (
                    String(text)
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* buttons for actions */}
        <div className="flex items-center gap-1.5">
          {/* Always visible (both mobile + desktop) */}
          <Button
            imageSrc={Candle}
            text="Trade Now"
            onClick={() => setTradeNowDialog(true)}
          />

          {/* Show these on xl */}
          <div className="hidden xl:flex items-center gap-2.5">
            <AnimatePresence>
              {expanded && !isDemoAccount && (
                <motion.div
                  key="deposit"
                  variants={buttonAnimation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Button
                    ghost
                    imageSrc={theme === "dark" ? arrowDown : arrowDepositBlack}
                    text="Deposit"
                    onClick={() => router.push("/deposit")}
                  />
                </motion.div>
              )}
              {expanded && !isDemoAccount && (
                <motion.div
                  key="withdrawal"
                  variants={buttonAnimation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Button
                    ghost
                    imageSrc={theme === "dark" ? arrowTopLeft : withdrawBlack}
                    text="Withdrawal"
                    onClick={() => router.push("/withdrawal")}
                  />
                </motion.div>
              )}
              {expanded && isDemoAccount && (
                <motion.div
                  key="topUp"
                  variants={buttonAnimation}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Button
                    ghost
                    imageSrc={theme === "dark" ? arrowDown : arrowDepositBlack}
                    text="Top Up"
                    onClick={() => setTopUpDialogOpen(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Image
                  className="h-6 w-6 cursor-pointer"
                  src={theme === "dark" ? linearDots : linearDotsDark}
                  alt="Menu"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="font-medium border-x border-b border-t-0 rounded-b-[10px] rounded-t-none bg-white dark:bg-black border-[#9F8BCF]/25 px-[25px] py-2.5 flex flex-col gap-[5px] text-sm text-black/50 dark:text-white/50 w-[200px] mt-4.5"
                align="end"
              >
                <DropdownMenuItem onClick={() => setChangePasswordOpen(true)}>
                  Change password
                </DropdownMenuItem>
                <div className="w-full h-px bg-black/5 dark:bg-white/5" />
                <DropdownMenuItem onClick={() => setOpenDialog(true)}>
                  Change leverage
                </DropdownMenuItem>
                <div className="w-full h-px bg-black/5 dark:bg-white/5" />
                <DropdownMenuItem
                  onClick={() => setRenameAccountDialogOpen(true)}
                >
                  Rename account
                </DropdownMenuItem>
                <div className="w-full h-px bg-black/5 dark:bg-white/5" />
                <DropdownMenuItem
                  onClick={() => setAccountInfoDialogOpen(true)}
                >
                  Account Information
                </DropdownMenuItem>
                <div className="w-full h-px bg-black/5 dark:bg-white/5" />
                <DropdownMenuItem onClick={() => setTransferDialogOpen(true)}>
                  Transfer funds
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Toggle chevron (only desktop) */}
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex dark:text-white text-black cursor-pointer transition-all duration-200 ease-in-out ${
              expanded ? "rotate-180" : ""
            }`}
          >
            <ChevronDown size={20} />
          </button>
        </div>
      </div>

      {/* Details section */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expanded-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="flex flex-col md:flex-col xl:flex-row justify-between items-start">
              {/* Show these only on mobile Account Details*/}
              <div className="flex md:hidden items-center gap-1 mb-3">
                {[
                  accountType,
                  accountDetails?.account_type_requested, // Package from database (Standard/Pro)
                  platformName,
                  accountDetails?.tp_account_scf.cf_1479, // Name on Account from database
                  accountId,
                ]
                  .filter((text) => {
                    // Only filter out undefined, null, empty strings - but show valid values
                    if (text === undefined || text === null) return false;
                    const str = String(text).trim();
                    return str !== "";
                  })
                  .map((text, index, arr) => (
                    <div
                      className="flex bg-[#9F8ACF]/15 p-[4px] rounded-[5px] font-semibold text-black/75 dark:text-white/75 tracking-tighter text-[12.5px] md:text-[13px] leading-[1.1em]"
                      key={index}
                    >
                      {index === arr.length - 1 ? (
                        <>
                          Account ID: #
                          <span className="text-[#000000] font-bold dark:text-[#FFFFFF]">
                            {text}
                          </span>
                        </>
                      ) : (
                        String(text).charAt(0).toUpperCase() +
                        String(text).slice(1)
                      )}
                    </div>
                  ))}
              </div>
              {/* Black Box */}
              <div className="dark:bg-[#01040D] bg-[#f3f3f3] flex flex-col md:flex-row xl:w-auto p-6.25 rounded-[15px] gap-4 md:gap-16.75 items-center font-semibold w-full">
                <div className="flex flex-col gap-1.25 w-full md:w-[211px]">
                  <div className="flex justify-between w-full items-center">
                    <p className="text-xs opacity-75">Actual Leverage</p>
                    <div className="text-sm w-24 text-right" style={numericStyle}>{leverage}</div>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <p className="text-xs opacity-75">Free Margin</p>
                    <div className="text-sm w-24 text-right" style={numericStyle}>{freeMargin}</div>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <p className="text-xs opacity-75">Equity</p>
                    <div className="text-sm w-24 text-right" style={numericStyle}>{equityFormatted}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.25 w-full md:w-[211px]">
                  <div className="flex justify-between w-full items-center">
                    <p className="text-xs opacity-75">
                      Available for Withdrawal
                    </p>
                    <div className="text-sm w-24 text-right" style={numericStyle}>{availableForWithdrawalFormatted}</div>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <p className="text-xs opacity-75">Balance</p>
                    <div className="text-sm w-24 text-right" style={numericStyle}>{balance}</div>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <p className="text-xs opacity-75">Credit</p>
                    <div className="text-sm w-24 text-right" style={numericStyle}>{credit}</div>
                  </div>
                </div>
              </div>

              {/* Server / MT Login */}
              <div className="md:w-[350px] w-full flex flex-col gap-1.25 text-sm font-semibold pt-[15px] md:pt-[25px]">
                <div className="flex items-center">
                  <p className="opacity-50 w-20">Server:</p>
                  <div className="opacity-85">ZuperiorFX-Limited</div>
                  <CopyButton text={`ZuperiorFX-Limited`} className="ml-auto" />
                </div>

                <div className="flex items-center ">
                  <p className="opacity-50 w-20">MT Login:</p>
                  <>
                    <p className="opacity-85">{accountDetails?.acc}</p>
                    <CopyButton
                      text={String(accountDetails?.acc) || ""}
                      className="ml-auto"
                    />
                  </>
                </div>
              </div>

              
              {/* DropDown for mobile */}
              <div className="xl:hidden flex items-center gap-2.5 pt-2">
                <AnimatePresence>
                  {expanded && !isDemoAccount && (
                    <motion.div
                      key="deposit"
                      variants={buttonAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Button
                        ghost
                        imageSrc={theme === "dark" ? arrowDown : arrowDepositBlack}
                        text="Deposit"
                        onClick={() => router.push("/deposit")}
                      />
                    </motion.div>
                  )}
                  {expanded && !isDemoAccount && (
                    <motion.div
                      key="withdrawal"
                      variants={buttonAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Button
                        ghost
                        imageSrc={arrowTopLeft}
                        text="Withdrawal"
                        onClick={() => router.push("/withdrawal")}
                      />
                    </motion.div>
                  )}
                  {expanded && isDemoAccount && (
                    <motion.div
                      key="topUp"
                      variants={buttonAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Button
                        ghost
                        imageSrc={theme === "dark" ? arrowDown : arrowDepositBlack}
                        text="Top Up"
                        onClick={() => setTopUpDialogOpen(true)}
                      />
                    </motion.div>
                  )}
                  {expanded && !isDemoAccount && (
                    <motion.div
                      key="transfer"
                      variants={buttonAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Button
                        ghost
                        imageSrc={transfer}
                        text="Transfer"
                        onClick={() => setTransferDialogOpen(true)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChangePasswordDialog
        accountNumber={accountId}
        open={changePasswordOpen}
        onOpen={setChangePasswordOpen}
      />

      <RenameAccountDialog
        open={renameAccountDialog}
        onOpen={setRenameAccountDialogOpen}
      />

      <ChangeLeverageDialouge
        open={openDialog}
        onOpenChange={setOpenDialog}
        accountNumber={accountId.toString()}
        currency={"USD"} // To Do: think what to do about currency ---- static for now
      />

      <TradeNowDialouge
        tradeNowDialog={tradeNowDialog}
        setTradeNowDialog={setTradeNowDialog}
        server={"ZuperiorFX-Limited"}
        mtLogin={String(accountDetails?.acc) || ""}
      />

      <TransferFundsDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        method="between_accounts"
      />

      <AccountInfoDialog
        open={accountInfoDialogOpen}
        onOpenChange={setAccountInfoDialogOpen}
        account={accountDetails}
      />

      {isDemoAccount && (
        <TopUpDialog
          accountNumber={Number(accountDetails?.acc) || accountId}
          open={topUpDialogOpen}
          onOpenChange={setTopUpDialogOpen}
        />
      )}

    </div>
  );
};

const Button = ({
  ghost = false,
  imageSrc,
  onClick,
  text,
}: {
  ghost?: boolean;
  imageSrc?: string | StaticImageData;
  onClick?: () => void;
  text: string;
}) => {
  return (
    <button
      className={`flex rounded-[10px]  items-center md:gap-1 py-2 px-2 ${
        ghost
          ? "border-[1.5px] border-[#9F8BCF]/25 text-black dark:text-white/75"
          : "bg-gradient-to-tr to-[#9F8BCF] from-[#6242A5] text-white/75"
      } font-semibold text-sm leading-[14px] cursor-pointer`}
      onClick={onClick}
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt="text"
          height={24}
          width={24}
          className="w-5 h-5 md:w-5 md:h-5"
        />
      )}
      <span className="text-xs md:text-sm leading-[14px]">{text}</span>
    </button>
  );
};

export default AccountDetails;
