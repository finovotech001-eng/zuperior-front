"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ResetMainPasswordDialog } from "./ResetPasswordDialog";
// function maskEmail(email: string) {
//   if (!email) return "";
//   const [user, domain] = email.split("@");
//   if (!user || !domain) return email;
//   const firstChar = user[0];
//   const lastChar = user[user.length - 1];
//   if (user.length <= 2) {
//     return `${firstChar}****@${domain}`;
//   }
//   return `${firstChar}${"*".repeat(user.length - 2)}${lastChar}@${domain}`;
// }


export default function SecurityTab() {
  const user = useSelector((state: RootState) => state.user.data);
  // Replace with actual user data/fetch
  const maskedEmail = (user?.email1 ?? "unknown@example.com");
  // dialog toggle state
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <div className="space-y-10 mt-4 text-white">
      {/* Authorization Section */}
      <section>
        <h2 className="text-[34px] font-semibold mb-1 dark:text-white/75 text-black">Authorization</h2>
        <p className="text-sm  dark:text-white/75 text-black mb-4">
          Change your password whenever you think it might have been
          compromised.
        </p>
        <div className="border dark:border-white/10 border-black/10 rounded-xl overflow-hidden dark:bg-[#191a22]">
          <div className="flex items-center justify-between p-5 border-b dark:border-white/10 border-black/10">
            <div>
              <div className="text-sm font-medium dark:text-white/75 text-black">Login</div>
              <div className="font-semibold dark:text-white/75 text-black mt-1">{maskedEmail}</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-5">
            <div>
              <div className="text-sm font-medium dark:text-white/75 text-black">Password</div>
              <div className="tracking-widest text-[34px] font-semibold dark:text-white/75 text-black mt-1">
                ••••••••
              </div>
            </div>
            <Button
              variant="secondary"
              className="min-w-[110px] bg-gradient-to-tr to-[#9F8BCF] from-[#6242A5] 
                         dark:bg-gradient-to-tr dark:from-[#232438] dark:to-[#141414] 
                        dark:text-white text-white border-none"
              onClick={() => setChangePasswordOpen(true)}
            >
              Change
            </Button>
          </div>
        </div>
      </section>

      {/* Reset Main Account Password Dialog */}
      <ResetMainPasswordDialog
        email={user?.email1 ?? ""}
        open={changePasswordOpen}
        onOpen={setChangePasswordOpen}
      />

      {/* 2-Step Verification Section */}
      {/* <section>
        <h2 className="text-2xl font-bold mb-1 text-white">
          2-Step verification
        </h2>
        <p className="text-gray-400 mb-4 text-sm">
          2-step verification ensures that all sensitive transactions are
          authorized by you.
          <br />
          We encourage you to enter verification codes to confirm these
          transactions.
        </p>
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#191a22]">
          <div className="flex items-center justify-between p-5">
            <div>
              <div className="text-sm font-medium text-gray-300">
                Security type
              </div>
              <div className="font-semibold text-white mt-1">{maskedEmail}</div>
            </div>
            <Button
              variant="secondary"
              className="min-w-[110px] bg-[#232438] text-white border-none"
            >
              Change
            </Button>
          </div>
        </div>
      </section> */}
      {/* Account security and termination Section */}

      {/* <section>
        <h2 className="text-2xl font-bold mb-1 text-white">
          Account security and termination
        </h2>
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#191a22]">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div>
              <div className="font-medium text-white mb-2">
                Log out from all other devices except this one to secure your
                account.
              </div>
            </div>
            <Button
              variant="destructive"
              className="bg-[#2a1c1c] text-red-400 border-none min-w-[220px]"
            >
              Log out from other devices
            </Button>
          </div>
          <div className="flex items-center justify-between p-5">
            <div>
              <div className="font-medium text-white">
                This action cannot be reversed.
              </div>
            </div>
            <Button
              variant="destructive"
              className="bg-[#2a1c1c] text-red-400 border-none min-w-[220px] flex items-center gap-1"
            >
              Terminate Zuperior Personal Area
            </Button>
          </div>
        </div>
      </section> */}
    </div>
  );
}

