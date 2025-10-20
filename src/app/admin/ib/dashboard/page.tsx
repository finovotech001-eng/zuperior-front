"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Award,
  Eye,
  Settings,
  BookOpen,
} from "lucide-react";

interface IBDashboardData {
  totalIBs: number;
  activeIBs: number;
  totalEarnings: number;
  totalReferred: number;
  avgCommission: number;
  topPerformer: string;
  monthlyGrowth: number;
  pendingApprovals: number;
}

export default function IBDashboardPage() {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock data - replace with API call
  const dashboardData: IBDashboardData = {
    totalIBs: 156,
    activeIBs: 134,
    totalEarnings: 245680.50,
    totalReferred: 2847,
    avgCommission: 25.8,
    topPerformer: "John Smith",
    monthlyGrowth: 12.5,
    pendingApprovals: 8,
  };


  const ibRequests = [
    {
      id: "1",
      applicant: "Ram Bhardwaj",
      email: "ram.bhardwaj@gmail.com",
      requestedRate: "$1.00",
      type: "normal",
      appliedDate: "2025-09-29",
      appliedTime: "18:35",
      status: "Pending"
    },
    {
      id: "2",
      applicant: "Manmohan Singh",
      email: "manmohan.singh88@gmail.com",
      requestedRate: "$1.00",
      type: "normal",
      appliedDate: "2025-09-29",
      appliedTime: "18:34",
      status: "Pending"
    },
    {
      id: "3",
      applicant: "Kiranpreet Singh Kahlon",
      email: "kiranpreet.kahlon@gmail.com",
      requestedRate: "$1.00",
      type: "normal",
      appliedDate: "2025-09-29",
      appliedTime: "14:56",
      status: "Pending"
    },
    {
      id: "4",
      applicant: "Mandeep Singh",
      email: "mandeep.singh@gmail.com",
      requestedRate: "$1.00",
      type: "normal",
      appliedDate: "2025-09-25",
      appliedTime: "21:48",
      status: "Pending"
    },
    {
      id: "5",
      applicant: "RAJESH KARLOPIA",
      email: "rajesh.karlopia64@gmail.com",
      requestedRate: "$1.00",
      type: "normal",
      appliedDate: "2025-09-23",
      appliedTime: "00:29",
      status: "Pending"
    },
  ];

  const commissionLedger = [
    { date: "2025-09-29", ib: "Ram Bhardwaj", symbol: "EUR/USD", lots: 1.2, commission: 12.50 },
    { date: "2025-09-29", ib: "Manmohan Singh", symbol: "GBP/USD", lots: 0.8, commission: 8.75 },
    { date: "2025-09-29", ib: "Kiranpreet Singh", symbol: "USD/JPY", lots: 2.1, commission: 21.00 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">IB Portal Admin Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Advanced Pip-wise Commission Management System</p>
          </div>
          <div className="flex-shrink-0">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Active IBs</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {dashboardData.activeIBs}
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
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Commission</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  $0.00
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-purple-100">
                <Award className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Active Allocations</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Section - Commission Processed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <h3 className="text-lg font-semibold text-gray-900">Commission Processed (Last 12 months)</h3>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
            </div>

            {/* Commission by Category */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Commission by Category</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Forex Trading</span>
                  <span className="text-sm font-medium text-gray-900">$0.00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Crypto Trading</span>
                  <span className="text-sm font-medium text-gray-900">$0.00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Referrals</span>
                  <span className="text-sm font-medium text-gray-900">$0.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Recent IB Requests & Commission Ledger */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <h3 className="text-lg font-semibold text-gray-900">Recent IB Requests</h3>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </button>
            </div>

            {/* IB Requests Table */}
            <div className="mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Requested Rate
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Type
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ibRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.applicant}</div>
                            <div className="text-xs text-gray-500 hidden sm:block">{request.email}</div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                          {request.requestedRate}
                        </td>
                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          {request.type}
                        </td>
                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          <div>{request.appliedDate}</div>
                          <div className="text-xs">{request.appliedTime}</div>
                        </td>
                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Commission Ledger Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-3">
              <h4 className="text-md font-medium text-gray-900">Recent Commission Ledger</h4>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <BookOpen className="h-4 w-4 mr-2" />
                Open Ledger
              </button>
            </div>

            {/* Commission Ledger Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      IB
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Symbol
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lots
                    </th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {commissionLedger.length > 0 ? (
                    commissionLedger.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          {entry.date}
                        </td>
                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          {entry.ib}
                        </td>
                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          {entry.symbol}
                        </td>
                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          {entry.lots}
                        </td>
                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-green-600 font-medium">
                          ${entry.commission.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-2 sm:px-3 py-4 text-center text-sm text-gray-500">
                        No entries yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}