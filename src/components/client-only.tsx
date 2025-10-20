"use client";

import { useEffect, useState, ReactNode } from "react";

export default function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // Return a placeholder to avoid SSR/CSR mismatch
    return <div suppressHydrationWarning />;
  }

  return <>{children}</>;
}
