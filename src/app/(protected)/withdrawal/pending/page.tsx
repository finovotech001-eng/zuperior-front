"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, RefreshCcw, X } from "lucide-react";
import { DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";
import { useFetchUserData } from "@/hooks/useFetchUserData";
interface WithdrawalData {
  id: number;
  accountname: string;
  email: string;
  account_type: string;
  acc: string;
  wallet_address: string;
  amount: number;
  cid: string;
  status: string;
  created_at: string;
}

export default function PendingWithdrawPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalData[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<
    WithdrawalData[]
  >([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<WithdrawalData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const userData = useSelector((state: RootState) => state.user.data);
  // const hasWithdrawnRef = useRef(false);
  const [isCheckingWithdrawal, setIsCheckingWithdrawal] = useState(false);
  const { fetchAllData } = useFetchUserData();


  const user = {
    email: userData?.email1 || "",
  };
  // Fetch withdrawals from Supabase
  const fetchWithdrawals = async () => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from("withdraw_cid")
        .select("*")
        .eq("email", user.email)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setWithdrawals(data || []);
      setFilteredWithdrawals(data || []);
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter withdrawals based on status and search query
  useEffect(() => {
    let result = withdrawals;

    if (statusFilter !== "all") {
      result = result.filter(
        (withdrawal) => withdrawal.status === statusFilter
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (withdrawal) =>
          withdrawal.accountname.toLowerCase().includes(query) ||
          withdrawal.email.toLowerCase().includes(query) ||
          withdrawal.acc.includes(query) ||
          withdrawal.cid.includes(query)
      );
    }

    setFilteredWithdrawals(result);
  }, [statusFilter, searchQuery, withdrawals]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusClasses[status as keyof typeof statusClasses] ||
          "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const openModal = (withdrawal: WithdrawalData) => {
    setSelectedWithdrawal(withdrawal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWithdrawal(null);
  };

  /* const handleWithdraw = async (token: string) => {
    if (hasWithdrawnRef.current) {
      console.log("Withdrawal already triggered, skipping...");
      return;
    }
    hasWithdrawnRef.current = true;

    try {
      if (!selectedWithdrawal?.acc) {
        toast.error("Account Error", {
          description: "No account selected for withdrawal.",
        });
        return;
      }

      toast("Processing Withdrawal...", {
        description: "Please wait while we process your transaction.",
      });

      const formData = new URLSearchParams();
      formData.append("account_number", selectedWithdrawal?.acc || "");
      formData.append("amount", selectedWithdrawal?.amount.toString() || "0");
      formData.append("access_token", token);

      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Withdrawal failed");
      }

      const data = await response.json();
      if (data.status === "success") {
        toast.success("Withdrawal Completed", {
          description:
            "Your funds have been successfully withdrawn from your account.",
          duration: 4000,
        });
      }
    } catch (err) {
      hasWithdrawnRef.current = false; // allow retry if failed
      console.error("Withdrawal error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Withdrawal failed";
      toast.error("Withdrawal Failed", {
        description: errorMessage,
        duration: 6000,
      });
    } finally {
      toast.dismiss();
    }
  }; */

  const checkStatus = async () => {
    try {
      setIsCheckingWithdrawal(true);
      const res = await axios.post("/api/payout-query", {
        cid: selectedWithdrawal?.cid,
      });
      const status = res.data?.data.status;

      if (status === 6) {
        // const freshToken = await dispatch(fetchAccessToken()).unwrap();
        // await handleWithdraw(freshToken);
        // To Do: integrate with actual withdraw API which updates the status of withdrawal to completed state
        await supabase
          .from("withdraw_cid")
          .update({ status: "approved" })
          .eq("cid", selectedWithdrawal?.cid);
        await fetchWithdrawals();
        setSelectedWithdrawal((prev) =>
          prev
            ? { ...prev, status: "approved" }
            : null
        );
        await fetchAllData();
      }
    } catch (error) {
      console.error("Error checking payout status:", error);
    } finally {
      setIsCheckingWithdrawal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-white text-xl flex items-center justify-center">
        Loading withdrawals...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="w-full">
        {error && (
          <div className="bg-red-800 text-white p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span>Error: {error}</span>
              <X
                onClick={() => setError(null)}
                className="text-red-200 hover:text-white"
              />
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Find by Name, Email, Account  or  CID"
              className="w-full px-4 py-4 bg-gray-900 dark:text-white/75 rounded-lg focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="px-3 py-2 bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] dark:text-white/75 rounded-lg focus:outline-none">
                  {statusFilter === "all"
                    ? "All Status"
                    : statusFilter.charAt(0).toUpperCase() +
                      statusFilter.slice(1)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-[#0d0414] dark:text-white/60 rounded-lg space-y-2 w-auto min-w-26 p-2">
                <DropdownMenuItem
                  className="dark:hover:text-white"
                  onClick={() => setStatusFilter("all")}
                >
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                  Rejected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={fetchWithdrawals}
              className="px-3 py-2 cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] dark:text-white/75 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Withdrawal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWithdrawals.length > 0 ? (
            filteredWithdrawals.map((withdrawal) => (
              <div
                key={withdrawal.id}
                onClick={() => openModal(withdrawal)}
                className="dark:bg-[#0d0414] hover:bg-gradient-to-r from-white to-[#f4e7f6] dark:from-[#330F33] dark:to-[#1C061C] rounded-lg p-6 cursor-pointer relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white/75">
                      {withdrawal.accountname}
                    </h3>
                    <p className="text-sm dark:text-white/75">
                      {withdrawal.email}
                    </p>
                  </div>
                  {getStatusBadge(withdrawal.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="dark:text-white/75">Account Type:</span>
                    <span className="dark:text-white/75">
                      {withdrawal.account_type}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="dark:text-white/75">Account Number:</span>
                    <span className="dark:text-white/75">{withdrawal.acc}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="dark:text-white/75">Amount:</span>
                    <span className="dark:text-white/75 font-semibold">
                      ${withdrawal.amount}
                    </span>
                  </div>

                  <div>
                    <span className="dark:text-white/75">Transaction CID:</span>
                    <p className="dark:text-white/75 text-sm">
                      {withdrawal.cid}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <span className="dark:text-white/75">Date:</span>
                    <span className="dark:text-white/75 text-sm">
                      {formatDate(withdrawal.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                No withdrawals found matching your criteria
              </div>
              <button
                className="px-4 py-2 bg-purple-600 dark:text-white/75 rounded-lg hover:bg-purple-700 transition-colors"
                onClick={() => {
                  setStatusFilter("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogOverlay className="fixed inset-0 bg-black/80 z-40" />
        <DialogContent
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
             border-2 border-transparent p-6 dark:text-white/75 rounded-[18px] 
             flex flex-col items-center w-full max-w-2xl max-h-[90vh] 
             overflow-y-auto  z-50
             [background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] 
             animate-border"
        >
          {selectedWithdrawal && (
            <div className="w-full">
              <div className="flex justify-between items-center mb-6">
                <DialogTitle className="text-2xl font-bold dark:text-white/75">
                  Withdrawal Details
                </DialogTitle>
                <X
                  onClick={closeModal}
                  className="dark:text-white/75 hover:text-white"
                  aria-label="Close modal"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="dark:text-white/75 text-sm">Account Name</h3>
                    <p className="dark:text-white/75">
                      {selectedWithdrawal.accountname}
                    </p>
                  </div>
                  <div>
                    <h3 className="dark:text-white/75 text-sm">Email</h3>
                    <p className="dark:text-white/75">
                      {selectedWithdrawal.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="dark:text-white/75 text-sm">Account Type</h3>
                    <p className="dark:text-white/75">
                      {selectedWithdrawal.account_type}
                    </p>
                  </div>
                  <div>
                    <h3 className="dark:text-white/75 text-sm">
                      Account Number
                    </h3>
                    <p className="dark:text-white/75">
                      {selectedWithdrawal.acc}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="dark:text-white/75 text-sm">Amount</h3>
                    <p className="dark:text-white/75 font-semibold">
                      ${selectedWithdrawal.amount}
                    </p>
                  </div>
                  <div>
                    <h3 className="dark:text-white/75 text-sm">Status</h3>
                    {getStatusBadge(selectedWithdrawal.status)}
                  </div>
                  <div>
                    <h3 className="dark:text-white/75 text-sm">
                      Wallet Address
                    </h3>
                    <p className="dark:text-white/75 font-mono text-sm break-all">
                      {selectedWithdrawal.wallet_address}
                    </p>
                  </div>
                  <div>
                    <h3 className="dark:text-white/75 text-sm">
                      Transaction CID
                    </h3>
                    <p className="dark:text-white/75 text-sm break-all">
                      {selectedWithdrawal.cid}
                    </p>
                  </div>
                  <div>
                    <h3 className="dark:text-white/75 text-sm">Date</h3>
                    <p className="dark:text-white/75 text-sm">
                      {formatDate(selectedWithdrawal.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-2">
                {selectedWithdrawal.status === "pending" && (
                  <button
                    onClick={checkStatus}
                    disabled={isCheckingWithdrawal}
                    className="disabled:opacity-70 disabled:cursor-not-allowed px-4 py-2 bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] dark:text-white/75 focus:outline-none text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isCheckingWithdrawal ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    ) : null}
                    Check Status
                  </button>
                )}

                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] dark:text-white/75
                  focus:outline-none text-white rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
