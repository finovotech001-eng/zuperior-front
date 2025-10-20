"use client";

import AdminLayout from "@/layouts/admin-layout";
import { BarChart3, TrendingUp, Calculator, FileText, Network, Download } from "lucide-react";

export default function Reports() {
  const reportTypes = [
    {
      title: "Book P&L",
      description: "Profit and Loss reports for all books",
      icon: Calculator,
      color: "bg-green-500",
      href: "/admin/reports/book-pnl",
    },
    {
      title: "Profit & Loss",
      description: "Overall P&L statements and analytics",
      icon: TrendingUp,
      color: "bg-purple-500",
      href: "/admin/reports/pnl",
    },
    {
      title: "LP Statement",
      description: "Liquidity provider statements",
      icon: FileText,
      color: "bg-purple-500",
      href: "/admin/reports/lp-statement",
    },
    {
      title: "Partner Report",
      description: "IB and partner performance reports",
      icon: Network,
      color: "bg-orange-500",
      href: "/admin/reports/partner",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${report.color} rounded-lg flex items-center justify-center`}>
                  <report.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Report Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Trades</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Volume</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">P&L</span>
                <span className="font-semibold text-green-600">$0.00</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">MTD Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Trades</span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Volume</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">P&L</span>
                <span className="font-semibold text-green-600">$0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reports generated yet</p>
              <p className="text-sm text-gray-400 mt-1">Generate your first report to see it here</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}