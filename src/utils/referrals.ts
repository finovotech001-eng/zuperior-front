// IB Referral utilities for CRM dashboard
// Uses NEXT_PUBLIC_IB_API as base, e.g. https://zup-ib-back.onrender.com/api

const IB_API: string =
  (typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_IB_API as string) ?? (import.meta as any)?.env?.VITE_IB_API
    : '') || '';

export function getReferralCodeFromUrl(): string {
  if (typeof window === 'undefined') return '';
  try {
    const p = new URLSearchParams(window.location.search);
    const code = p.get('referralCode');
    return code ? code.trim().toUpperCase() : '';
  } catch {
    return '';
  }
}

export function persistReferralCode(): string {
  const code = getReferralCodeFromUrl();
  if (code && typeof window !== 'undefined') {
    try {
      localStorage.setItem('z_referral_code', JSON.stringify({ code, ts: Date.now() }));
    } catch {
      // ignore storage errors
    }
  }
  return code;
}

export function getStoredReferralCode(): string {
  if (typeof window === 'undefined') return '';
  try {
    const raw = localStorage.getItem('z_referral_code');
    if (!raw) return '';
    const { code, ts } = JSON.parse(raw);
    // 30 days TTL
    if (!code || Date.now() - ts > 30 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem('z_referral_code');
      return '';
    }
    return code as string;
  } catch {
    return '';
  }
}

export async function resolveReferral(code: string) {
  if (!code || !IB_API) return null;
  try {
    const res = await fetch(`${IB_API}/public/referrals/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode: code }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.ib ?? null;
  } catch {
    return null;
  }
}

export async function attachReferral(code: string, email: string): Promise<boolean> {
  if (!code || !email || !IB_API) return false;
  try {
    const res = await fetch(`${IB_API}/public/referrals/attach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode: code, email, source: 'crm' }),
    });
    if (res.ok && typeof window !== 'undefined') {
      try {
        localStorage.removeItem('z_referral_code');
      } catch {
        // ignore
      }
      return true;
    }
    return res.ok;
  } catch {
    return false;
  }
}

// Convenience helper to pick the best code at submit time
export function getActiveReferralCode(): string {
  return getStoredReferralCode() || getReferralCodeFromUrl();
}

