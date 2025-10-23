import { NextRequest, NextResponse } from "next/server";

// Detect country from common CDN/proxy headers, with optional IP lookup fallback
export async function GET(req: NextRequest) {
  try {
    const headers = req.headers;

    const headerCandidates = [
      "x-vercel-ip-country",
      "cf-ipcountry",
      "x-country-code",
      "x-geo-country",
      "x-fastly-country-code",
      "x-appengine-country",
    ];

    for (const key of headerCandidates) {
      const val = headers.get(key);
      if (val && !["", "XX", "ZZ", "unknown"].includes(val)) {
        return NextResponse.json({
          success: true,
          countryCode: val.toLowerCase(),
          source: `header:${key}`,
        });
      }
    }

    // Fallback: external IP-based service (best-effort)
    const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const url = ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/";

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const code: string | undefined =
          (data?.country_code || data?.country || "").toString().toLowerCase();
        if (code) {
          return NextResponse.json({ success: true, countryCode: code, source: "ipapi" });
        }
      }
    } catch {
      // Ignore fallback failure; return graceful default below
    }

    return NextResponse.json({ success: false, countryCode: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, countryCode: null, error: (error as Error)?.message },
      { status: 500 }
    );
  }
}

