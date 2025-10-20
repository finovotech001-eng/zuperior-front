import { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { CopyButton } from "../CopyButton";
import mt5 from "@/assets/mt5.png";
import tradingView from "@/assets/icons/tradingView.svg";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface TradeDialogProps {
  tradeNowDialog: boolean;
  setTradeNowDialog: (isOpen: boolean) => void;
  server: string;
  mtLogin: string;
}

const TradeNowDialouge = ({
  tradeNowDialog,
  setTradeNowDialog,
  server,
  mtLogin,
}: TradeDialogProps) => {
  const [step, setStep] = useState(1);

  const resetAllStates = useCallback(() => {
    setStep(1);
  }, []);

  return (
    <Dialog
      open={tradeNowDialog}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetAllStates();
        }
        setTradeNowDialog(isOpen);
      }}
    >
      <DialogContent className="border-2 border-transparent p-6 text-black dark:text-white/75 rounded-[18px] flex flex-col items-center w-full bg-white [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border ">
        <div className="w-full flex flex-col">
          <div className="flex items-center justify-between w-full mb-6">
            <DialogTitle className="text-lg font-semibold dark:text-white/75 ">
              Trade
            </DialogTitle>
          </div>

          {/* Step 1 */}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Exness terminal */}
                <div
                  onClick={() => setStep(3)}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full rounded-lg border-2 border-gray-300 dark:border-[#1D1825] p-4 cursor-pointer bg-gradient-to-r from-[#FFFFFF] dark:from-[#110F17] to-[#f4e7f6] dark:to-[#1E1429]"
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <Image
                      src={tradingView}
                      alt="MetaTrader"
                      width={35}
                      height={35}
                    />
                    <div className="flex flex-col items-start">
                      <span className="font-medium dark:text-white/75">
                        Trading View terminal
                      </span>
                      <span className="text-sm dark:text-white/75">
                        Trade directly from your browser
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="shrink-0 self-end sm:self-auto" />
                </div>

                <Link
                  href={"/terminal"}
                  target="_blank"
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full rounded-lg border-2 border-gray-300 dark:border-[#1D1825] p-4 cursor-pointer bg-gradient-to-r from-[#FFFFFF] dark:from-[#110F17] to-[#f4e7f6] dark:to-[#1E1429]"
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <div className="h-10 w-10 flex items-center justify-center rounded-md">
                      <Image
                        src={mt5}
                        alt="MetaTrader"
                        width={35}
                        height={35}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium dark:text-white/75">
                        Trade from web terminal
                      </span>
                      <span className="text-sm dark:text-white/75">
                        Trade securely and efficiently via your web browser
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="shrink-0 self-end sm:self-auto" />
                </Link>

                {/* MetaTrader 5 */}

                <div
                  onClick={() => setStep(2)}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full rounded-lg border-2 border-gray-300 dark:border-[#1D1825] p-4 cursor-pointer bg-gradient-to-r from-[#FFFFFF] dark:from-[#110F17] to-[#f4e7f6] dark:to-[#1E1429]"
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <div className="h-10 w-10 flex items-center justify-center rounded-md">
                      <Image
                        src={mt5}
                        alt="MetaTrader"
                        width={35}
                        height={35}
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium dark:text-white/75">
                        MetaTrader 5
                      </span>
                      <span className="text-sm dark:text-white/75">
                        Download and install the MT5 platform
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="shrink-0 self-end sm:self-auto" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Back button */}
                <div
                  onClick={() => setStep(1)}
                  className="flex items-center text-sm text-gray-600 dark:text-white/70 mb-4 cursor-pointer"
                >
                  <ArrowLeft /> Back
                </div>

                {/* MetaTrader Card 1 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border-2 border-gray-300 dark:border-[#1D1825] p-4 bg-gradient-to-r from-[#FFFFFF] dark:from-[#110F17] to-[#f4e7f6] dark:to-[#1E1429]">
                  <div className="flex items-center gap-3 mb-3 sm:mb-0">
                    <Image
                      src={mt5}
                      alt="MetaTrader 5"
                      width={35}
                      height={35}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">MetaTrader 5</span>
                      <span className="text-sm dark:text-white/60">
                        Download terminal
                      </span>
                    </div>
                  </div>
                </div>

                {/* How to connect */}
                <div className="rounded-lg border-2 border-gray-300 dark:border-[#1D1825] p-4 space-y-5 bg-gradient-to-r from-[#FFFFFF] dark:from-[#110F17] to-[#f4e7f6] dark:to-[#1E1429]">
                  <p className="text-sm dark:text-white/70">
                    How to connect to MetaTrader
                  </p>

                  {/* Server */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-2">
                    <span>Server:</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono">{server}</span>
                      <CopyButton text={server} className="ml-auto" />
                    </div>
                  </div>

                  {/* MT login */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-2">
                    <span>MT login:</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono">{mtLogin}</span>
                      <CopyButton text={mtLogin} className="ml-auto" />
                    </div>
                  </div>

                  {/* Password info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-2">
                    <span>Password:</span>
                    <span className="text-sm text-gray-500 dark:text-white/60">
                      Use your trading account password
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Back button */}
                <div
                  onClick={() => setStep(1)}
                  className="flex items-center text-sm text-gray-600 dark:text-white/70 mb-4 cursor-pointer"
                >
                  <ArrowLeft /> Back
                </div>

                {/* How to connect */}
                <div className="rounded-lg border-2 border-gray-300 dark:border-[#1D1825] p-4 space-y-5 bg-gradient-to-r from-[#FFFFFF] dark:from-[#110F17] to-[#f4e7f6] dark:to-[#1E1429]">
                  <p className="text-md text-purple-400 font-semibold text-center">
                    Coming Soon
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeNowDialouge;
