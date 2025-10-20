"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Filter,
} from "lucide-react";

interface BookPnL {
  id: string;
  bookName: string;
  totalPnL: number;
  realizedPnL: number;
  unrealizedPnL: number;
  commission: number;
  swaps: number;
  volume: number;
  trades: number;
  winRate: number;
  date: string;
}

export default function BookPnLPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Mock data - replace with API call
  const bookPnLData: BookPnL[] = [
    {
      id: "1",
      bookName: "A Book",
      totalPnL: 15420.50,
      realizedPnL: 12500.75,
      unrealizedPnL: 2919.75,
      commission: -245.80,
      swaps: -15.20,
      volume: 2500000,
      trades: 145,
      winRate: 68.5,
      date: "01 Oct 2025",
    },
    {
      id: "2",
      bookName: "B Book",
      totalPnL: -8230.25,
      realizedPnL: -6890.50,
      unrealizedPnL: -1339.75,
      commission: 125.40,
      swaps: 8.60,
      volume: 1800000,
      trades: 98,
      winRate: 45.2,
      date: "01 Oct 2025",
    },
    {
      id: "3",
      bookName: "Combined Book",
      totalPnL: 7190.25,
      realizedPnL: 5610.25,
      unrealizedPnL: 1580.00,
      commission: -120.40,
      swaps: -6.60,
      volume: 4300000,
      trades: 243,
      winRate: 59.8,
      date: "01 Oct 2025",
    },
  ];

  const filteredData = bookPnLData.filter((book) =>
    book.bookName.toLowerCase().includes(searchTerm.toLowerCase())
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

  const totalPnL = bookPnLData.reduce((sum, book) => sum + book.totalPnL, 0);
  const totalVolume = bookPnLData.reduce((sum, book) => sum + book.volume, 0);
  const totalTrades = bookPnLData.reduce((sum, book) => sum + book.trades, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">Book P&L</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">View profit and loss for all trading books.</p>
          </div>
          <div className="flex-shrink-0 flex gap-2">
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
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
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total P&L</p>
                <p className={`text-lg sm:text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalPnL.toLocaleString()}
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
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Volume</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${(totalVolume / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-purple-100">
                <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Trades</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalTrades.toLocaleString()}
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
                placeholder="Search books..."
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
                <option value="date">Sort by Date</option>
                <option value="pnl">Sort by P&L</option>
                <option value="volume">Sort by Volume</option>
              </select>
            </div>
          </div>
        </div>

        {/* Book P&L Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total P&L
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Realized P&L
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unrealized P&L
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
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
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {book.bookName}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {getPnLBadge(book.totalPnL)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${book.realizedPnL.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${book.unrealizedPnL.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      ${book.commission.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(book.volume / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.trades}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {book.winRate}%
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.date}
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