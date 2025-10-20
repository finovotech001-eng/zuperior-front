"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  MailX,
  Shield,
  Settings,
  Server,
  Database,
  Wallet,
  CreditCard,
  ArrowLeftRight,
  BookOpen,
  TrendingUp,
  Mail,
  BarChart3,
  Activity,
  LogOut,
  Menu,
  X,
  ChevronDown,
  FileText,
  Calculator,
  Network,
  Zap,
  QrCode,
  Layers,
  UserCog,
  Building2,
  Target,
  UserCircle,
  Clock,
  CheckCircle,
  XCircle,
  Coins,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const pathname = usePathname();

  const navigation = useMemo(() => [
    {
      id: "dashboard",
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    {
      id: "clients",
      name: "CLIENTS & ACCESS",
      icon: Users,
      children: [
        { name: "Manage Users", href: "/admin/users", icon: Users },
        { name: "Add User", href: "/admin/users/add", icon: UserPlus },
        { name: "All Users", href: "/admin/users/all", icon: Users },
        { name: "Active Users", href: "/admin/users/active", icon: UserCheck },
        { name: "Banned Users", href: "/admin/users/banned", icon: UserX },
        { name: "Email Unverified", href: "/admin/users/email-unverified", icon: MailX },
        { name: "KYC Unverified", href: "/admin/users/kyc-unverified", icon: Shield },
        { name: "KYC Pending", href: "/admin/users/kyc-pending", icon: Clock },
        { name: "With Balance", href: "/admin/users/with-balance", icon: Wallet },
        { name: "KYC Verifications", href: "/admin/kyc", icon: Shield },
        { name: "Manage MT5 Groups", href: "/admin/mt5-groups", icon: Database },
        { name: "Activity / Login Logs", href: "/admin/activity-logs", icon: Activity },
      ],
    },
    {
      id: "mt5",
      name: "MT5 MANAGEMENT",
      icon: Server,
      children: [
        { name: "MT5 Management", href: "/admin/mt5", icon: Server },
        { name: "MT5 Users List", href: "/admin/mt5/users", icon: Users },
        { name: "Assign MT5 to Email", href: "/admin/mt5/assign-email", icon: UserPlus },
        { name: "Internal Transfer", href: "/admin/mt5/internal-transfer", icon: ArrowLeftRight },
      ],
    },
    {
      id: "finance",
      name: "FINANCE & OPS",
      icon: Wallet,
      children: [
        {
          name: "Manage Deposits",
          icon: TrendingUp,
          children: [
            { name: "Pending Deposits", href: "/admin/deposits/pending", icon: Clock },
            { name: "Approved Deposits", href: "/admin/deposits/approved", icon: CheckCircle },
            { name: "Rejected Deposits", href: "/admin/deposits/rejected", icon: XCircle },
            { name: "All Deposits", href: "/admin/deposits", icon: CreditCard },
          ],
        },
        {
          name: "Manage Withdrawals",
          icon: ArrowLeftRight,
          children: [
            { name: "Pending Withdrawals", href: "/admin/withdrawals/pending", icon: Clock },
            { name: "Approved Withdrawals", href: "/admin/withdrawals/approved", icon: CheckCircle },
            { name: "Rejected Withdrawals", href: "/admin/withdrawals/rejected", icon: XCircle },
            { name: "All Withdrawals", href: "/admin/withdrawals", icon: Wallet },
          ],
        },
        { name: "Payment Gateways", href: "/admin/gateways", icon: CreditCard },
        {
          name: "Automatic Gateways",
          href: "/admin/gateways/automatic",
          icon: Zap,
        },
        { name: "Manual Gateways", href: "/admin/gateways/manual", icon: Settings },
        { name: "USDT Gateway", href: "/admin/gateways/usdt", icon: Coins },
        { name: "Wallet QR Upload", href: "/admin/gateways/wallet-qr", icon: QrCode },
        { name: "Bulk Operations Log", href: "/admin/bulk-operations", icon: FileText },
      ],
    },
    {
      id: "books",
      name: "BOOK MANAGEMENT",
      icon: BookOpen,
      children: [
        { name: "Book Management", href: "/admin/books", icon: BookOpen },
        { name: "A Book Management", href: "/admin/books/a-book", icon: FileText },
        { name: "B Book Management", href: "/admin/books/b-book", icon: FileText },
        { name: "Combined Book", href: "/admin/books/combined", icon: Layers },
        { name: "Liquidity Pool Report", href: "/admin/liquidity-report", icon: BarChart3 },
      ],
    },
    {
      id: "ib",
      name: "IB MANAGEMENT",
      icon: Network,
      children: [
        { name: "IB Management", href: "/admin/ib", icon: Network },
        { name: "IB Dashboard", href: "/admin/ib/dashboard", icon: LayoutDashboard },
        { name: "IB Requests", href: "/admin/ib/requests", icon: UserPlus },
        { name: "IB Profiles", href: "/admin/ib/profiles", icon: Users },
        { name: "Set IB Commission", href: "/admin/ib/commission", icon: Calculator },
        { name: "Set IB Structure", href: "/admin/ib/structure", icon: Building2 },
        { name: "IB Withdrawals", href: "/admin/ib/withdrawals", icon: Wallet },
        { name: "Move User to IB", href: "/admin/ib/move-user", icon: ArrowLeftRight },
        { name: "IB Plans", href: "/admin/ib/plans", icon: Target },
        { name: "Manage IBs", href: "/admin/ib/manage", icon: UserCog },
        { name: "Commission Logs", href: "/admin/ib/commission-logs", icon: FileText },
      ],
    },
    {
      id: "marketing",
      name: "MARKETING",
      icon: Mail,
      children: [
        { name: "Send News", href: "/admin/marketing/news", icon: FileText },
        { name: "Send Signals", href: "/admin/marketing/signals", icon: TrendingUp },
        { name: "Send Emails", href: "/admin/marketing/emails", icon: Mail },
        { name: "Send Analysis", href: "/admin/marketing/analysis", icon: BarChart3 },
      ],
    },
    {
      id: "reports",
      name: "REPORTS",
      icon: BarChart3,
      children: [
        { name: "Book PnL", href: "/admin/reports/book-pnl", icon: Calculator },
        { name: "Profit & Loss", href: "/admin/reports/profit-loss", icon: TrendingUp },
        { name: "LP Statement", href: "/admin/reports/lp-statement", icon: FileText },
        { name: "Partner Report", href: "/admin/reports/partner", icon: Network },
      ],
    },
    {
      id: "system",
      name: "SYSTEM",
      icon: Settings,
      children: [
        { name: "MT5 Connection", href: "/admin/system/mt5", icon: Server },
        { name: "SMTP Connection", href: "/admin/system/smtp", icon: Mail },
        { name: "Settings", href: "/admin/system/settings", icon: Settings },
        { name: "Roles", href: "/admin/system/roles", icon: Shield },
        { name: "Assign Roles", href: "/admin/system/assign-roles", icon: UserCog },
        { name: "Admin Profile", href: "/admin/profile", icon: UserCircle },
        { name: "Logout", href: "/admin/logout", icon: LogOut },
      ],
    },
  ], []);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Auto-open sections based on current pathname
  useEffect(() => {
    const currentOpenSections: string[] = [];

    navigation.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(child =>
          pathname === child.href ||
          (child.children && child.children.some(grandChild => pathname === grandChild.href))
        );
        if (hasActiveChild) {
          currentOpenSections.push(item.id);
        }
      }
    });

    setOpenSections(currentOpenSections);
  }, [pathname, navigation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 flex overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex border-r border-gray-200 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-900 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-white">Zuperior</h1>
              <p className="text-xs text-violet-200">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-violet-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto admin-scrollbar">
          {navigation.map((item) => (
            <div key={item.id}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      openSections.includes(item.id)
                        ? 'text-violet-700 bg-violet-50 border-l-4 border-violet-500 shadow-sm'
                        : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50/50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      openSections.includes(item.id)
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-violet-100 group-hover:text-violet-700'
                    }`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openSections.includes(item.id) ? 'rotate-180 text-violet-500' : 'text-gray-400'}`} />
                  </button>
                  <AnimatePresence>
                    {openSections.includes(item.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut"
                        }}
                        className="mt-2 space-y-1 ml-4 overflow-hidden"
                      >
                        {item.children.map((child, index) => (
                          <motion.div
                            key={child.href || child.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                              duration: 0.2,
                              delay: index * 0.05
                            }}
                          >
                            {child.children ? (
                              // Handle nested children (like Manage Deposits/Manage Withdrawals)
                              <div className="space-y-1">
                                <div className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                                  pathname === child.href
                                    ? 'text-violet-700 bg-violet-50 border-l-4 border-violet-500'
                                    : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50/50'
                                }`}>
                                  {child.icon && (
                                    <div className={`p-1.5 rounded-md mr-3 ${
                                      pathname === child.href ? 'bg-violet-100' : 'bg-gray-100'
                                    }`}>
                                      <child.icon className={`h-4 w-4 ${
                                        pathname === child.href ? 'text-violet-600' : 'text-gray-500'
                                      }`} />
                                    </div>
                                  )}
                                  <span>{child.name}</span>
                                </div>
                                {child.children && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-6 space-y-1 overflow-hidden"
                                  >
                                    {child.children.map((grandChild, grandIndex) => (
                                      <motion.div
                                        key={grandChild.href}
                                        initial={{ x: -15, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{
                                          duration: 0.2,
                                          delay: grandIndex * 0.03
                                        }}
                                      >
                                        <Link
                                          href={grandChild.href}
                                          className={`group flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                                            pathname === grandChild.href
                                              ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md border-l-4 border-purple-400'
                                              : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50/70 hover:translate-x-1'
                                          }`}
                                        >
                                          <div className={`p-1.5 rounded-md mr-3 ${
                                            pathname === grandChild.href
                                              ? 'bg-white/20'
                                              : 'bg-gray-100 group-hover:bg-violet-100'
                                          }`}>
                                            <grandChild.icon className={`h-4 w-4 ${
                                              pathname === grandChild.href ? 'text-white' : 'text-gray-500 group-hover:text-violet-600'
                                            }`} />
                                          </div>
                                          <span className="font-medium">{grandChild.name}</span>
                                          {pathname === grandChild.href && (
                                            <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                                          )}
                                        </Link>
                                      </motion.div>
                                    ))}
                                  </motion.div>
                                )}
                              </div>
                            ) : (
                              <Link
                                href={child.href || '#'}
                                className={`group flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                                  pathname === child.href
                                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md border-l-4 border-purple-400'
                                    : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50/70 hover:translate-x-1'
                                }`}
                              >
                                {child.icon && (
                                  <div className={`p-1.5 rounded-md mr-3 ${
                                    pathname === child.href
                                      ? 'bg-white/20'
                                      : 'bg-gray-100 group-hover:bg-violet-100'
                                  }`}>
                                    <child.icon className={`h-4 w-4 ${
                                      pathname === child.href ? 'text-white' : 'text-gray-500 group-hover:text-violet-600'
                                    }`} />
                                  </div>
                                )}
                                <span className="font-medium">{child.name}</span>
                                {pathname === child.href && (
                                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                                )}
                              </Link>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg border-l-4 border-purple-400'
                      : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50/70 hover:translate-x-1'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-3 ${
                    pathname === item.href
                      ? 'bg-white/20'
                      : 'bg-gray-100 group-hover:bg-violet-100 group-hover:text-violet-600'
                  }`}>
                    <item.icon className={`h-5 w-5 ${
                      pathname === item.href ? 'text-white' : 'text-gray-500 group-hover:text-violet-600'
                    }`} />
                  </div>
                  <span className="flex-1">{item.name}</span>
                  {pathname === item.href && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="flex-shrink-0 p-4 bg-gradient-to-r from-gray-50 to-violet-50 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@zuperior.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all duration-200"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-6">
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-900">Welcome back, Admin</div>
                <div className="text-xs text-gray-500">Manage your platform efficiently</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <UserCircle className="h-6 w-6 text-white" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">Admin User</div>
                  <div className="text-xs text-gray-500">Super Admin</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gradient-to-br from-white via-gray-50/50 to-violet-50/20 overflow-y-auto scrollbar-thin scrollbar-track-gray-50 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          <div className="p-4 sm:p-6 lg:p-8 min-h-full">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              © 2024 ZuperiorX. All rights reserved.
            </div>
            <div className="text-sm text-gray-500">
              ZuperiorX copyright reserved
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
};

export default AdminLayout;