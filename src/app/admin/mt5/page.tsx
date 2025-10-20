"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Server,
  Activity,
  Database,
  Wifi,
  WifiOff,
} from "lucide-react";

interface MT5Account {
  id: string;
  login: string;
  name: string;
  group: string;
  balance: number;
  equity: number;
  status: "online" | "offline";
  lastSeen: string;
}

export default function MT5ManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - replace with API call
  const mt5Accounts: MT5Account[] = [
    {
      id: "1",
      login: "100001",
      name: "John Doe",
      group: "demo\\standard",
      balance: 10000.00,
      equity: 10500.00,
      status: "online",
      lastSeen: "2 minutes ago",
    },
    {
      id: "2",
      login: "100002",
      name: "Jane Smith",
      group: "real\\ecn",
      balance: 25000.50,
      equity: 24800.25,
      status: "offline",
      lastSeen: "1 hour ago",
    },
    {
      id: "3",
      login: "100003",
      name: "Mike Johnson",
      group: "real\\pro",
      balance: 5000.75,
      equity: 5100.00,
      status: "online",
      lastSeen: "5 minutes ago",
    },
  ];

  const filteredAccounts = mt5Accounts.filter((account) => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.login.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || account.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === "online" ? (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
        <Wifi className="h-3 w-3 mr-1" />
        Online
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
        <WifiOff className="h-3 w-3 mr-1" />
        Offline
      </span>
    );
  };

  const stats = [
    { label: "Total Accounts", value: mt5Accounts.length, icon: Database, color: "bg-blue-500" },
    { label: "Online", value: mt5Accounts.filter(a => a.status === "online").length, icon: Wifi, color: "bg-green-500" },
    { label: "Offline", value: mt5Accounts.filter(a => a.status === "offline").length, icon: WifiOff, color: "bg-red-500" },
    { label: "Total Balance", value: `$${mt5Accounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}`, icon: Activity, color: "bg-purple-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Server className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">MT5 Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage MT5 trading accounts and connections.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`p-2 sm:p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{stat.label}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search accounts..."
                className="w-full pl-3 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Login
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equity
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {account.login}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {account.name}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.group}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${account.balance.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${account.equity.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(account.status)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.lastSeen}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm">
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900 text-xs sm:text-sm">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}