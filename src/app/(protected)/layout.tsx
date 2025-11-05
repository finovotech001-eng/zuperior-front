"use client";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import Head from "next/head";
import { fetchKycStatus } from "@/store/slices/kycSlice";
import { useSessionCheck } from "@/hooks/useSessionCheck";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [authChecked, setAuthChecked] = useState(false);
  
  // Enable session checking (WebSocket + polling) for account deletion
  useSessionCheck();

  useEffect(() => {
    // Check authentication using localStorage
    const token = localStorage.getItem('userToken');
    const clientId = localStorage.getItem('clientId');

    if (!token || !clientId) {
      router.push("/login");
    } else {
      setAuthChecked(true); // Mark auth as confirmed
      
      // Fetch KYC status from database (non-blocking)
      dispatch(fetchKycStatus()).catch((error) => {
        console.error("Failed to load KYC status:", error);
        // Continue even if KYC fetch fails - don't block the app
      });
    }
  }, [router, dispatch]);

  // Get user data for Crisp
  const userData = useAppSelector((state) => state.user.data);
  
  // Initialize Crisp chat after component mounts
  useEffect(() => {
    if (authChecked && userData) {
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

        // Set user data in Crisp and hide chat by default
        script.onload = () => {
          setTimeout(() => {
            if (window.$crisp) {
              // Set user identity for chat
              window.$crisp.push(["set", "user:email", userData.email1 || ""]);
              window.$crisp.push(["set", "user:nickname", userData.accountname || ""]);
              
              // Add custom data
              window.$crisp.push(["set", "session:data", [[["user_id", localStorage.getItem('userId') || ""], ["account_name", userData.accountname || ""]]]]);
              
              // Hide Crisp chat by default
              window.$crisp.push(["do", "chat:hide"]);
            }
          }, 1000); // Wait 1 second for Crisp to fully initialize
        };
      }
    }
  }, [authChecked, userData]);

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
