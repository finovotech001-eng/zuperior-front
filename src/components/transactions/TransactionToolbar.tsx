import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { TextAnimate } from "@/components/ui/text-animate";
import React from "react";

interface Account {
  id: string;
  type: string;
}
interface DateRange {
  from: Date | undefined;
  to?: Date;
}
interface Props {
  accounts: Account[];
  disabled?: boolean;
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string | null) => void;
  getAccountTransactions: (id: string, from?: Date, to?: Date) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
  tempRange: DateRange;
  setTempRange: (range: DateRange) => void;
}

export const TransactionsToolbar: React.FC<Props> = ({
  accounts,
  disabled,
  selectedAccountId,
  setSelectedAccountId,
  getAccountTransactions,
  dateRange,
  setDateRange,
  calendarOpen,
  setCalendarOpen,
  tempRange,
  setTempRange,
}) => {
  // Account Dropdown
  const AccountDropdown = (props: { className?: string }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`cursor-pointer flex items-center gap-1 px-3 py-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 ${props.className || ""}`}
          disabled={disabled}
        >
          {selectedAccountId ? `Account: ${selectedAccountId}` : "Select Account"}
          <ChevronDown size={12} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-full max-w-[352px] max-h-46 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 p-0"
      >
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {accounts
            .filter((account) => account.type === "Live")
            .map((account, index) => (
              <DropdownMenuItem
                key={`${account.id}-${index}`}
                className="cursor-pointer px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                onClick={() => {
                  setDateRange({ from: undefined, to: undefined });
                  setSelectedAccountId(account.id);
                  getAccountTransactions(account.id);
                }}
              >
                {account.id}{" "}
                <span className="text-gray-400 dark:text-gray-500">({account.type})</span>
              </DropdownMenuItem>
            ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Date Button
  const DateButton = (props: { className?: string }) => (
    <Button
      variant="ghost"
      className={`w-full flex items-center justify-start gap-1 px-3 py-1 rounded border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 ${!selectedAccountId ? "opacity-50 cursor-not-allowed" : ""} ${props.className || ""}`}
      disabled={!selectedAccountId}
    >
      <Calendar size={18} />
      {dateRange.from && dateRange.to ? (
        <span className="text-xs md:text-sm">
          {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
        </span>
      ) : dateRange.from ? (
        <span className="text-xs md:text-sm">{dateRange.from.toLocaleDateString()}</span>
      ) : (
        <span className="text-xs md:text-sm">Select Date Range</span>
      )}
    </Button>
  );

  return (
    <div className="flex flex-col xl:flex-row w-full justify-between items-start xl:items-center px-5 py-[15px] gap-3 xl:gap-0">
      {/* Title */}
      <div className="flex items-center space-x-4 flex-nowrap w-full max-w-[635px]">
        <TextAnimate className="text-[14px] md:text-[18px] font-bold text-gray-800 whitespace-nowrap dark:text-white/75">
          Transaction History
        </TextAnimate>
      </div>

      {/* Controls: Account Dropdown + Date */}
      <div className="flex md:flex-row flex-col items-center gap-3 min-w-[200px] justify-end w-full xl:w-auto">
        {/* Responsive Account Dropdown */}
        <div className="hidden xl:block w-auto">
          <AccountDropdown />
        </div>
        <div className="hidden md:flex xl:hidden w-auto">
          <AccountDropdown />
        </div>
        <div className="md:hidden w-full">
          <AccountDropdown className="w-full justify-between" />
        </div>

        {/* Responsive Date Button wrapped in PopoverTrigger */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            {/* Only one trigger is needed for popover */}
            <div className="w-full md:w-auto">
              <DateButton />
            </div>
          </PopoverTrigger>

          {/* Popover Content */}
          <PopoverContent
            align="end"
            side="bottom"
            className="w-auto p-0 z-[9999]"
            sideOffset={8}
            alignOffset={-20}
          >
            <div className="p-4">
              <CalendarPicker
                mode="range"
                selected={tempRange}
                onSelect={(range) => setTempRange(range ?? { from: undefined, to: undefined })}
                numberOfMonths={1}
                disabled={!selectedAccountId}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTempRange({ from: undefined, to: undefined });
                    setDateRange({ from: undefined, to: undefined });
                    setCalendarOpen(false);
                    if (selectedAccountId) getAccountTransactions(selectedAccountId);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setDateRange(tempRange);
                    setCalendarOpen(false);
                    if (selectedAccountId && tempRange.from) {
                      const fromDate = tempRange.from;
                      const toDate = tempRange.to ?? tempRange.from;
                      getAccountTransactions(selectedAccountId, fromDate, toDate);
                    }
                  }}
                  disabled={!tempRange.from}
                >
                  Set Date
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
