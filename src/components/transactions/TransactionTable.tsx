import React from "react";
import TradingLoader from "./TradingLoader";
import { formatDate, getStatusColor } from "@/utils/formDate";
import { ArrowDown, ArrowUpRight } from "lucide-react";

interface Tx {
  depositID?: string;
  login?: string;
  open_time?: string | number;
  profit?: number;
  amount?: number;
  comment?: string;
  type: string;
  status?: string;
  account_id?: string;
}

interface Props {
  loadingTx: boolean;
  selectedAccountId: string | null;
  tableData: Tx[];
}

const getArrowIcon = (type: string) =>
  type === "Deposit" ? (
    <ArrowDown className="h-3 w-3 text-black bg-[#92F09A] rounded-full p-0.5" />
  ) : (
    <ArrowUpRight className="h-3 w-3 text-black bg-[#D97777] rounded-full p-0.5 rotate-[-10deg]" />
  );

export const TransactionsTable: React.FC<Props> = ({
  loadingTx,
  selectedAccountId,
  tableData,
}) => (
  <>
    <div
      className="overflow-x-auto rounded-b-xl w-full"
      style={{ maxHeight: "550px", overflowY: "auto" }}
    >
      <table className=" hidden xl:block w-full text-sm table-fixed ">
        <thead className="sticky top-0 bg-white dark:bg-[#01040D] z-10 border-b border-black/10 dark:border-white/10 w-full">
          <tr className="text-xs font-semibold leading-3.5 dark:text-white/25 text-black/25">
            <th className="text-left px-4 py-3 w-[16%]">Account ID</th>
            <th className="text-left px-2 py-3 w-[12%]">Amount (USD)</th>
            <th className="text-left px-4 py-3 w-[20%]">Transfer Process</th>
            <th className="text-left py-3 w-[18%]">Deposit/Withdrawal</th>
            <th className="text-left px-7 py-3 w-[14%]">Date-Time</th>
            <th className="text-center px-10 py-3 w-[7%]">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 dark:text-white">
          {loadingTx ? (
            <tr>
              <td colSpan={6} className="py-16 text-center text-gray-400">
                <TradingLoader />
              </td>
            </tr>
          ) : !selectedAccountId ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400">
                Please select an account to view transactions.
              </td>
            </tr>
          ) : tableData.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400">
                No transactions found.
              </td>
            </tr>
          ) : (
            tableData.map((tx, i) => (
              <tr
                key={tx.depositID ?? `${i}-${tx.login}-${tx.open_time}`}
                className="text-sm leading-6.5 text-black/75 dark:text-white/75 whitespace-nowrap font-semibold border-b border-[#9F8ACF]/10"
              >
                <td className="px-4 py-[15px]">
                  {tx.account_id || tx.login || "-"}
                </td>
                <td className="px-2 py-[15px]">
                  {(() => {
                    const val = Number(tx.profit ?? tx.amount ?? 0);
                    return `$ ${Math.abs(val).toFixed(2)}`;
                  })()}
                </td>
                <td className="px-2 py-[15px]">{tx.comment || "-"}</td>
                <td className="px-2 py-[15px] whitespace-nowrap flex items-center gap-2">
                  {getArrowIcon(tx.type)} {tx.type}
                </td>
                <td className="px-2 py-[15px]">
                  {formatDate(tx.open_time ?? "")}
                </td>
                <td
                  className={`px-4 py-[15px] text-center ${getStatusColor(
                    tx.status
                  )}`}
                >
                  {tx.status || "Success"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <div
      className="w-full bg-gradient-to-r from-[#181422] to-[#181422] dark:from-[#15101d] dark:to-[#181422] rounded-xl px-5 shadow-lg 
        text-white dark:text-white/75 block lg:block xl:hidden"
    >
      {loadingTx ? (
        <div className="py-16 text-center text-gray-400">
          <TradingLoader />
        </div>
      ) : !selectedAccountId ? (
        <div className="py-10 text-center text-gray-400">
          Please select an account to view transactions.
        </div>
      ) : tableData.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          No transactions found.
        </div>
      ) : (
        tableData.map((tx, i) => {
          const val = Number(tx.profit ?? tx.amount ?? 0);
          return (
            <div
              key={tx.depositID ?? `${i}-${tx.login}-${tx.open_time}`}
              className="flex justify-between items-center border-b border-white/10 py-3 last:border-none"
            >
              <div>
                <p className="font-medium">
                  {tx.comment || "Binance to Zuperior"}
                </p>
                <p className="text-sm text-gray-400 dark:text-white/75">
                  {tx.account_id || tx.login || "-"}
                </p>
                <p className="text-sm text-gray-400 dark:text-white/75">
                  {formatDate(tx.open_time ?? "")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">
                  ${Math.abs(val).toFixed(2)}
                </p>
                <p className="flex items-center gap-1 text-green-400 text-sm">
                  {getArrowIcon(tx.type)} {tx.type}
                </p>
                <p className={`text-xs mt-1 ${getStatusColor(tx.status)}`}>
                  {tx.status || "Success"}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  </>
);
