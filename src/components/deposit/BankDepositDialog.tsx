"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { USDTManualStep1Form } from "./USDTManualStep1Form";
import { WireStep2Instructions } from "./WireStep2Instructions";
import { USDTManualStep3Transaction } from "./USDTManualStep3Transaction";
import { USDTManualStep4Confirmation } from "./USDTManualStep4Confirmation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchUserAccountsFromDb } from "../../store/slices/mt5AccountSlice";

export function BankDepositDialog({ open, onOpenChange, lifetimeDeposit }: { open: boolean; onOpenChange: (v: boolean)=>void; lifetimeDeposit: number; }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [depositRequestId, setDepositRequestId] = useState("");
  const [bank, setBank] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();
  const mt5Accounts = useSelector((state: RootState) => state.mt5.accounts);
  const filteredAccounts = mt5Accounts.filter(acc => String(acc.accountId || '').trim() && String(acc.accountId).trim() !== '0');

  useEffect(() => {
    if (open && mt5Accounts.length === 0) dispatch(fetchUserAccountsFromDb() as any);
  }, [open, dispatch, mt5Accounts.length]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const res = await fetch('/api/manual-gateway?type=wire', { cache: 'no-store' });
      const data = await res.json();
      if (data?.success) setBank(data.data.bank);
    })();
  }, [open]);

  const reset = useCallback(() => {
    setStep(1); setAmount(""); setSelectedAccount(""); setTransactionId(""); setProofFile(null); setDepositRequestId("");
  }, []);

  useEffect(() => { if (!open) reset(); }, [open, reset]);

  const handleCreate = async () => {
    // Uses existing manual deposit endpoint and proxy
    const formData = new FormData();
    formData.append('mt5AccountId', selectedAccount);
    formData.append('amount', amount);
    if (transactionId) formData.append('transactionHash', transactionId);
    if (proofFile) formData.append('proofFile', proofFile);

    const token = localStorage.getItem('userToken') || '';
    const response = await fetch('/api/manual-deposit/create', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
    const result = await response.json();
    if (result?.success) { setDepositRequestId(result.data.id); setStep(4); }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <USDTManualStep1Form
            amount={amount}
            setAmount={setAmount}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            accounts={filteredAccounts}
            lifetimeDeposit={lifetimeDeposit}
            nextStep={() => setStep(2)}
          />
        );
      case 2:
        return (
          <WireStep2Instructions bank={bank || {}} amount={amount} nextStep={() => setStep(3)} />
        );
      case 3:
        return (
          <USDTManualStep3Transaction
            amount={amount}
            selectedAccount={selectedAccount}
            transactionId={transactionId}
            setTransactionId={setTransactionId}
            proofFile={proofFile}
            setProofFile={setProofFile}
            nextStep={handleCreate}
            isProcessing={false}
          />
        );
      case 4:
        return (
          <USDTManualStep4Confirmation
            amount={amount}
            selectedAccount={selectedAccount}
            transactionId={transactionId}
            depositRequestId={depositRequestId}
            onClose={() => onOpenChange(false)}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95%] lg:max-w-2xl gap-4 bg-background shadow-lg border-2 border-transparent p-6 text-white rounded-[18px] flex flex-col items-center w-full max-h-[90vh] overflow-y-auto">
        <VisuallyHidden><DialogTitle>Wire Transfer</DialogTitle></VisuallyHidden>
        <h2 className="text-2xl text-center font-bold dark:text-white/75 text-black">Wire Transfer</h2>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}

