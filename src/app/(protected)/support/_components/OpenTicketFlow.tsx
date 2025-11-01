"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
// Lucide icons
import {
  TrendingUp,
  ArrowDownToLine,
  ArrowUpToLine,
  Settings2,
  Shuffle,
  IdCard,
  HelpCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketFormData } from "./types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MT5Account } from "@/store/slices/mt5AccountSlice";
import { fetchUserAccountsFromDb } from "@/store/slices/mt5AccountSlice";
import { useAppDispatch } from "@/store/hooks";

interface OpenTicketFlowProps {
  onBack: () => void;
  onSubmit?: (data: TicketFormData) => void;
  loading?: boolean;
}

const categories = [
  {
    id: "trading",
    label: "Trading Operations",
    desc: "Issues related to order execution, slippage, etc.",
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    id: "deposit",
    label: "Deposit",
    desc: "Problems adding funds to your account",
    icon: <ArrowDownToLine className="h-6 w-6" />,
  },
  {
    id: "withdrawal",
    label: "Withdrawal",
    desc: "Issues with withdrawing funds",
    icon: <ArrowUpToLine className="h-6 w-6" />,
  },
  {
    id: "leverage",
    label: "Change Leverage",
    desc: "Request or issue regarding leverage settings",
    icon: <Settings2 className="h-6 w-6" />,
  },
  {
    id: "transfer",
    label: "Internal Transfer",
    desc: "Transfer funds between accounts",
    icon: <Shuffle className="h-6 w-6" />,
  },
  {
    id: "kyc",
    label: "KYC",
    desc: "Identity verification issues",
    icon: <IdCard className="h-6 w-6" />,
  },
  {
    id: "other",
    label: "Other",
    desc: "General queries or issues",
    icon: <HelpCircle className="h-6 w-6" />,
  },
];

