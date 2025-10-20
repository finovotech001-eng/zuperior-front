// AccountInfoDialog.tsx
import React, { JSX, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./CopyButton";
import { TpAccountSnapshot } from "@/types/user-details";

interface AccountInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: TpAccountSnapshot | null;
}

export function AccountInfoDialog({
  open,
  onOpenChange,
  account,
}: AccountInfoDialogProps) {
  const fields: Array<[string, string | JSX.Element]> = useMemo(() => {
    if (!account) return [];
    return [
      ["Account", account.acc !== undefined ? `# ${account.acc}` : ""],
      ["Nickname", account.tp_account_scf.cf_1479 ?? ""],
      ["Type", account.account_type_requested
  ? account.account_type_requested.charAt(0).toUpperCase() + account.account_type_requested.slice(1)
  : "Standard"],
      [
        "Actual leverage",
        account.leverage !== undefined ? `1:${account.leverage}` : "",
      ],
      ["Maximum leverage", "1:2000"],
      [
        "Real funds",
        account.balance !== undefined
          ? `${Number(account.balance).toLocaleString()} USD`
          : "0.00 USD",
      ],
      [
        "Unrealized P&L",
        account.open_pnl !== undefined
          ? `${Number(account.open_pnl).toLocaleString()} USD`
          : "0.00 USD",
      ],
      ["Server", "ZuperiorFX-Limited"],
      [
        "MT login",
        account.acc ? (
          <span className="inline-flex items-center gap-2">
            {account.acc}
            <CopyButton text={String(account.acc)} size={14} />
          </span>
        ) : (
          ""
        ),
      ],
    ];
  }, [account]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 border-transparent p-6 text-black dark:text-white rounded-[18px] w-full max-w-md [background:linear-gradient(#fff,#fff)_padding-box,conic-gradient(from_var(--border-angle),#ddd,#f6e6fc,theme(colors.purple.400/48%))_border-box] dark:[background:linear-gradient(#070206,#030103)_padding-box,conic-gradient(from_var(--border-angle),#030103,#030103,theme(colors.purple.400/48%))_border-box] animate-border gap-4">
        <DialogHeader>
          <DialogTitle className="text-xl mb-2">
            Account information
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 text-sm">
          {fields.map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between items-center py-1 border-b last:border-0 border-gray-100 dark:border-[#222]"
            >
              <span className="text-[13px] font-medium text-gray-500 dark:text-white/60 min-w-[130px]">
                {label}
              </span>
              <span className="text-[13px] font-semibold text-gray-900 dark:text-white/90 text-right">
                {value}
              </span>
            </div>
          ))}
        </div>
        <Button
          className="mt-6 w-full"
          variant="secondary"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
