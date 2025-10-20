import { Skeleton } from "@/components/ui/skeleton";

export function WalletBalanceSkeleton() {
  const cardMaskStyle = {
    WebkitMaskImage:
      "linear-gradient(130deg, rgba(255, 255, 255, 0) 10%, rgba(255, 255, 255, 0.25) 100%)",
    maskImage:
      "linear-gradient(130deg, rgba(255, 255, 255, 0) 10%, rgba(255, 255, 255, 0.25) 100%)",
    borderRadius: "15px",
    opacity: 0.85,
    inset: 0,
    overflow: "visible",
    position: "absolute",
    zIndex: 0,
  };

  return (
    <div
      className="relative w-full md:w-[350px] text-white rounded-[15px] overflow-hidden py-[25px] pl-[30px] pr-10 dark:bg-[radial-gradient(ellipse_27%_80%_at_0%_0%,rgba(163,92,162,0.5),rgba(0,0,0,1))] bg-[radial-gradient(ellipse_27%_80%_at_0%_0%,rgba(164,145,204,1),rgba(98,66,165,1))]"
    >
      <div
        style={cardMaskStyle as React.CSSProperties}
        className="border border-black dark:border-white/75 pointer-events-none"
      />

      {/* Balance */}
      <div className="mt-2.5 relative overflow-hidden h-12">
        <Skeleton className="h-[46px] w-32 bg-white/20" />
      </div>

      {/* Last Month Info */}
      <div className="mt-[35px] flex justify-between items-center w-full">
        <Skeleton className="h-3 w-16 bg-white/20" />
      </div>
    </div>
  );
}

export function ForexAdBannerSkeleton() {
  const cardMaskStyle = {
    WebkitMaskImage:
      "linear-gradient(130deg, rgba(255, 255, 255, 0) 10%, rgba(255, 255, 255, 0.25) 100%)",
    maskImage:
      "linear-gradient(130deg, rgba(255, 255, 255, 0) 10%, rgba(255, 255, 255, 0.25) 100%)",
    borderRadius: "15px",
    opacity: 0.3,
    inset: 0,
    overflow: "visible",
    position: "absolute",
    zIndex: 0,
  };

  return (
    <div className="relative flex-1 rounded-[15px] p-[15px] bg-gradient-to-r dark:from-[#110F17] dark:to-[#1E1429] from-[#ece8fa]/80 to-white">
      <div
        style={cardMaskStyle as React.CSSProperties}
        className="border-2 border-black/25 dark:border-white/25 pointer-events-none"
      />

      <div className="space-y-6 pt-6">
        <Skeleton className="h-8 w-40 dark:bg-white/10 bg-black/10" />
        <Skeleton className="h-10 w-24 dark:bg-white/10 bg-black/10" />
      </div>
    </div>
  );
}

export function BalanceSectionSkeleton() {
  return (
    <div className="flex flex-col w-full gap-2.5 bg-[#ece8fa] dark:bg-transparent">
      <div className="flex w-full flex-col md:flex-row gap-2.5 md:h-[190px] px-2 md:px-0">
        <WalletBalanceSkeleton />
        <ForexAdBannerSkeleton />
      </div>
    </div>
  );
}

export function VerificationAlertSkeleton() {
  const maskStyle = {
    WebkitMaskImage:
      "linear-gradient(277deg, rgba(255, 255, 255, 0.1) 10%, rgba(255, 255, 255, 0.5) 100%)",
    maskImage:
      "linear-gradient(277deg, rgba(255, 255, 255, 0.1) 10%, rgba(255, 255, 255, 0.5) 100%)",
    borderRadius: "15px",
    opacity: 0.3,
    inset: 0,
    overflow: "visible",
    position: "absolute",
    zIndex: 0,
  };

  return (
    <div className="flex items-center justify-between bg-gradient-to-l to-[#ece8fa]/50 from-white dark:from-[#1E1429] dark:to-[#110F17] p-[15px] rounded-[15px] w-full relative">
      <div className="flex items-center gap-[15px] z-10">
        <Skeleton className="h-[42px] w-[42px] rounded-full dark:bg-white/10 bg-black/10" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 dark:bg-white/10 bg-black/10" />
          <Skeleton className="h-3 w-48 dark:bg-white/10 bg-black/10" />
        </div>
      </div>

      <div className="flex items-center gap-[5px] z-10">
        <Skeleton className="h-8 w-16 rounded-[10px] dark:bg-white/10 bg-black/10" />
        <Skeleton className="h-8 w-20 rounded-[10px] dark:bg-white/10 bg-black/10" />
      </div>
      <div
        style={maskStyle as React.CSSProperties}
        className="border-2 border-black/25 dark:border-white/25 pointer-events-none"
      />
    </div>
  );
}

export function AccountsSectionSkeleton() {
  return (
    <div>
      <div className="w-full h-10" />

      <div className="mb-[16px] rounded-[15px] border border-dashed border-white/10 p-[15px] pt-2.5 bg-[#ece8fa]/80 dark:bg-transparent">
        {/* Account skeletons */}
        <div className="space-y-2.5">
          <AccountSkeleton />
          <AccountSkeleton />
          <AccountSkeleton />
        </div>
      </div>
    </div>
  );
}

function AccountSkeleton() {
  const maskStyle: React.CSSProperties = {
    WebkitMaskImage:
      "linear-gradient(277deg, rgba(255, 255, 255, 0.25) 10%, rgba(255, 255, 255, 0.1) 100%)",
    maskImage:
      "linear-gradient(277deg, rgba(255, 255, 255, 0.25) 10%, rgba(255, 255, 255, 0.1) 100%)",
    borderRadius: "15px",
    opacity: 0.3,
    inset: 0,
    overflow: "visible",
    position: "absolute",
    zIndex: 0,
  };

  return (
    <div className="rounded-[15px] p-[15px] pl-[25px] bg-gradient-to-r dark:from-[#110F17] dark:to-[#1E1429] from-[#ece8fa]/80 to-white relative flex flex-col gap-5">
      <div
        style={maskStyle}
        className="border-2 border-black/50 dark:border-white/50 pointer-events-none"
      />

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2.5 w-fit min-w-56">
            <Skeleton className="h-8 w-20 dark:bg-white/10 bg-black/10" />
            <Skeleton className="h-4 w-28 dark:bg-white/10 bg-black/10" />
          </div>

          <div className="flex items-center gap-2.5">
            {[1, 2, 3].map((index) => (
              <Skeleton
                key={index}
                className="h-6 w-16 rounded-[5px] dark:bg-white/10 bg-black/10"
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-24 rounded-[10px] dark:bg-white/10 bg-black/10" />
          <Skeleton className="h-5 w-6 rounded dark:bg-white/10 bg-black/10" />
          <Skeleton className="h-5 w-5 rounded dark:bg-white/10 bg-black/10" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-[25px] dark:bg-[#01040D] bg-[#ece8fa]">
      {/* Welcome message skeleton */}
      <Skeleton className="h-8 w-48 dark:bg-white/10 bg-black/10" />

      {/* Verification alert skeleton */}
      {/* <VerificationAlertSkeleton /> */}

      {/* Balance section skeleton */}
      <BalanceSectionSkeleton />

      {/* Accounts section skeleton */}
      <AccountsSectionSkeleton />
    </div>
  );
}
