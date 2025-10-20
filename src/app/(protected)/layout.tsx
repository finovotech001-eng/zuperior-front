"use client";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import Head from "next/head";

// TypeScript declaration for Crisp
declare global {
  interface Window {
    $crisp: Array<unknown>;
    CRISP_WEBSITE_ID: string;
  }
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check authentication using localStorage
    const token = localStorage.getItem('userToken');
    const clientId = localStorage.getItem('clientId');

    if (!token || !clientId) {
      router.push("/login");
    } else {
      setAuthChecked(true); // Mark auth as confirmed
    }
  }, [router]);

  // Initialize Crisp chat after component mounts
  useEffect(() => {
    if (authChecked) {
      // Initialize Crisp chat
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = "067edae6-7a19-49e6-aaf8-b79cc4d0ce25";

      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;

      // Check if script is already loaded
      const existingScript = document.querySelector(
        'script[src="https://client.crisp.chat/l.js"]'
      );
      if (!existingScript) {
        document.head.appendChild(script);

        // Hide Crisp chat by default after it loads
        script.onload = () => {
          setTimeout(() => {
            if (window.$crisp) {
              window.$crisp.push(["do", "chat:hide"]);
            }
          }, 1000); // Wait 1 second for Crisp to fully initialize
        };
      }
    }
  }, [authChecked]);

  // Don't render layout until auth is confirmed
  if (!authChecked) return null;

  return (
    <>
      <Head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="067edae6-7a19-49e6-aaf8-b79cc4d0ce25";
              (function(){
                d=document;
                s=d.createElement("script");
                s.src="https://client.crisp.chat/l.js";
                s.async=1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `,
          }}
        />
      </Head>

      <div className="flex h-screen flex-col bg-[linear-gradient(180deg,#F7F5FC_0%,#F2EDFF_100%)] dark:bg-[#01040D]">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col gap-6 overflow-y-auto dark:bg-[#01040D]">
            <Navbar />
            <div className="lg:px-8 md:px-4 px-1 flex-1">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
