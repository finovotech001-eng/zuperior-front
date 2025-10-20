// hoc/withAuth.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

import { ReactNode } from "react";

type PropsWithChildren = {
  children: ReactNode;
};

export function withAuth<T extends PropsWithChildren>(
  WrappedComponent: React.ComponentType<T>
) {
  return function AuthComponent(props: T) {
    const clientId = useAppSelector((state) => state.auth.clientId);
    const router = useRouter();

    useEffect(() => {
      if (!clientId) {
        router.replace("/login");
      }
    }, [clientId, router]);

    if (!clientId) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}