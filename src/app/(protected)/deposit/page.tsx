"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TextAnimate } from "@/components/ui/text-animate";
import { Tabs } from "@/components/ui/tabs";
import { DepositDialog } from "@/components/deposit/DepositDialog";
import { CreditCardDialog } from "@/components/deposit/Epay/CreditCardDialog";
import { ManualDepositDialog } from "@/components/deposit/ManualDepositDialog";
import { Landmark } from "lucide-react";
import { store } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchAccessToken } from "@/store/slices/accessCodeSlice";
import { getLifetimeDeposit } from "@/services/depositLimitService";

type CryptoData = {
  symbol: string;
  name: string;
  blockchain: string;
  logoUrl: string;
  decimals: string;
};

type Cryptocurrency = {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  networks: {
    blockchain: string;
    logoUrl: string;
  }[];
};

const cardMaskStyle: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(212deg,_rgb(49,27,71)_0%,_rgb(20,17,24)_100%)",
  maskImage:
    "linear-gradient(100deg, rgba(0, 0, 0, 0.1) 10%, rgba(0, 0, 0, 0.4) 100%)",
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

export default function DepositPage() {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>(
    []
  );
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(
    null
  );
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [creditCardDialogOpen, setCreditCardDialogOpen] = useState(false);
  const [manualDepositDialogOpen, setManualDepositDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "crypto" | "bank">("all");
  const dispatch = useAppDispatch();
  const [lifetimeDeposit, setLifetimeDeposit] = useState<number>(0);

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
              networks: [
                {
                  blockchain: token.blockchain,
                  logoUrl: token.logoUrl,
                },
              ],
            });
          }
        });

        const cryptoList = Array.from(groupedMap.values());

        cryptoList.sort((a, b) => {
          const priority = (name: string) => {
            if (name === "USDT-TRC20") return -2;
            if (name === "USDT-ERC20") return -1;
            if (name === "USDT-BEP20") return 1;
            return 0;
          };

          return priority(a.name) - priority(b.name);
        });

        setCryptocurrencies(cryptoList);
      } catch (err) {
        console.error("Failed to fetch crypto data", err);
      }
    };

    fetchCrypto();
  }, []);

  useEffect(() => {
    const fetchDeposit = async () => {
      try {
        const email = store.getState().user.data?.email1;
        if (!email) {
          console.warn("Email not found in store, skipping lifetime deposit fetch");
          setLifetimeDeposit(0);
          return;
        }

        const freshToken = await dispatch(fetchAccessToken()).unwrap();
        if (!freshToken) {
          console.warn("Access token not available, skipping lifetime deposit fetch");
          setLifetimeDeposit(0);
          return;
        }

        const response = await getLifetimeDeposit({
          email,
          accessToken: freshToken,
        });
        setLifetimeDeposit(response);
        console.log("✅ Lifetime deposit fetched:", response);
      } catch (error) {
        console.error("Error fetching lifetime deposit:", error);
        // Set default value instead of leaving it undefined
        setLifetimeDeposit(0);
      }
    };

    fetchDeposit();
  }, [dispatch]);

  const handleCryptoSelect = useCallback((crypto: Cryptocurrency) => {
    setSelectedCrypto(crypto);
    

    if (crypto.name === "USDT TRC20 QR") {
      setManualDepositDialogOpen(true);
    } else {
      setDepositDialogOpen(true);
    }
  }, []);

  // Filter items based on active tab
  const filteredItems = useMemo(() => {
    if (activeTab === "all") {
      return [
        ...cryptocurrencies.map((crypto) => ({ type: "crypto", data: crypto })),
        { type: "bank", data: null },
      ];
    } else if (activeTab === "crypto") {
      return cryptocurrencies.map((crypto) => ({
        type: "crypto",
        data: crypto,
      }));
    } else {
      // bank tab
      return [{ type: "bank", data: null }];
    }
  }, [cryptocurrencies, activeTab]);

  return (
    <div className="flex flex-col dark:bg-[#01040D]">
      <main className="flex-1 overflow-y-auto px-2.5 md:px-0">
        {/* Page Title */}
        <div>
          <TextAnimate
            duration={0.2}
            animation="slideUp"
            once
            by="word"
            as="h1"
            className="text-[34px] leading-[30px] font-bold text-black dark:text-white/85"
          >
            Deposit Funds
          </TextAnimate>
          {/* <TextAnimate
            duration={0.2}
            animation="slideUp"
            once
            as="h2"
            by="word"
            className="mt-[19px] text-[20px] font-bold text-black dark:text-white/75">
            All Payment Methods
          </TextAnimate> */}
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => {
            if (
              value &&
              (value === "all" || value === "crypto" || value === "bank")
            ) {
              setActiveTab(value);
            }
          }}
          className="mb-[16px] mt-4"
        >
          <div className="flex items-center mt-3">
            <ToggleGroup
              type="single"
              value={activeTab}
              onValueChange={(value) => {
                if (
                  value &&
                  (value === "all" || value === "crypto" || value === "bank")
                ) {
                  setActiveTab(value);
                }
              }}
              className="p-2 relative rounded-[10px]"
            >
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
              <ToggleGroupItem value="bank" className="z-10 cursor-pointer">
                Bank Transfers
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Tabs>

        {/* Payment Cards */}
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            if (item.type === "crypto") {
              const crypto = item.data as Cryptocurrency;
              return (
                <MemoizedPaymentMethodCard
                  key={crypto.id}
                  onOpenNewAccount={() => handleCryptoSelect(crypto)}
                  icon={crypto.icon}
                  name={crypto.name}
                />
              );
            } else {
              return (
                <div
                  key="bank-card"
                  onClick={() => setCreditCardDialogOpen(true)}
                  className="group relative h-[180px] rounded-[15px] bg-[#fbfafd] dark:bg-[#0d0414] p-6 border dark:border-[#1D1825] border-gray-300 overflow-hidden cursor-pointer hover:bg-gradient-to-r from-white to-[#f4e7f6] text-semibold
                 dark:from-[#330F33] flex flex-col items-center text-center dark:to-[#1C061C]"
                >
                  <Landmark width={40} height={40} className="mt-5 mb-4" />
                  <h3 className="text-[18px] font-bold text-black dark:text-white">
                    Credit / Debit Cards
                  </h3>
                </div>
              );
            }
          })}
        </div>

        {/* Dialogs */}
        <DepositDialog
          open={depositDialogOpen}
          onOpenChange={setDepositDialogOpen}
          selectedCrypto={selectedCrypto}
          lifetimeDeposit={lifetimeDeposit}
        />
        <CreditCardDialog
          open={creditCardDialogOpen}
          onOpenChange={setCreditCardDialogOpen}
          lifetimeDeposit={lifetimeDeposit}
        />
        <ManualDepositDialog
          open={manualDepositDialogOpen}
          onOpenChange={setManualDepositDialogOpen}
          selectedCrypto={selectedCrypto}
          lifetimeDeposit={lifetimeDeposit}
        />
      </main>
    </div>
  );
}

