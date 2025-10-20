// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface SidebarToggleProps {
//   collapsed: boolean;
//   onToggle: () => void;
// }

// export function SidebarToggle({ collapsed, onToggle }: SidebarToggleProps) {
//   return (
//     <Button
//       onClick={onToggle}
//       className={cn(
//         "rounded-full absolute -right-5 top-15 z-100 font-bold mx-auto w-9 cursor-pointer border",
//         "bg-white text-[#A35CA2] hover:bg-gray-100 border-gray-200",
//         "dark:bg-[#01040D] dark:text-white dark:hover:bg-[#01040D] dark:border-[#1a2032]"
//       )}
//     >
//       {collapsed ? (
//         <ChevronRight className="h-12 w-12" />
//       ) : (
//         <ChevronLeft className="h-12 w-12" />
//       )}
//     </Button>
//   );
// }



import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ collapsed, onToggle }: SidebarToggleProps) {
  return (
    <Button
      onClick={onToggle}
      className={cn(
        "hidden lg:flex rounded-full absolute -right-5 top-15 z-100 font-bold mx-auto w-9 cursor-pointer border",
        "bg-white text-[#A35CA2] hover:bg-gray-100 border-gray-200",
        "dark:bg-[#01040D] dark:text-white dark:hover:bg-[#01040D] dark:border-[#1a2032]"
      )}
    >
      {collapsed ? (
        <ChevronRight className="h-12 w-12" />
      ) : (
        <ChevronLeft className="h-12 w-12" />
      )}
    </Button>
  );
}