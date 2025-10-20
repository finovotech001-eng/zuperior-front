import {Sidebar} from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-zuperior-darker">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-zuperior-dark px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  );
}