function PaymentMethodCard({
  icon,
  name,
  onOpenNewAccount,
}: {
  icon: string;
  name: string;
  onOpenNewAccount: () => void;
}) {
  return (
    <div
      onClick={onOpenNewAccount}
      className="group relative h-auto rounded-[15px] bg-[#fbfafd] dark:bg-[#0d0414] p-6 border dark:border-[#1D1825] border-gray-300 overflow-hidden cursor-pointer hover:bg-gradient-to-r from-white to-[#f4e7f6]
           dark:from-[#330F33] dark:to-[#1C061C]"
    >
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

        {/* Show 1$ changer text */}
   {name === "USDT-TRC20" && (
  <p className="mt-2 px-3 py-2 text-red-700 text-xs transition-all duration-200 flex items-center justify-center
  group-hover:bg-transparent
  hover:bg-gradient-to-r from-white to-[#f4e7f6]
  dark:group-hover:bg-transparent dark:from-[#330F33] dark:to-[#1C061C]">
  <span className=" mr-2">⚠️</span>
  <span>Note: Add $1 extra when sending USDT via ERC20 to cover the network fee.</span>
</p>
)}

{name === "USDT-ERC20" && (
  <p className="mt-2 px-3 py-2 text-red-700 text-xs transition-all duration-200 flex items-center justify-center
  hover:bg-gradient-to-r from-white to-[#f4e7f6]
  dark:group-hover:bg-transparent dark:from-[#330F33] dark:to-[#1C061C]">
  <span className="mr-2">⚠️</span> Note: Add $1 extra when sending USDT via ERC20 to cover the network fee.
</p>
)}

      </div>
    </div>
  );
}

const MemoizedPaymentMethodCard = React.memo(PaymentMethodCard);
