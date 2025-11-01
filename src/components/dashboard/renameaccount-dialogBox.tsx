"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useFetchUserData } from "@/hooks/useFetchUserData";
import { fetchUserAccountsFromDb, updateAccountName } from "@/store/slices/mt5AccountSlice";
import { useDispatch } from "react-redux";

type RenameAccountDialogProps = {
  open: boolean;
  onOpen: (open: boolean) => void;
  accountNumber?: number;
  currentName?: string;
};

export const RenameAccountDialog = ({
  open,
  onOpen,
  accountNumber,
  currentName,
}: RenameAccountDialogProps) => {
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { fetchAllData } = useFetchUserData();

  // Reset and set current name when dialog opens
  useEffect(() => {
    if (open) {
      setNewName(currentName || "");
    }
  }, [open, currentName]);

  const handleRename = async () => {
    if (!newName || !newName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (!accountNumber) {
      toast.error("Account number is required");
      return;
    }

    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
      
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      const res = await axios.put(
        `/api/mt5/update-account/${accountNumber}/name`,
        { name: newName.trim() },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = res.data;
      console.log("Rename account response:", data);

      if (data.success) {
        const titleCaseName = newName.trim().split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        
        // Immediately update Redux state with new name (instant UI update)
        dispatch(updateAccountName({ 
          accountId: accountNumber.toString(), 
          name: titleCaseName 
        }));
        
        toast.success("Account name updated successfully!");

        // Then refresh from database to ensure consistency (async, won't block UI)
        dispatch(fetchUserAccountsFromDb() as any);
        await fetchAllData();

        onOpen(false);
      } else {
        throw new Error(data.message || "Failed to rename account");
      }
    } catch (err: any) {
      console.error("Rename account error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to rename account";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent className="border-2 border-transparent p-6 dark:text-white/75 rounded-[18px] w-full bg-white [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border gap-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Rename Account
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 w-full">
          {accountNumber && (
            <div className="text-base font-medium mb-2">
              Account # {accountNumber}
            </div>
          )}
          
          <Label htmlFor="account-name" className="space-y-1 flex flex-col items-start">
            <span className="text-sm font-medium">Account Name</span>
            <Input
              id="account-name"
              type="text"
              placeholder="Enter new account name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full"
              disabled={loading}
            />
          </Label>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 border border-[#362e36] dark:bg-[#070307] dark:text-white/75 dark:hover:bg-[#1e171e]"
              onClick={() => onOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              disabled={loading || !newName.trim()}
              className="flex-1 cursor-pointer bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white hover:bg-[#9d6ad9]"
              onClick={handleRename}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
