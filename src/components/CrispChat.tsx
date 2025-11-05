"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function CrispChat() {
  const user = useSelector((state: RootState) => state.user.data);

  useEffect(() => {
    // Initialize Crisp only on client side
    if (typeof window !== "undefined") {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = "2bc30c4e-89dd-4af3-b755-adb8f02f7324";

      // Create and append the script
      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      
      // Append to head
      document.getElementsByTagName("head")[0].appendChild(script);

      // Hide chat by default (will be shown only in support hub)
      script.onload = () => {
        if (window.$crisp) {
          window.$crisp.push(["do", "chat:hide"]);
          
          // Set user information if available
          if (user) {
            // Set user email
            if (user.email1) {
              window.$crisp.push(["set", "user:email", user.email1]);
            }
            
            // Set user name
            const userName = user.accountname;
            if (userName) {
              window.$crisp.push(["set", "user:nickname", userName]);
            }
            
            // Set user phone if available
            if (user.phone) {
              window.$crisp.push(["set", "user:phone", user.phone]);
            }
            
            // Set additional user data
            window.$crisp.push([
              "set",
              "session:data",
              [
                [
                  ["crm_account_id", user.crm_account_id?.toString() || "N/A"],
                  ["account_name", user.accountname || "N/A"],
                  ["verification_status", user.verification_status || "N/A"],
                ],
              ],
            ]);
          }
        }
      };
    }

    // Cleanup function
    return () => {
      // Optional: Clean up Crisp when component unmounts
      if (typeof window !== "undefined" && window.$crisp) {
        window.$crisp.push(["do", "chat:hide"]);
      }
    };
  }, [user]);

  return null; // This component doesn't render anything
}

