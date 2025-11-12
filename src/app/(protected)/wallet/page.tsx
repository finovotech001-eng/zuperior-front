"use client";

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/hooks';
import { fetchUserAccountsFromDb } from '@/store/slices/mt5AccountSlice';
import type { RootState } from '@/store';
import { toast } from 'sonner';
import { TransactionsTable } from '@/components/transactions/TransactionTable';
import { useRouter } from 'next/navigation';
import WalletBalance from '@/components/dashboard/wallet-balance';
import { WalletMoveDialog } from '@/components/wallet/WalletMoveDialog';

export default function WalletPage() {
  const dispatch = useAppDispatch();
  const [wallet, setWallet] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [mt5Id, setMt5Id] = useState('');
  const [mt5IdOut, setMt5IdOut] = useState('');
  const [loadingIn, setLoadingIn] = useState(false);
  const [loadingOut, setLoadingOut] = useState(false);
  const [loadingTx, setLoadingTx] = useState(false);
  const [walletTx, setWalletTx] = useState<any[]>([]);
  const accounts = useSelector((s: RootState) => s.mt5.accounts);
  const [openIn, setOpenIn] = useState(false);
  const [openOut, setOpenOut] = useState(false);
  const [mt5Balances, setMt5Balances] = useState<Record<string, number>>({});
  const filteredAccounts = useMemo(() => {
    const seen = new Set<string>();
    return (accounts || []).filter((a: any) => {
      const type = a?.accountType || 'Live';
      const id = String(a?.accountId ?? '').trim();
      if (type !== 'Live') return false; // hide demo
      if (!id || id === '0' || seen.has(id)) return false; // sanitize
      seen.add(id);
      return true;
    });
  }, [accounts]);
  const router = useRouter();

  const load = async () => {
    const token = localStorage.getItem('userToken');
    const r = await fetch('/api/wallet', { headers: token ? { Authorization: `Bearer ${token}` } : undefined, cache: 'no-store' });
    const j = await r.json();
    if (j?.success) {
      setWallet(j.data);
      try {
        const bal = Number(j?.data?.balance ?? 0);
        if (!Number.isNaN(bal)) {
          // Notify header/navbar to refresh without a full reload
          window.dispatchEvent(new CustomEvent('wallet:refresh', { detail: { balance: bal } }));
        }
      } catch {}
    }
  };
  const loadTx = async () => {
    setLoadingTx(true);
    const token = localStorage.getItem('userToken');
    const r = await fetch('/api/wallet/transactions?limit=50', { headers: token ? { Authorization: `Bearer ${token}` } : undefined, cache: 'no-store' });
    const j = await r.json();
    if (j?.success) setWalletTx(j.data || []);
    setLoadingTx(false);
  };
  useEffect(() => { 
    dispatch(fetchUserAccountsFromDb() as any);
    load(); 
    loadTx(); 
    const id = setInterval(() => { load(); }, 15000); // refresh wallet balance every 15s
    const onVis = () => { if (document.visibilityState === 'visible') { load(); loadTx(); } };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
  }, [dispatch]);

  const refreshMt5Balances = async () => {
    try {
      const results: Record<string, number> = {};
      await Promise.all(filteredAccounts.map(async (acc: any) => {
        const login = String(acc.accountId);
        const token = localStorage.getItem('userToken');
        const r = await fetch(`/api/mt5/user-profile/${login}`, { cache: 'no-store', headers: token ? { Authorization: `Bearer ${token}` } : undefined });
        const j = await r.json();
        const data = j?.data || j;
        const bal = Number(data?.Balance ?? data?.balance ?? acc.balance ?? 0);
        results[login] = isNaN(bal) ? 0 : bal;
      }));
      setMt5Balances(results);
    } catch (e) {
      console.warn('Failed to refresh MT5 balances:', e);
    }
  };

  useEffect(() => { if (filteredAccounts.length) refreshMt5Balances(); }, [filteredAccounts.length]);

  const submit = async () => {
    const a = parseFloat(amount);
    if (!mt5Id || !a || a <= 0) { toast.error('Enter amount and account'); return; }
    setLoadingIn(true);
    const token = localStorage.getItem('userToken');
    const r = await fetch('/api/wallet/mt5-to-wallet', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ mt5AccountId: mt5Id, amount: a }) });
    const j = await r.json();
    if (j?.success) {
      toast.success('Transferred to wallet');
      setAmount('');
      await load();
      await loadTx();
    } else { toast.error(j?.message || 'Transfer failed'); }
    setLoadingIn(false);
  };

  const submitOut = async () => {
    const a = parseFloat(amountOut);
    if (!mt5IdOut || !a || a <= 0) { toast.error('Enter amount and account'); return; }
    setLoadingOut(true);
    const token = localStorage.getItem('userToken');
    const r = await fetch('/api/wallet/wallet-to-mt5', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ mt5AccountId: mt5IdOut, amount: a }) });
    const j = await r.json();
    if (j?.success) {
      toast.success('Transferred to MT5');
      setAmountOut('');
      await load();
      await loadTx();
    } else { toast.error(j?.message || 'Transfer failed'); }
    setLoadingOut(false);
  };

  return (
    <div className="p-4 mx-auto w-full max-w-full space-y-6">
      {/* Balance section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Wallet</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
          <div className="lg:col-span-1">
            <WalletBalance balance={wallet?.balance ?? 0} />
          </div>
          <div className="lg:col-span-3 rounded-[15px] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/40 p-6 flex items-center justify-center text-center min-h-[140px]">
            <div>
              <div className="text-sm opacity-70">Wallet Number</div>
              <div className="text-lg font-semibold tracking-tight">{wallet?.walletNumber || '-'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer chooser cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={()=>setOpenIn(true)} className="rounded-xl p-6 text-left bg-gradient-to-br from-[#1b1426] to-[#221a30] border border-[#2a2139] hover:opacity-90">
          <div className="text-sm text-white/70 mb-1">Transfer</div>
          <div className="text-lg font-semibold text-white">MT5 to Wallet</div>
          <div className="text-xs text-white/50 mt-2">Move funds into your wallet</div>
        </button>
        <button onClick={()=>setOpenOut(true)} className="rounded-xl p-6 text-left bg-gradient-to-br from-[#1b1426] to-[#221a30] border border-[#2a2139] hover:opacity-90">
          <div className="text-sm text-white/70 mb-1">Transfer</div>
          <div className="text-lg font-semibold text-white">Wallet to MT5</div>
          <div className="text-xs text-white/50 mt-2">Move funds to your trading account</div>
        </button>
      </div>

      <WalletMoveDialog open={openIn} onOpenChange={(v)=>{ setOpenIn(v); if (!v) { load(); loadTx(); } }} direction="MT5_TO_WALLET" />
      <WalletMoveDialog open={openOut} onOpenChange={(v)=>{ setOpenOut(v); if (!v) { load(); loadTx(); } }} direction="WALLET_TO_MT5" />

      <div className="rounded-[15px] bg-white dark:bg-gradient-to-r dark:from-[#15101d] dark:to-[#181422] border border-black/10 dark:border-none p-3">
        <h3 className="text-lg font-medium mb-3">Wallet Transactions</h3>
        <TransactionsTable
          loadingTx={loadingTx}
          selectedAccountId={'WALLET'}
          tableData={walletTx.map((tx) => ({
            account_id: tx.mt5AccountId || wallet?.walletNumber || 'WALLET',
            amount: tx.amount,
            profit: tx.amount,
            comment: tx.description,
            type: tx.type === 'MT5_TO_WALLET' ? 'Internal Transfer In' : 'Internal Transfer Out',
            status: tx.status,
            open_time: tx.createdAt,
          }))}
        />
      </div>
    </div>
  );
}
