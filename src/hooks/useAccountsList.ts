// Hook to get account list for dropdowns from database
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { fetchUserAccountsFromDb } from '@/store/slices/mt5AccountSlice';
import { MT5Account } from '@/store/slices/mt5AccountSlice';

export interface AccountDropdownItem {
  accountId: string;
  displayText: string;
  balance: number;
  accountType: string;
  package?: string | null;
  nameOnAccount?: string | null;
}

/**
 * Hook to fetch and get account list for dropdowns
 * @param filterLiveOnly - If true, only return Live accounts (default: false - returns all)
 * @returns Array of account items formatted for dropdowns
 */
export function useAccountsList(filterLiveOnly: boolean = false): AccountDropdownItem[] {
  const dispatch = useDispatch();
  const accounts = useSelector((state: RootState) => state.mt5.accounts);
  const isFetching = useSelector((state: RootState) => state.mt5.isFetchingAccounts);

  // Fetch accounts from DB if not already fetched
  useEffect(() => {
    if (accounts.length === 0 && !isFetching) {
      dispatch(fetchUserAccountsFromDb() as any);
    }
  }, [dispatch, accounts.length, isFetching]);

  // Filter and format accounts for dropdown
  const accountItems: AccountDropdownItem[] = accounts
    .filter((account) => {
      // Filter invalid accounts
      const id = String(account.accountId || '').trim();
      if (!id || id === '0' || !/^\d+$/.test(id)) return false;
      
      // Filter by accountType if requested
      if (filterLiveOnly) {
        return account.accountType === 'Live';
      }
      return true;
    })
    .map((account: MT5Account) => {
      const packageDisplay = account.package || 'Standard';
      const balance = account.balance || 0;
      
      return {
        accountId: account.accountId,
        displayText: `#${account.accountId} (${packageDisplay})`,
        balance: balance,
        accountType: account.accountType || 'Live',
        package: account.package,
        nameOnAccount: account.nameOnAccount
      };
    })
    // Remove duplicates
    .filter((item, index, self) => 
      index === self.findIndex((a) => a.accountId === item.accountId)
    )
    // Sort by accountId
    .sort((a, b) => parseInt(a.accountId) - parseInt(b.accountId));

  return accountItems;
}

