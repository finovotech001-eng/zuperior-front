"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import {
  getTransactions,
  Withdraw,
  Deposit,
  Bonus,
  MT5Transaction,
} from "@/store/slices/transactionsSlice";
import { fetchUserMt5Accounts } from "@/store/slices/mt5AccountSlice";
import { format } from "date-fns";

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

  useEffect(() => {
    dispatch(fetchUserMt5Accounts());
  }, [dispatch]);

  const accounts = useSelector(
    (state: RootState) =>
      state.mt5.accounts.map((account) => ({
        id: account.accountId,
        type: account.group || "Live",
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
    mt5Transactions: MT5Transaction[];
    bonuses: Bonus[];
    status?: string;
    MT5_account?: string;
  }>({
    deposits: [],
    withdrawals: [],
    mt5Transactions: [],
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
    console.log('🔍 Fetching transactions for account:', accountId);
    setLoadingTx(true);
    setSelectedAccountId(accountId);
    try {
      let start_date, end_date;
      if (from && to) {
        start_date = format(from, "yyyy-MM-dd");
        end_date = format(to, "yyyy-MM-dd");
      } else if (from) {
        start_date = format(from, "yyyy-MM-dd");
        end_date = format(from, "yyyy-MM-dd");
      }
      
      console.log('📤 Dispatching getTransactions with:', { account_number: accountId, start_date, end_date });
      
      const result = await dispatch(
        getTransactions({
          account_number: accountId,
          start_date,
          end_date,
        })
      ).unwrap();

      console.log('📥 Received transactions result:', result);

      setTransactionsData({
        deposits: result.deposits || [],
        withdrawals: result.withdrawals || [],
        mt5Transactions: result.mt5Transactions || [],
        bonuses: result.bonuses || [],
        status: result.status,
        MT5_account: result.MT5_account || accountId,
      });
      
      console.log('✅ Transactions data set successfully');
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
      setTransactionsData({
        deposits: [],
        withdrawals: [],
        mt5Transactions: [],
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
        status: tx.status || transactionsData.status || "Success",
        account_id: transactionsData.MT5_account || tx.login,
      })),
      ...transactionsData.withdrawals.map((tx) => ({
        ...tx,
        type: "Withdrawal",
        status: tx.status || transactionsData.status || "Success",
        account_id: transactionsData.MT5_account || tx.login,
      })),
      ...transactionsData.mt5Transactions.map((tx) => ({
        ...tx,
        type: tx.type,
        status: tx.status || transactionsData.status || "Success",
        account_id: transactionsData.MT5_account || tx.login,
      })),
    ];
  } else if (activeTab === "deposits") {
    tableData = [
      ...transactionsData.deposits.map((tx) => ({
        ...tx,
        type: "Deposit",
        status: tx.status || transactionsData.status || "Success",
        account_id: transactionsData.MT5_account || tx.login,
      })),
      ...transactionsData.mt5Transactions.filter((tx) => tx.type === "Deposit").map((tx) => ({
        ...tx,
        type: tx.type,
        status: tx.status || transactionsData.status || "Success",
        account_id: transactionsData.MT5_account || tx.login,
      })),
    ];
  } else {
    tableData = [
      ...transactionsData.withdrawals.map((tx) => ({
        ...tx,
        type: "Withdrawal",
        status: tx.status || transactionsData.status || "Success",
        account_id: transactionsData.MT5_account || tx.login,
      })),
      ...transactionsData.mt5Transactions.filter((tx) => tx.type === "Withdrawal").map((tx) => ({
        ...tx,
        type: tx.type,
        status: tx.status || transactionsData.status || "Success",
        account_id: transactionsData.MT5_account || tx.login,
      })),
    ];
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
