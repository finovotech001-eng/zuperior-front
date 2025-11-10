// IB Referral utilities for CRM dashboard
// Uses NEXT_PUBLIC_IB_API or VITE_IB_API as base, with robust dev fallback

let IB_API: string = '';
if (typeof window !== 'undefined') {
  IB_API =
    (process.env.NEXT_PUBLIC_IB_API as string) ||
    (process.env.NEXT_PUBLIC_BACKEND_API_URL as string) ||
    ((import.meta as any)?.env?.VITE_IB_API as string) ||
    '';

  // Dev fallback: if no env provided, assume local IB server at 5001
  if (!IB_API) {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      IB_API = 'http://localhost:5001/api';
    } else {
      // Last-resort: try to use a relative API base if provided by the hosting setup
      // This assumes a reverse proxy maps /ib-api -> IB backend in production
      IB_API = '/ib-api';
    }
  }
}

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
    // Primary endpoint
    const res = await fetch(`${IB_API}/public/referrals/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode: code }),
    });
    if (res.ok) {
      const json = await res.json();
      return json?.data?.ib ?? null;
    }
    // Fallback to legacy endpoint
    const legacy = await fetch(`${IB_API}/auth/referrer-info?referralCode=${encodeURIComponent(code)}`);
    if (!legacy.ok) return null;
    const j2 = await legacy.json();
    const r = j2?.data?.referrer;
    if (!r) return null;
    return { id: r.id, name: r.fullName || r.name, email: undefined } as any;
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

// Register a referral and ensure user + ib_referrals rows
export async function registerReferral(
  code: string,
  email: string,
  fullName?: string,
  password?: string,
  phone?: string
): Promise<boolean> {
  if (!code || !email || !IB_API) return false;
  try {
    const res = await fetch(`${IB_API}/public/referrals/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode: code, email, fullName, password, phone, source: 'crm' })
    });
    if (res.ok) {
      try { localStorage.removeItem('z_referral_code'); } catch {}
      return true;
    }
    // Fallback to simple attach on older backends
    return attachReferral(code, email);
  } catch {
    // Fallback to simple attach if /register fails (network or 404)
    return attachReferral(code, email);
  }
}
