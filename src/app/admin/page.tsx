"use client";

import AdminLayout from "@/layouts/admin-layout";
import {
  Users,
  Mail,
  Shield,
  Server,
  TrendingUp,
  TrendingDown,
  Eye,
  Filter,
  ChevronLeft,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchDashboardStats } from "@/store/slices/adminStatsSlice";
import { fetchActivityLogs } from "@/store/slices/adminSlice";
import { StatCardSkeleton } from "@/components/admin/StatCardSkeleton";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { Pagination } from "@/components/admin/Pagination";
import { SearchBar } from "@/components/admin/SearchBar";
import { FilterDropdown } from "@/components/admin/FilterDropdown";
import { useState } from "react";

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboard, activityStats } = useSelector((state: RootState) => state.adminStats);
  const { activityLogs } = useSelector((state: RootState) => state.admin);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchActivityLogs({
      page: currentPage,
      limit: 10,
      search: searchQuery,
      entity: entityFilter === "all" ? "" : entityFilter,
      action: actionFilter === "all" ? "" : actionFilter,
    }));
  }, [dispatch, currentPage, searchQuery, entityFilter, actionFilter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleEntityFilter = (value: string) => {
    setEntityFilter(value);
    setCurrentPage(1);
  };

  const handleActionFilter = (value: string) => {
    setActionFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Statistics Cards Data
  const statsCards = dashboard.data ? [
    {
      title: "Total Users",
      value: dashboard.data.totalUsers.toString(),
      icon: Users,
      color: "bg-purple-500",
      subtitle: `Active: ${dashboard.data.totalUsers - dashboard.data.emailUnverified} (${Math.round(((dashboard.data.totalUsers - dashboard.data.emailUnverified) / dashboard.data.totalUsers) * 100)}%)`,
      progress: Math.round(((dashboard.data.totalUsers - dashboard.data.emailUnverified) / dashboard.data.totalUsers) * 100),
      progressColor: "bg-blue-500",
    },
    {
      title: "Email Unverified",
      value: dashboard.data.emailUnverified.toString(),
      icon: Mail,
      color: "bg-red-500",
      subtitle: `Of total users (${Math.round((dashboard.data.emailUnverified / dashboard.data.totalUsers) * 100)}%)`,
      progress: Math.round((dashboard.data.emailUnverified / dashboard.data.totalUsers) * 100),
      progressColor: "bg-red-500",
    },
    {
      title: "KYC Pending",
      value: dashboard.data.kycPending.toString(),
      icon: Shield,
      color: "bg-purple-500",
      subtitle: `Pending vs users (${Math.round((dashboard.data.kycPending / dashboard.data.totalUsers) * 100)}%)`,
      progress: Math.round((dashboard.data.kycPending / dashboard.data.totalUsers) * 100),
      progressColor: "bg-purple-500",
    },
    {
      title: "Total MT5 Accounts",
      value: dashboard.data.mt5Accounts.toString(),
      icon: Server,
      color: "bg-indigo-500",
      subtitle: `Accounts per user: ${(dashboard.data.mt5Accounts / dashboard.data.totalUsers).toFixed(2)}`,
      progress: Math.round((dashboard.data.mt5Accounts / dashboard.data.totalUsers) * 100),
      progressColor: "bg-indigo-500",
    },
  ] : [];

  // Financial Overview Data
  const financialData = dashboard.data ? [
    {
      title: "Deposits",
      total: `$${dashboard.data.totalDeposits.toFixed(2)} USD`,
      totalLabel: "Total Deposited",
      pending: dashboard.data.pendingDeposits.toString(),
      pendingLabel: "Pending Deposits",
      rejected: "0",
      rejectedLabel: "Rejected Deposits",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      stats: [
        { label: "MTD", value: `$${dashboard.data.totalDeposits.toFixed(2)}` },
        { label: "Today", value: `$${dashboard.data.totalDeposits.toFixed(2)} (vs 7-day avg $${(dashboard.data.totalDeposits / 7).toFixed(2)})` },
      ],
    },
    {
      title: "Withdrawals",
      total: `$${dashboard.data.totalWithdrawals.toFixed(2)} USD`,
      totalLabel: "Total Withdrawn",
      pending: dashboard.data.pendingWithdrawals.toString(),
      pendingLabel: "Pending Withdrawals",
      rejected: "0",
      rejectedLabel: "Rejected Withdrawals",
      icon: TrendingDown,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      stats: [
        { label: "MTD", value: `$${dashboard.data.totalWithdrawals.toFixed(2)}` },
        { label: "Today", value: `$${dashboard.data.totalWithdrawals.toFixed(2)} (vs 7-day avg $${(dashboard.data.totalWithdrawals / 7).toFixed(2)})` },
      ],
    },
  ] : [];

  // Recent Activity Data
  const recentActivity = dashboard.data ? [
    {
      title: "Recent Deposits",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      content: dashboard.data.recentActivity.filter(a => a.entity === 'deposit').length > 0 
        ? `${dashboard.data.recentActivity.filter(a => a.entity === 'deposit').length} recent deposits`
        : "No deposits yet.",
    },
    {
      title: "Recent Withdrawals",
      icon: TrendingDown,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      content: dashboard.data.recentActivity.filter(a => a.entity === 'withdrawal').length > 0 
        ? `${dashboard.data.recentActivity.filter(a => a.entity === 'withdrawal').length} recent withdrawals`
        : "No withdrawals yet.",
    },
    {
      title: "Recent Accounts Opened",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      content: dashboard.data.recentActivity.filter(a => a.entity === 'user').length > 0 
        ? `${dashboard.data.recentActivity.filter(a => a.entity === 'user').length} recent users`
        : "No recent users",
      subContent: dashboard.data.recentActivity.length > 0 
        ? new Date(dashboard.data.recentActivity[0].createdAt).toLocaleString()
        : "",
      showViewAll: true,
    },
  ] : [];

  const entityOptions = [
    { value: "user", label: "User" },
    { value: "deposit", label: "Deposit" },
    { value: "withdrawal", label: "Withdrawal" },
    { value: "kyc", label: "KYC" },
  ];

  const actionOptions = [
    { value: "create", label: "Create" },
    { value: "update", label: "Update" },
    { value: "approve", label: "Approve" },
    { value: "reject", label: "Reject" },
    { value: "delete", label: "Delete" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="text-sm text-gray-500">Realtime overview</div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dashboard.loading ? (
            <StatCardSkeleton count={4} />
          ) : (
            statsCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${card.progressColor}`}
                      style={{ width: `${card.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboard.loading ? (
            <StatCardSkeleton count={2} />
          ) : (
            financialData.map((financial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{financial.title}</h3>
                  <div className={`w-10 h-10 ${financial.bgColor} ${financial.iconBg} rounded-lg flex items-center justify-center`}>
                    <financial.icon className={`h-5 w-5 ${financial.color}`} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">{financial.totalLabel}</p>
                    <p className="text-2xl font-bold text-gray-900">{financial.total}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{financial.pendingLabel}</p>
                      <p className="text-lg font-semibold text-gray-900">{financial.pending}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{financial.rejectedLabel}</p>
                      <p className="text-lg font-semibold text-gray-900">{financial.rejected}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    {financial.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">{stat.label}</span>
                        <span className="text-sm font-medium text-gray-900">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboard.loading ? (
            <StatCardSkeleton count={3} />
          ) : (
            recentActivity.map((activity, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 ${activity.bgColor} rounded-lg flex items-center justify-center`}>
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                  </div>
                  {activity.showViewAll && (
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View all
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">{activity.content}</p>
                  {activity.subContent && (
                    <p className="text-sm text-gray-500">{activity.subContent}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* All Activity Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Activity</h2>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Type</span>
                <FilterDropdown
                  options={entityOptions}
                  value={entityFilter}
                  onValueChange={handleEntityFilter}
                  placeholder="All Types"
                  className="w-32"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Action</span>
                <FilterDropdown
                  options={actionOptions}
                  value={actionFilter}
                  onValueChange={handleActionFilter}
                  placeholder="All Actions"
                  className="w-32"
                />
              </div>

              <div className="flex items-center space-x-2">
                <SearchBar
                  placeholder="Search activity..."
                  onSearch={handleSearch}
                  className="w-48"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {activityLogs.loading ? (
              <TableSkeleton rows={5} columns={7} />
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activityLogs.list.map((activity, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(activity.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.entity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.userId || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.action === 'approve' ? 'bg-green-100 text-green-800' :
                          activity.action === 'reject' ? 'bg-red-100 text-red-800' :
                          activity.action === 'create' ? 'bg-blue-100 text-blue-800' :
                          activity.action === 'update' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.entityId || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.newValues ? 'Updated' : activity.oldValues ? 'Created' : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!activityLogs.loading && activityLogs.total > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(activityLogs.total / 10)}
              onPageChange={handlePageChange}
              totalItems={activityLogs.total}
              itemsPerPage={10}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}