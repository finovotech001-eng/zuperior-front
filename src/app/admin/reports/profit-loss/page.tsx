"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Filter,
  BarChart3,
} from "lucide-react";

interface ProfitLossData {
  id: string;
  period: string;
  grossPnL: number;
  netPnL: number;
  commission: number;
  swaps: number;
  volume: number;
  trades: number;
  winRate: number;
  profitFactor: number;
}

export default function ProfitLossPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("period");

  // Mock data - replace with API call
  const profitLossData: ProfitLossData[] = [
    {
      id: "1",
      period: "October 2025",
      grossPnL: 45680.50,
      netPnL: 42150.75,
      commission: -2458.30,
      swaps: -71.45,
      volume: 8500000,
      trades: 456,
      winRate: 67.2,
      profitFactor: 2.45,
    },
    {
      id: "2",
      period: "September 2025",
      grossPnL: 38290.25,
      netPnL: 35620.80,
      commission: -1980.50,
      swaps: -688.95,
      volume: 7200000,
      trades: 389,
      winRate: 61.8,
      profitFactor: 1.89,
    },
    {
      id: "3",
      period: "August 2025",
      grossPnL: -15420.75,
      netPnL: -18250.20,
      commission: -1245.80,
      swaps: -583.65,
      volume: 5800000,
      trades: 312,
      winRate: 45.6,
      profitFactor: 0.78,
    },
  ];

  const filteredData = profitLossData.filter((data) =>
    data.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPnLBadge = (amount: number) => {
    if (amount > 0) {
      return (
        <span className="inline-flex items-center text-green-600 font-medium">
          <TrendingUp className="h-4 w-4 mr-1" />
          ${amount.toLocaleString()}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center text-red-600 font-medium">
          <TrendingDown className="h-4 w-4 mr-1" />
          ${Math.abs(amount).toLocaleString()}
        </span>
      );
    }
  };

  const totalGrossPnL = profitLossData.reduce((sum, data) => sum + data.grossPnL, 0);
  const totalNetPnL = profitLossData.reduce((sum, data) => sum + data.netPnL, 0);
  const totalVolume = profitLossData.reduce((sum, data) => sum + data.volume, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">Profit & Loss</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Detailed profit and loss analysis and reporting.</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-green-100">
                <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Gross P&L</p>
                <p className={`text-lg sm:text-2xl font-bold ${totalGrossPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalGrossPnL.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100">
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Net P&L</p>
                <p className={`text-lg sm:text-2xl font-bold ${totalNetPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalNetPnL.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-purple-100">
                <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Volume</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${(totalVolume / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search periods..."
                className="w-full pl-3 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              <select
                className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="period">Sort by Period</option>
                <option value="pnl">Sort by P&L</option>
                <option value="volume">Sort by Volume</option>
              </select>
            </div>
          </div>
        </div>

        {/* Profit & Loss Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross P&L
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net P&L
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Swaps
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trades
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Win Rate
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Factor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((data) => (
                  <tr key={data.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.period}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {getPnLBadge(data.grossPnL)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {getPnLBadge(data.netPnL)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      ${data.commission.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      ${data.swaps.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(data.volume / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.trades}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.winRate}%
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.profitFactor}
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