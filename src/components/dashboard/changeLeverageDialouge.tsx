"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchAccessToken } from "@/store/slices/accessCodeSlice";
import { useAppDispatch } from "@/store/hooks";
import axios from "axios";
import { useFetchUserData } from "@/hooks/useFetchUserData";

export default function ChangeLeverageDialog({
  open,
  onOpenChange,
  accountNumber,
  currency,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accountNumber: string;
  currency: string;
}) {
  const dispatch = useAppDispatch();
  const [leverages, setLeverages] = useState<string[]>([]);
  const [selectedLeverage, setSelectedLeverage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { fetchAllData } = useFetchUserData();

  // Fetch available leverages when dialog opens
  useEffect(() => {
    const fetchLeverages = async () => {
      try {
        const freshToken = await dispatch(fetchAccessToken()).unwrap();

        const res = await axios.get("/api/leverage", {
          params: {
            access_token: freshToken || "",
            account_number: accountNumber,
            currency: currency,
          },
        });

        const data = res.data;

        setLeverages(data?.leverage_presets || []);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Could not fetch leverages");
      }
    };

    if (open) fetchLeverages();
  }, [open, accountNumber, currency, dispatch]);

  // Confirm handler
  const handleConfirm = async () => {
    if (!selectedLeverage) {
      toast.error("Please select a leverage");
      return;
    }

    setLoading(true);
    try {
      const freshToken = await dispatch(fetchAccessToken()).unwrap();

      const params = new URLSearchParams();
      params.append("access_token", freshToken || "");
      params.append("account_number", accountNumber);
      params.append("currency", currency);
      params.append("requested_leverage", selectedLeverage);

      const res = await axios.put("/api/leverage", params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const data = res.data;
      console.log("Change leverage response:", data);

      if (data.status_code !== "1") {
        console.error("Change leverage failed:", data);
        throw new Error(data.message || "Change leverage failed");
      }

      toast.success("Leverage changed successfully!");

      // await dispatch(getSingleAccountDetails({ account_number: accountNumber })); // Refresh specific account details
      await fetchAllData(); // Refresh all user data including accounts
      // To do: should ideally only refresh the specific account details instead of all data
      onOpenChange(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Change leverage error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to change leverage";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-2 border-transparent p-6 dark:text-white/75 rounded-[18px] flex flex-col items-center w-full bg-white [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border"
        disableOutsideClick={true}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold dark:text-white/75">
            Change Leverage
          </DialogTitle>
        </DialogHeader>

        <div className="w-full px-6 mt-4">
          <Label className="text-sm text-blak dark:text-white/75 mb-1">
            Choose Your Leverage
          </Label>

          <Select
            value={selectedLeverage}
            onValueChange={(val) => setSelectedLeverage(val)}
          >
            <SelectTrigger className="border-[#362e36] p-5 dark:bg-[#070307] w-full text-black dark:text-white">
              <SelectValue
                placeholder="Select Leverage"
              />
            </SelectTrigger>

            <SelectContent className="border-[#1e171e] bg-white dark:bg-[#060207]">
              {Array.isArray(leverages) && leverages.length > 0 ? (
                leverages.map((lev, idx) => (
                  <SelectItem
                    key={idx}
                    value={lev}
                    className="text-black dark:text-white/75"
                  >
                    {lev}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-black dark:text-white/75">
                  Loading..
                </div>
              )}
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-5 w-full">
            <Button
              variant="outline"
              className="flex-1 border border-[#362e36] dark:bg-[#070307] dark:text-white/75 dark:hover:bg-[#1e171e]"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              className="flex-1 cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white hover:bg-[#9d6ad9]"
              onClick={handleConfirm}
            >
              {loading ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
