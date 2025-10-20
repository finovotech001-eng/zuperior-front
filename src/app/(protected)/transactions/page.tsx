"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchAccessToken } from "@/store/slices/accessCodeSlice";
import { useAppDispatch } from "@/store/hooks";
import {
  getTransactions,
  Withdraw,
  Deposit,
  Bonus,
} from "@/store/slices/transactionsSlice";
import { format, addDays, subDays } from "date-fns";

import { TransactionsHeader } from "@/components/transactions/TransactionsHeader";
import { TransactionsToolbar } from "@/components/transactions/TransactionToolbar";
import { TransactionsTable } from "@/components/transactions/TransactionTable";

const cardMaskStyle: React.CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(212deg, rgb(49,27,71) 0%, rgb(20,17,24) 100%)",
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

export default function TransactionsPage() {
  const dispatch = useAppDispatch();

  const accounts = useSelector(
    (state: RootState) =>
      state.accounts.data.map((account) => ({
        id: account.acc.toString(),
        type: account.account_type,
      })) || []
  );

  const [activeTab, setActiveTab] = useState<
    "all" | "deposits" | "withdrawals"
  >("all");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingTx, setLoadingTx] = useState(false);
  // const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [transactionsData, setTransactionsData] = useState<{
    deposits: Deposit[];
    withdrawals: Withdraw[];
    bonuses: Bonus[];
    status?: string;
    MT5_account?: string;
  }>({
    deposits: [],
    withdrawals: [],
    bonuses: [],
    status: "",
    MT5_account: "",
  });

  type DateRange = { from: Date | undefined; to?: Date };

  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const getAccountTransactions = async (
    accountId: string,
    from?: Date,
    to?: Date
  ) => {
    setLoadingTx(true);
    setSelectedAccountId(accountId);
    try {
      const freshToken = await dispatch(fetchAccessToken()).unwrap();
      let start_date, end_date;
      if (from && to) {
        start_date = format(subDays(from, 1), "yyyy-MM-dd");
        end_date = format(addDays(to, 1), "yyyy-MM-dd");
      }
      const result = await dispatch(
        getTransactions({
          access_token: freshToken,
          account_number: accountId,
          start_date,
          end_date,
        })
      ).unwrap();

      setTransactionsData({
        deposits: result.deposits || [],
        withdrawals: result.withdrawals || [],
        bonuses: result.bonuses || [],
        status: result.status,
        MT5_account: result.MT5_account || accountId,
      });
    } catch {
      setTransactionsData({
        deposits: [],
        withdrawals: [],
        bonuses: [],
        status: "",
        MT5_account: accountId,
      });
    }
    setLoadingTx(false);
  };

  // Table data logic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tableData: any[] = [];
  if (activeTab === "all") {
    tableData = [
      ...transactionsData.deposits.map((tx) => ({
        ...tx,
        type: "Deposit",
        status: transactionsData.status || "Success",
        account_id: transactionsData.MT5_account || tx.login,
      })),
      ...transactionsData.withdrawals.map((tx) => ({
        ...tx,
        type: "Withdraw",
        status: transactionsData.status || "Success",
        account_id: transactionsData.MT5_account || tx.login,
      })),
    ];
  } else if (activeTab === "deposits") {
    tableData = transactionsData.deposits.map((tx) => ({
      ...tx,
      type: "Deposit",
      status: transactionsData.status || "Success",
      account_id: transactionsData.MT5_account || tx.login,
    }));
  } else {
    tableData = transactionsData.withdrawals.map((tx) => ({
      ...tx,
      type: "Withdraw",
      status: transactionsData.status || "Success",
      account_id: transactionsData.MT5_account || tx.login,
    }));
  }

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    tableData = tableData.filter(
      (tx) =>
        (tx.depositID || tx.account_id || "")
          .toString()
          .toLowerCase()
          .includes(term) ||
        ((tx.login || "") as string).toLowerCase().includes(term)
    );
  }

  tableData.sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseTime = (t: any) => {
      if (!t) return 0;
      const num = Number(t);
      if (!isNaN(num)) {
        return num < 1e12 ? num * 1000 : num;
      }
      return new Date(t).getTime() || 0;
    };
    return parseTime(b.open_time) - parseTime(a.open_time);
  });

  return (
    <div className="flex flex-col  dark:bg-[#01040D]">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto dark:bg-[#01040D]">
          <div>
            <TransactionsHeader
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              cardMaskStyle={cardMaskStyle}
            />
            <div className="pt-[15px] overflow-x-hidden text-black dark:text-white flex flex-col gap-[15px]">
              <div className="rounded-[15px] dark:bg-gradient-to-r dark:from-[#15101d] from-[#181422] to-[#181422] dark:to-[#181422] border border-black/10 dark:border-none p-3">
                <TransactionsToolbar
                  accounts={accounts}
                  selectedAccountId={selectedAccountId}
                  setSelectedAccountId={setSelectedAccountId}
                  getAccountTransactions={getAccountTransactions}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  calendarOpen={calendarOpen}
                  setCalendarOpen={setCalendarOpen}
                  tempRange={tempRange}
                  setTempRange={setTempRange}
                  // isSmallScreen={isSmallScreen}
                  // setIsSmallScreen={setIsSmallScreen}
                />
                <TransactionsTable
                  loadingTx={loadingTx}
                  selectedAccountId={selectedAccountId}
                  tableData={tableData}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
