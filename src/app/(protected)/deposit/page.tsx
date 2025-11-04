"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import { TextAnimate } from "@/components/ui/text-animate";
import { DepositDialog } from "@/components/deposit/DepositDialog";
import { ManualDepositDialog } from "@/components/deposit/ManualDepositDialog";
import { store } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchAccessToken } from "@/store/slices/accessCodeSlice";
import { getLifetimeDeposit } from "@/services/depositLimitService";
import { CardLoader } from "@/components/ui/loading";

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

export default function DepositPage() {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>(
    []
  );
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(
    null
  );
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [manualDepositDialogOpen, setManualDepositDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [lifetimeDeposit, setLifetimeDeposit] = useState<number>(0);
  const [isLoadingCrypto, setIsLoadingCrypto] = useState(true);

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        setIsLoadingCrypto(true);
        const res = await axios.get("/api/crypto-currency");
        const tokens: CryptoData[] = res.data.data;

        const groupedMap = new Map<string, Cryptocurrency>();

        tokens.forEach((token) => {
          const id = token.name;
          // Only include TRC20 (both regular and QR versions)
          if (token.name === "USDT-TRC20" || token.name === "USDT TRC20 QR") {
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
          }
        });

        const cryptoList = Array.from(groupedMap.values());

        // Sort: TRC20 QR first, then TRC20
        cryptoList.sort((a, b) => {
          const priority = (name: string) => {
            if (name === "USDT TRC20 QR") return -2;
            if (name === "USDT-TRC20") return -1;
            return 0;
          };

          return priority(a.name) - priority(b.name);
        });

        setCryptocurrencies(cryptoList);
      } catch (err) {
        console.error("Failed to fetch crypto data", err);
      } finally {
        setIsLoadingCrypto(false);
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

  // Filter items - show only USDT TRC20 crypto options
  const filteredItems = useMemo(() => {
    return cryptocurrencies.map((crypto) => ({ type: "crypto", data: crypto }));
  }, [cryptocurrencies]);

  // Show loading state while fetching crypto data
  if (isLoadingCrypto) {
    return <CardLoader message="Loading deposit options..." />;
  }

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

        {/* Payment Cards - USDT TRC20 Only */}
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const crypto = item.data as Cryptocurrency;
            return (
              <MemoizedPaymentMethodCard
                key={crypto.id}
                onOpenNewAccount={() => handleCryptoSelect(crypto)}
                icon={crypto.icon}
                name={crypto.name}
              />
            );
          })}
        </div>

        {/* Dialogs - USDT TRC20 Only */}
        <DepositDialog
          open={depositDialogOpen}
          onOpenChange={setDepositDialogOpen}
          selectedCrypto={selectedCrypto}
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
      </div>
    </div>
  );
}

const MemoizedPaymentMethodCard = React.memo(PaymentMethodCard);
