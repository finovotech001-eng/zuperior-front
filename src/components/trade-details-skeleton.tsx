import { Skeleton } from "./ui/skeleton";

const TradeDetailsSkeleton = () => {
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
    <div className="rounded-[15px] p-[15px] pl-[25px] bg-gradient-to-r dark:from-[#110F17] dark:to-[#1E1429] mb-2.5 relative flex flex-col gap-5">
      <div style={maskStyle} className="border-2 border-black/50 dark:border-white/50 pointer-events-none"/>

      {/* Header with account details */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2.5 w-fit min-w-64">
            <Skeleton className="h-8 w-24 dark:bg-white/10 bg-black/10" />
            <Skeleton className="h-4 w-32 dark:bg-white/10 bg-black/10" />
          </div>

          <div className="flex items-center gap-2.5">
            {[1, 2, 3].map((index) => (
              <Skeleton key={index} className="h-6 w-16 rounded-[5px] dark:bg-white/10 bg-black/10" />
            ))}
          </div>
        </div>

        {/* buttons skeleton */}
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-24 rounded-[10px] dark:bg-white/10 bg-black/10" />
          <Skeleton className="h-6 w-6 rounded dark:bg-white/10 bg-black/10" />
          <Skeleton className="h-5 w-5 rounded dark:bg-white/10 bg-black/10" />
        </div>
      </div>
    </div>
  );
};

export default TradeDetailsSkeleton;