export default function OpenTicketFlow({
  onBack,
  onSubmit,
  loading,
}: OpenTicketFlowProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // Form state
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");
  const [accountNumber, setAccountNumber] = useState<string | undefined>(
    undefined
  );
  
  // Get MT5 accounts from Redux store - same as dashboard uses
  const mt5Accounts: MT5Account[] = useSelector((state: RootState) => state.mt5.accounts);

  // Fetch MT5 accounts from DB on mount if empty
  useEffect(() => {
    if (mt5Accounts.length === 0) {
      console.log("🔄 Fetching MT5 accounts from DB for support form...");
      dispatch(fetchUserAccountsFromDb() as any);
    }
  }, [dispatch, mt5Accounts.length]);
  
  // Convert MT5Account to TpAccountSnapshot format for consistency
  const accounts = mt5Accounts.map((account: MT5Account) => ({
    tradingplatformaccountsid: parseInt(account.accountId),
    account_name: parseInt(account.accountId),
    platformname: "MT5",
    acc: parseInt(account.accountId),
    account_type: account.accountType || "Live",
    leverage: account.leverage || 100,
    balance: (account.balance || 0).toString(),
    credit: (account.credit || 0).toString(),
    equity: (account.equity || 0).toString(),
    margin: (account.margin || 0).toString(),
    margin_free: (account.marginFree || 0).toString(),
    margin_level: (account.marginLevel || 0).toString(),
    closed_pnl: (account.profit || 0).toString(),
    open_pnl: "0",
    account_type_requested: account.package || null,
    provides_balance_history: true,
    tp_account_scf: {
      tradingplatformaccountsid: parseInt(account.accountId),
      cf_1479: account.nameOnAccount || ""
    }
  }));

  // Debug: Log accounts when they change
  useEffect(() => {
    console.log("📊 MT5 accounts from store:", mt5Accounts.length);
    console.log("📊 All accounts (converted):", accounts.length);
    console.log("📊 Accounts:", accounts);
  }, [mt5Accounts, accounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !subject || !description) return;

    const formData: TicketFormData = {
      category: selectedCategory,
      subject,
      description,
      priority,
      account_number: accountNumber,
    };

    if (onSubmit) {
      await onSubmit(formData); // send to parent for API call
    }

    // reset form
    handleBack();
  };

  const handleBack = () => {
    setSubject("");
    setDescription("");
    setPriority("normal");
    setAccountNumber(undefined);
    setSelectedCategory(null);
  };

  const renderForm = () => {
    return (
      <div className="rounded-lg border dark:border-[#1D1825] border-gray-300 dark:bg-[#120f18] bg-white p-6">
        <h3 className="text-xl font-semibold mb-4 dark:text-white/75 text-black">
          {categories.find((c) => c.id === selectedCategory)?.label}
        </h3>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Subject */}
          <div className="space-y-2 w-full">
            <Label className="text-sm dark:text-white/75 text-black">
              Subject
            </Label>
            <Input
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading}
              className="dark:bg-[#070307] dark:text-white/75 text-black border-[#362e36] p-5 focus-visible:ring-[#8046c9] w-full"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2 w-full">
            <Label className="text-sm dark:text-white/75 text-black">
              Description
            </Label>
            <Textarea
              rows={7}
              placeholder="Describe your issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="dark:bg-[#070307] dark:text-white/75 text-black border-[#362e36] p-5 focus-visible:ring-[#8046c9] w-full"
              required
            />
          </div>

          {/* Priority + Optional Account */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Priority */}
            <div className="space-y-2 w-full md:w-1/2">
              <Label className="text-sm dark:text-white/75 text-black">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={setPriority}
                disabled={loading}
              >
                <SelectTrigger className="border-[#362e36] p-5 dark:bg-[#070307] flex items-center w-full dark:text-white/75 text-black focus:ring-[#8046c9]">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent className="border-[#1e171e] bg-white dark:bg-[#060207]">
                  <SelectItem value="low">
                    <span className="px-2 py-[2px] rounded-[5px] bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold">
                      Low
                    </span>
                  </SelectItem>
                  <SelectItem value="normal">
                    <span className="px-2 py-[2px] rounded-[5px] bg-gray-500/20 text-gray-700 dark:text-gray-300 text-xs font-semibold">
                      Normal
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="px-2 py-[2px] rounded-[5px] bg-orange-500/20 text-orange-700 dark:text-orange-400 text-xs font-semibold">
                      High
                    </span>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <span className="px-2 py-[2px] rounded-[5px] bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-semibold">
                      Urgent
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Optional Account */}
            {selectedCategory !== "kyc" && (
              <div className="space-y-2 w-full md:w-1/2">
                <Label className="text-sm dark:text-white/75 text-black">
                  Account (Optional)
                </Label>
                <Select
                  value={accountNumber}
                  onValueChange={setAccountNumber}
                  disabled={loading}
                >
                 <SelectTrigger className="border-[#362e36] p-5 dark:bg-[#070307] flex items-center w-full dark:text-white/75 text-black focus:ring-[#8046c9]">
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#110f17] max-h-[300px]">
                    {accounts.length > 0 ? (
                      accounts
                        .filter((acc, index, self) => {
                          // Filter out duplicates and invalid accounts
                          const accountId = acc?.acc?.toString();
                          return accountId && accountId !== "0" && 
                                 self.findIndex(a => a?.acc?.toString() === accountId) === index;
                        })
                        .map((account, index) => (
                        <SelectItem
                          key={`account-${account?.acc}-${index}`}
                          value={(account?.acc || "").toString()}
                          className="dark:hover:bg-[#1a1720] cursor-pointer"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <span className="bg-[#9F8ACF]/30 px-2 py-1 rounded-[5px] font-semibold text-black/75 dark:text-white/75 tracking-tighter text-xs">
                              MT5
                            </span>
                            <span className="font-semibold dark:text-white text-black">
                              {account?.acc}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              ${parseFloat(account?.balance || "0").toFixed(2)}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                        No accounts available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              className="border-2 bg-transparent"
              type="button"
              disabled={loading}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              className="bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white"
              type="submit"
              disabled={loading}
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Ticket
            </Button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="px-3 md:px-0 pb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[28px] font-semibold dark:text-white/75">
          Raise a Ticket
        </h2>
        <Button
          variant="outline"
          onClick={() => {
            handleBack();
            onBack();
          }}
          disabled={loading}
        >
          Back to Support Hub
        </Button>
      </div>

      {!selectedCategory && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="cursor-pointer rounded-lg border-2 dark:border-[#1D1825] border-gray-300 bg-white dark:bg-[#120f18] p-6 hover:bg-white/75 transition"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold dark:text-white/75">
                  {category.label}
                </h3>
              </div>
              <p className="text-sm dark:text-white/75">{category.desc}</p>
            </div>
          ))}
        </div>
      )}

      {selectedCategory && renderForm()}
    </div>
  );
}
