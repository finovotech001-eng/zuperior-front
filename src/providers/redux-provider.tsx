"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import ClientOnly from "@/components/client-only";

interface ReduxProviderProps {
  children: ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    // Render Provider only after client-side mount to avoid hydration mismatch
    <ClientOnly>
      <Provider store={store}>{children}</Provider>
    </ClientOnly>
  );
}
