"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image, { StaticImageData } from "next/image";
import { TextAnimate } from "@/components/ui/text-animate";
import { store } from "@/store";
// import mobileInHand from "@/assets/deposit/mobile-in-hand.png";
// import multiUser from "@/assets/icons/multi-user.png";
import arrowSideways from "@/assets/icons/arrow-sideways.png";
import TransferFundsDialog from "@/components/withdraw/TransferFundsDialog";
import { WithdrawPayoutDialog } from "@/components/withdraw/WithdrawPayoutDialog";
import { Lock } from "lucide-react"; // Import lock icon
import { toast } from "sonner";
import Link from "next/link";
import { Tabs } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type CryptoData = {
  symbol: string;
  name: string;
  exchangeRate: number;
  network: string;
  blockchain: string;
  logoUrl: string;
  decimals: string;
};

type Cryptocurrency = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  network: string;
  networks: { blockchain: string; logoUrl: string }[];
};

export default function WithdrawalDepositPage() {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>(
    []
  );
  const [transferMethod, setTransferMethod] = useState<
    "between_accounts" | "to_another_user"
  >("between_accounts");
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(
    null
  );

  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const isUnverified = store.getState().kyc.verificationStatus === "unverified";

  const [internalTransferDialogOpen, setInternalTransferDialogOpen] =
    useState(false);

  // To Do: add tabs back again when bank transfer methods are added
  const [activeTab, setActiveTab] = useState<"all" | "crypto" | "bank">("all");

  // Account details states
  useEffect(() => {
    if (isUnverified) {
      toast.error(
        "Please complete the Document verification process to enable withdrawals."
      );
    }
  }, [isUnverified]);

  // Fetch crypto list from API
  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const res = await axios.get("/api/crypto-currency");
        const tokens: CryptoData[] = res.data.data;

        const groupedMap = new Map<string, Cryptocurrency>();

        tokens.forEach((token) => {
          const id = token.name;
          if (!groupedMap.has(id)) {
            groupedMap.set(id, {
              id,
              name: token.name,
              symbol: token.symbol,
              icon: token.logoUrl,
              network: token.network,
              networks: [
                { blockchain: token.blockchain, logoUrl: token.logoUrl },
              ],
            });
          } else {
            const existing = groupedMap.get(id)!;
            if (
              !existing.networks.some((n) => n.blockchain === token.blockchain)
            ) {
              existing.networks.push({
                blockchain: token.blockchain,
                logoUrl: token.logoUrl,
              });
            }
          }
        });

        const groupedArray = Array.from(groupedMap.values());

        // Move USDT-BEP20 to the end:
        const idx = groupedArray.findIndex((c) => c.name === "USDT-BEP20");
        if (idx > -1) {
          const [usdtBep20] = groupedArray.splice(idx, 1);
          groupedArray.push(usdtBep20);
        }

        setCryptocurrencies(groupedArray);
      } catch (error) {
        console.error("Failed to fetch crypto data", error);
      }
    };

    fetchCrypto();
  }, []);

  const handleCryptoSelect = (crypto: Cryptocurrency) => {
    setSelectedCrypto(crypto);
    setDepositDialogOpen(true);
  };

  const handleTransferSelect = () => {
    setInternalTransferDialogOpen(true);
  };

  const cardMaskStyle: React.CSSProperties = {
    WebkitMaskImage:
      "linear-gradient(212deg, rgb(49,27,71) 0%, rgb(20,17,24) 100%)",
    maskImage:
      "linear-gradient(100deg, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.4) 100%)",
    borderRadius: "15px",
    opacity: 0.25,
    position: "absolute",
    padding: "1px",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: "none",
  };

  return (
    <div className="flex flex-col dark:bg-[#01040D] px-3 ">
      <main className="flex-1 overflow-y-auto">
        <div className="w-full">
          {/* Title */}

          <div className="flex relative items-center justify-between">
            <TextAnimate
              duration={0.2}
              animation="slideUp"
              once
              by="word"
              as="h1"
              className="text-[34px] font-bold text-black dark:text-white/85">
              Withdraw Funds
            </TextAnimate>

            <div className="relative mt-6 md:mt-0 md:absolute md:right-0">
              <Link
                href={isUnverified ? "#" : "/withdrawal/pending"}
                className={`flex items-center justify-center gap-2 rounded-[10px] py-3 px-3 text-[16px] leading-[14px] w-auto border-2 border-gray-300 dark:border-[#1D1825] bg-white text-black dark:bg-gradient-to-r from-[#FFFFFF] dark:from-[#110F17] to-[#f4e7f6] dark:to-[#1E1429] dark:text-white/75
                ${
                  isUnverified
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:brightness-95 cursor-pointer"
                }`}>
                Pending Withdrawals
                {isUnverified && <Lock className="w-5 h-5 dark:text-white" />}
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={(value) => {
              if (value && ["all", "crypto", "bank"].includes(value)) {
                setActiveTab(value as never);
              }
            }}
            className="mb-[16px]">
            <div className="flex items-center mt-3">
              <ToggleGroup
                type="single"
                value={activeTab}
                onValueChange={(value) => {
                  if (value && ["all", "crypto", "bank"].includes(value)) {
                    setActiveTab(value as never);
                  }
                }}
                className="p-2 relative rounded-[10px]">
                <div
                  style={cardMaskStyle}
                  className="border border-[#6545a7] dark:border-white/45"
                />
                <ToggleGroupItem value="all" className="z-10 cursor-pointer">
                  All
                </ToggleGroupItem>
                <ToggleGroupItem value="crypto" className="z-10 cursor-pointer">
                  Crypto
                </ToggleGroupItem>
                {/* <ToggleGroupItem value="bank" className="z-10 cursor-pointer">
                  Bank Transfers
                </ToggleGroupItem> */}
              </ToggleGroup>
            </div>
          </Tabs>

          {/* Payment Method Tiles */}
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* {(activeTab === "all" || activeTab === "bank") &&
              bankMethods.map((method) => (
                <PaymentTile
                  key={method.id}
                  icon={method.icon}
                  name={method.name}
                  onOpenNewAccount={pageMode === "withdraw" ? handleOpenWithdraw : () => {}}
                />
              ))} */}

            {(activeTab === "all" || activeTab === "crypto") &&
              cryptocurrencies.map((crypto) => (
                <PaymentTile
                  key={crypto.id}
                  icon={crypto.icon}
                  name={crypto.name}
                  unverified={isUnverified}
                  onOpenNewAccount={() => handleCryptoSelect(crypto)}
                />
              ))}
          </div>

          {activeTab === "all" && (
            <>
              <TextAnimate
                duration={0.2}
                animation="slideUp"
                once
                by="word"
                as="h1"
                className="text-[#000000] dark:text-[#FFFFFFBF]  text-center text-[20px] my-9 font-semibold">
                Transfer between accounts
              </TextAnimate>
              <div className="mt-4 grid gap-3 md:grid-cols-2 grid-cols-1">
                <TransferAmountCard
                  icon={arrowSideways}
                  name="Between your accounts"
                  unverified={isUnverified}
                  onOpenNewAccount={() => {
                    setTransferMethod("between_accounts");
                    handleTransferSelect();
                  }}
                />
                {/* <TransferAmountCard
                  icon={multiUser}
                  name="To another user"
                  unverified={isUnverified}
                  onOpenNewAccount={() => {
                    setTransferMethod("to_another_user");
                    handleTransferSelect();
                  }}
                /> */}
              </div>
            </>
          )}

          {/* Bonus section */}
          {/* <div className="mt-[35px] mb-4 rounded-[15px] bg-[#FBFAFC] dark:bg-black border dark:border-[#1D1825] border-gray-300 px-14 overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-[22px] font-medium text-black dark:text-white">
                Trade with <span className="text-[#A35CA2]">10%</span> deposit
                bonus
              </h3>
              <Image
                src={mobileInHand}
                alt="Mobile App"
                className="object-contain w-[125px] h-[143px]"
              />
            </div>
          </div> */}

          {/* Deposit Dialog */}
          <WithdrawPayoutDialog
            open={depositDialogOpen}
            onOpenChange={setDepositDialogOpen}
            selectedCrypto={selectedCrypto}
          />
          <TransferFundsDialog
            open={internalTransferDialogOpen}
            onOpenChange={setInternalTransferDialogOpen}
            method={transferMethod}
          />
        </div>
      </main>
    </div>
  );
}

