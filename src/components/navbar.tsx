"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "../components/ui/button";
import { authService } from "@/services/api.service";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useLoading } from "@/context/LoadingContext";

// Icons
import Sun from "@/assets/icons/sun.png";
import MoonDark from "@/assets/icons/moonDark.png";
// import Globe from "@/assets/globe.svg";
// import GlobeDark from "@/assets/icons/globeDark.png";
// import Qr from "@/assets/icons/qr.png";
// import QrDark from "@/assets/icons/qrDark.png";
// import Bell from "@/assets/icons/bell.png";
// import BellDark from "@/assets/icons/bellDark.png";
import Wallet from "@/assets/icons/wallet.png";
import Profile from "@/assets/icons/profile.png";
import ProfileDark from "@/assets/icons/userDark.png";
import { CircleUser, Headset, LogOut, Settings } from "lucide-react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  };

  const userDetails = getUserData();
  const fullName = userDetails?.name ?? "";
  const firstName = fullName.split(" ")[0] ?? "";

  const handleLogoutWithDelay = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      authService.logout();
      setIsLoggingOut(false);
      setLogoutDialogOpen(false);
    }, 1000);
  };

  return (
    <header className="sticky top-0 flex py-5 items-center justify-between border-b border-black/10 dark:border-white/10 bg-white dark:bg-[#01040D] px-[15px] z-20">
      {/* Right Side */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* <Button className="rounded-[10px] flex items-center gap-[5px] py-2 px-6 text-white bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-xs leading-[14px] cursor-pointer">
          Balance:
          <p>${formattedBalance}</p>
        </Button> */}

        <Link href="/deposit">
          <Button className="hidden md:flex rounded-[10px] items-center gap-[5px] py-2 px-6 text-white dark:bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-xs leading-[14px] cursor-pointer [background:radial-gradient(ellipse_27%_80%_at_0%_0%,rgba(163,92,162,0.5),rgba(0,0,0,1))] hover:bg-transparent">
            Deposit
            <Image className="h-5 w-5" src={Wallet} alt="Wallet" />
          </Button>
        </Link>

        <div className="w-px h-4 bg-black/25 dark:bg-white/25 hidden md:flex" />

        {/* Icons */}
        <div className="flex items-center gap-2.5 ">
          <Image
            className="h-5 w-5 cursor-pointer"
            src={theme === "dark" ? Sun : MoonDark}
            alt="Toggle Theme"
            onClick={toggleTheme}
          />
          {/* <Image
            className="h-5 w-5 cursor-pointer hidden md:flex"
            src={theme === "dark" ? Globe : GlobeDark}
            alt="Globe"
          /> */}
          {/* <Image
            className="h-5 w-5 cursor-pointer hidden md:flex"
            src={theme === "dark" ? Qr : QrDark}
            alt="QR"
          /> */}
          {/* <Image
            className="h-5 w-5 cursor-pointer"
            src={theme === "dark" ? Bell : BellDark}
            alt="Bell"
          /> */}
        </div>

        <div className="w-px h-4 bg-black/25 dark:bg-white/25 hidden md:flex" />

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center cursor-pointer gap-px text-xs text-black dark:text-white font-semibold">
              {firstName}
              <Image
                className="h-6 w-7 rounded-full"
                src={theme === "dark" ? Profile : ProfileDark}
                alt="Profile"
              />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="end"
            className="px-[25px] pt-2.5 pb-[15px] dark:bg-[#01040D] border border-t-0 border-[#9F8BCF]/25 rounded-b-[10px] rounded-t-none mt-[22px] space-y-2.5">
            <DropdownMenuItem asChild>
              <div className="flex items-center w-full gap-2 ">
                {/* <Image className="h-6 w-6" src={user} alt="User" /> */}
                <CircleUser
                  style={{ height: 30, width: 30 }}
                  className="text-black dark:text-white/75"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-black dark:text-white/75 font-bold">
                    {userDetails?.name || firstName}
                  </p>
                  <p className="text-xs text-black dark:text-white/50 font-medium">
                    {userDetails?.email}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>

            <div className="w-full h-px dark:bg-white/10 bg-black/10" />

            <div className="flex flex-col gap-1 ">
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 text-black dark:text-white/50 dark:hover:text-white transition w-full">
                  <Settings
                    size={20}
                    className="text-black dark:text-white/75 "
                  />
                  <span>Profile Settings</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href="/support"
                  className="flex items-center gap-2 text-black dark:text-white/50 dark:hover:text-white cursor-pointer">
                  <Headset
                    className="text-black dark:text-white/75"
                    size={20}
                  />
                  <span>Help Desk</span>
                </Link>
              </DropdownMenuItem>
            </div>

            <div className="w-full h-px dark:bg-white/10 bg-black/10" />

            {/* Logout Menu Item */}
            <DropdownMenuItem
              className="flex items-center gap-2 text-black dark:text-white/75 dark:hover:text-white cursor-pointer"
              onClick={() => setLogoutDialogOpen(true)}>
              {/* <Image className="h-5 w-5" src={logoutIcon} alt="Logout" /> */}
              <LogOut className="text-black dark:text-white/75" size={20} />
              <span className="text-md cursor-pointer">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Logout Confirmation Dialog */}
        <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <DialogContent className="sm:max-w-[425px] px-6 py-6">
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to logout? You will need to login again to
                continue.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between gap-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setLogoutDialogOpen(false)}
                disabled={isLoggingOut}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="cursor-pointer flex items-center justify-center gap-2"
                onClick={handleLogoutWithDelay}
                disabled={isLoggingOut}>
                {isLoggingOut && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
