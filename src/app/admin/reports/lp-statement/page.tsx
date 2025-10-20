"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  FileText,
  Search,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";

interface LPStatementData {
  id: string;
  lpName: string;
  period: string;
  totalValue: number;
  totalReturn: number;
  returnPercentage: number;
  fees: number;
  netReturn: number;
  transactions: number;
  status: "active" | "inactive";
}

export default function LPStatementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");

  // Mock data - replace with API call
  const lpStatements: LPStatementData[] = [
    {
      id: "1",
      lpName: "Ethereum Pool Alpha",
      period: "October 2025",
      totalValue: 2500000,
      totalReturn: 45680.50,
      returnPercentage: 12.5,
      fees: 2458.30,
      netReturn: 43222.20,
      transactions: 156,
      status: "active",
    },
    {
      id: "2",
      lpName: "Binance Smart Chain Beta",
      period: "October 2025",
      totalValue: 1800000,
      totalReturn: 38290.25,
      returnPercentage: 18.7,
      fees: 1980.50,
      netReturn: 36309.75,
      transactions: 134,
      status: "active",
    },
    {
      id: "3",
      lpName: "Polygon DeFi Gamma",
      period: "September 2025",
      totalValue: 950000,
      totalReturn: -15420.75,
      returnPercentage: -8.3,
      fees: 1245.80,
      netReturn: -16666.55,
      transactions: 89,
      status: "inactive",
    },
  ];

  const filteredStatements = lpStatements.filter((statement) => {
    const matchesSearch = statement.lpName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = periodFilter === "all" || statement.period === periodFilter;

    return matchesSearch && matchesPeriod;
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

  const getReturnBadge = (returnPercentage: number) => {
    if (returnPercentage > 0) {
      return (
        <span className="inline-flex items-center text-green-600 font-medium">
          <TrendingUp className="h-4 w-4 mr-1" />
          {returnPercentage}%
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center text-red-600 font-medium">
          <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
          {Math.abs(returnPercentage)}%
        </span>
      );
    }
  };

  const totalValue = lpStatements.reduce((sum, statement) => sum + statement.totalValue, 0);
  const totalReturn = lpStatements.reduce((sum, statement) => sum + statement.totalReturn, 0);
  const totalFees = lpStatements.reduce((sum, statement) => sum + statement.fees, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">LP Statement</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Liquidity provider statements and performance reports.</p>
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
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100">
                <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${(totalValue / 1000000).toFixed(1)}M
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
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Return</p>
                <p className={`text-lg sm:text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${totalReturn.toLocaleString()}
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
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Fees</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${totalFees.toLocaleString()}
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
                placeholder="Search LP statements..."
                className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
              >
                <option value="all">All Periods</option>
                <option value="October 2025">October 2025</option>
                <option value="September 2025">September 2025</option>
                <option value="August 2025">August 2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* LP Statements Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LP Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Return
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return %
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fees
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Return
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transactions
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStatements.map((statement) => (
                  <tr key={statement.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {statement.lpName}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {statement.period}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(statement.totalValue / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${statement.totalReturn.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {getReturnBadge(statement.returnPercentage)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      ${statement.fees.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${statement.netReturn.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {statement.transactions}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(statement.status)}
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