/* PaymentTile like DepositPage */
function PaymentTile({
  icon,
  name,
  unverified,
  onOpenNewAccount,
}: {
  icon: string;
  name: string;
  unverified: boolean;
  onOpenNewAccount: () => void;
}) {
  return (
    <div
      onClick={unverified ? undefined : onOpenNewAccount}
      className={`group relative h-auto rounded-[15px] bg-[#fbfafd] dark:bg-[#0d0414] p-6 border dark:border-[#1D1825] border-gray-300 overflow-hidden ${
        unverified
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-gradient-to-r from-white to-[#f4e7f6] dark:from-[#330F33] dark:to-[#1C061C]"
      }`}>
      {unverified && (
        <div className="absolute right-5 top-5 flex items-center justify-center z-10 rounded-[15px]">
          <div className="flex flex-col items-center text-white">
            <Lock className="w-6 h-6 mb-2 dark:text-white text-black" />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center mt-2 mb-4 text-center">
        <Image
          className="h-10 w-10"
          src={icon}
          alt={name}
          width={40}
          height={40}
        />
        <h3 className="mt-4 text-[18px] font-bold text-black dark:text-white">
          {name}
        </h3>
        {unverified && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">
            Verification required
          </p>
        )}
      </div>
    </div>
  );
}

/* Updated TransferAmountCard with lock icon */
function TransferAmountCard({
  icon,
  name,
  unverified,
  onOpenNewAccount,
}: {
  icon: string | StaticImageData;
  name: string;
  unverified: boolean;
  onOpenNewAccount: () => void;
}) {
  return (
    <div
      onClick={unverified ? undefined : onOpenNewAccount}
      className={`group relative rounded-lg bg-[#fbfafd] 
                 dark:bg-[#0d0414] p-6 border dark:border-[#1D1825] 
                 border-gray-300 overflow-hidden ${
                   unverified
                     ? "cursor-not-allowed opacity-50"
                     : "cursor-pointer"
                 }`}>
      {unverified && (
        <div className="absolute right-5 top-5 flex items-center justify-center z-10 rounded-[15px]">
          <div className="flex flex-col items-center text-white">
            <Lock className="w-6 h-6 mb-2 dark:text-white text-black" />
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        <Image className="h-8 w-8 shrink-0" src={icon} alt={name} />
        <div>
          <h3 className="text-lg font-medium text-[#000000] dark:text-[#FFFFFF]">
            {name}
          </h3>
          {unverified && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              Verification required
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
