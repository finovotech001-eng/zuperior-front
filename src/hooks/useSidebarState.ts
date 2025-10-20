import { useState, useEffect } from "react";

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const openSidebar = () => setCollapsed(false);
  const closeSidebar = () => setCollapsed(true);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return {
    collapsed,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  };
}
