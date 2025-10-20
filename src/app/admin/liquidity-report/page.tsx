"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  BarChart3,
  Search,
  Download,
  Filter,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";

interface LiquidityData {
  id: string;
  provider: string;
  symbol: string;
  liquidityFund: number;
  pnl: number;
  profit: number;
  loss: number;
  netPnl: number;
  status: "active" | "inactive";
  lastUpdate: string;
  location?: string;
}

export default function LiquidityPoolReportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - replace with API call
  const liquidityData: LiquidityData[] = [
    {
      id: "1",
      provider: "LMAX Exchange",
      symbol: "EUR/USD",
      liquidityFund: 15000000,
      pnl: 125000,
      profit: 185000,
      loss: 60000,
      netPnl: 125000,
      status: "active",
      lastUpdate: "01 Oct 2025 12:30",
      location: "London",
    },
    {
      id: "2",
      provider: "FINOVO",
      symbol: "GBP/USD",
      liquidityFund: 12500000,
      pnl: 87500,
      profit: 142000,
      loss: 54500,
      netPnl: 87500,
      status: "active",
      lastUpdate: "01 Oct 2025 12:25",
      location: "New York",
    },
    {
      id: "3",
      provider: "XTX Markets",
      symbol: "USD/JPY",
      liquidityFund: 9800000,
      pnl: -23400,
      profit: 89500,
      loss: 112900,
      netPnl: -23400,
      status: "active",
      lastUpdate: "01 Oct 2025 12:20",
      location: "London",
    },
    {
      id: "4",
      provider: "Flow Traders",
      symbol: "AUD/USD",
      liquidityFund: 7200000,
      pnl: 67800,
      profit: 98700,
      loss: 30900,
      netPnl: 67800,
      status: "active",
      lastUpdate: "01 Oct 2025 12:15",
      location: "Amsterdam",
    },
    {
      id: "5",
      provider: "Citadel Securities",
      symbol: "USD/CAD",
      liquidityFund: 15600000,
      pnl: 156000,
      profit: 234000,
      loss: 78000,
      netPnl: 156000,
      status: "inactive",
      lastUpdate: "30 Sep 2025 18:45",
      location: "Chicago",
    },
  ];

  const filteredData = liquidityData.filter((data) => {
    const matchesSearch = data.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         data.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || data.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
        Inactive
      </span>
    );
  };

  const totalLiquidityFund = liquidityData.reduce((sum, data) => sum + data.liquidityFund, 0);
  const totalPnl = liquidityData.reduce((sum, data) => sum + data.pnl, 0);
  const totalProfit = liquidityData.reduce((sum, data) => sum + data.profit, 0);
  const totalLoss = liquidityData.reduce((sum, data) => sum + data.loss, 0);
  const totalNetPnl = liquidityData.reduce((sum, data) => sum + data.netPnl, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">Forex Liquidity Report</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Monitor forex liquidity funds, PnL, profit/loss metrics and provider performance.</p>
          </div>
          <div className="flex-shrink-0 flex gap-2">
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100">
                <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Liquidity Fund</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${(totalLiquidityFund / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-green-100">
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Liquidity PnL</p>
                <p className={`text-lg sm:text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalPnl.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-emerald-100">
                <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Profit</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  ${totalProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-red-100">
                <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Loss</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">
                  ${totalLoss.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-purple-100">
                <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Net PnL</p>
                <p className={`text-lg sm:text-2xl font-bold ${totalNetPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalNetPnl.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search providers, symbols..."
                className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liquidity Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Location
                  </th>
                  <th className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liquidity Fund
                  </th>
                  <th className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    PnL
                  </th>
                  <th className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Profit
                  </th>
                  <th className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Loss
                  </th>
                  <th className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net PnL
                  </th>
                  <th className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Last Update
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((data) => (
                  <tr key={data.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="max-w-[120px] sm:max-w-none truncate" title={data.provider}>
                        {data.provider}
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {data.symbol}
                    </td>
                    <td className="px-2 sm:px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      <span className="max-w-[100px] truncate inline-block" title={data.location}>
                        {data.location}
                      </span>
                    </td>
                    <td className="px-2 sm:px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      ${(data.liquidityFund / 1000000).toFixed(1)}M
                    </td>
                    <td className={`px-2 sm:px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium hidden md:table-cell ${data.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${data.pnl.toLocaleString()}
                    </td>
                    <td className="px-2 sm:px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium hidden lg:table-cell">
                      ${data.profit.toLocaleString()}
                    </td>
                    <td className="px-2 sm:px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium hidden lg:table-cell">
                      ${data.loss.toLocaleString()}
                    </td>
                    <td className={`px-2 sm:px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-bold ${data.netPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${data.netPnl.toLocaleString()}
                    </td>
                    <td className="px-2 sm:px-3 lg:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(data.status)}
                    </td>
                    <td className="px-2 sm:px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      <span className="text-xs">{data.lastUpdate}</span>
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