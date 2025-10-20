"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Layers,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BookOpen,
} from "lucide-react";

interface CombinedBookData {
  id: string;
  bookType: "A Book" | "B Book";
  symbol: string;
  totalVolume: number;
  totalPnL: number;
  netExposure: number;
  trades: number;
  avgSpread: number;
  lastUpdate: string;
}

export default function CombinedBookPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookFilter, setBookFilter] = useState("all");

  // Mock data - replace with API call
  const combinedData: CombinedBookData[] = [
    {
      id: "1",
      bookType: "A Book",
      symbol: "EUR/USD",
      totalVolume: 15.5,
      totalPnL: 15420.50,
      netExposure: 8.5,
      trades: 145,
      avgSpread: 0.0002,
      lastUpdate: "01 Oct 2025 12:30",
    },
    {
      id: "2",
      bookType: "B Book",
      symbol: "GBP/JPY",
      totalVolume: 12.0,
      totalPnL: -8230.25,
      netExposure: -6.0,
      trades: 98,
      avgSpread: 0.0005,
      lastUpdate: "01 Oct 2025 12:25",
    },
    {
      id: "3",
      bookType: "A Book",
      symbol: "USD/CAD",
      totalVolume: 8.5,
      totalPnL: 7190.25,
      netExposure: 4.2,
      trades: 67,
      avgSpread: 0.0003,
      lastUpdate: "01 Oct 2025 12:20",
    },
    {
      id: "4",
      bookType: "B Book",
      symbol: "AUD/USD",
      totalVolume: 6.5,
      totalPnL: 3450.75,
      netExposure: 3.8,
      trades: 45,
      avgSpread: 0.0004,
      lastUpdate: "01 Oct 2025 12:15",
    },
  ];

  const filteredData = combinedData.filter((data) => {
    const matchesSearch = data.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         data.bookType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBook = bookFilter === "all" || data.bookType === bookFilter;

    return matchesSearch && matchesBook;
  });

  const getBookBadge = (bookType: string) => {
    return bookType === "A Book" ? (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
        A Book
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
        B Book
      </span>
    );
  };

  const getPnLBadge = (pnl: number) => {
    if (pnl > 0) {
      return (
        <span className="inline-flex items-center text-green-600 font-medium">
          <TrendingUp className="h-4 w-4 mr-1" />
          ${pnl.toLocaleString()}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center text-red-600 font-medium">
          <TrendingDown className="h-4 w-4 mr-1" />
          ${Math.abs(pnl).toLocaleString()}
        </span>
      );
    }
  };

  const totalVolume = combinedData.reduce((sum, data) => sum + data.totalVolume, 0);
  const totalPnL = combinedData.reduce((sum, data) => sum + data.totalPnL, 0);
  const netExposure = combinedData.reduce((sum, data) => sum + data.netExposure, 0);
  const totalTrades = combinedData.reduce((sum, data) => sum + data.trades, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Layers className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">Combined Book</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Combined view of A Book and B Book positions.</p>
          </div>
          <div className="flex-shrink-0">
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filter View
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100">
                <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Volume</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalVolume.toFixed(1)} lots
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-green-100">
                <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Combined P&L</p>
                <p className={`text-lg sm:text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalPnL.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-purple-100">
                <Layers className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Net Exposure</p>
                <p className={`text-lg sm:text-2xl font-bold ${netExposure >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netExposure > 0 ? '+' : ''}{netExposure.toFixed(1)} lots
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-orange-100">
                <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Trades</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalTrades}
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
                placeholder="Search symbols..."
                className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm"
                value={bookFilter}
                onChange={(e) => setBookFilter(e.target.value)}
              >
                <option value="all">All Books</option>
                <option value="A Book">A Book</option>
                <option value="B Book">B Book</option>
              </select>
            </div>
          </div>
        </div>

        {/* Combined Book Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book Type
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Volume
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total P&L
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Exposure
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trades
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Spread
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Update
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((data) => (
                  <tr key={data.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {getBookBadge(data.bookType)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.symbol}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.totalVolume.toFixed(1)} lots
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {getPnLBadge(data.totalPnL)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.netExposure > 0 ? '+' : ''}{data.netExposure.toFixed(1)} lots
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.trades}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.avgSpread.toFixed(4)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.lastUpdate}
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