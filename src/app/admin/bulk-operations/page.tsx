"use client";

import AdminLayout from "@/layouts/admin-layout";
import { FileText, Download, Eye, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface BulkOperation {
  id: string;
  type: "deposit" | "withdrawal" | "user_update" | "kyc_verification";
  status: "pending" | "processing" | "completed" | "failed";
  initiatedBy: string;
  initiatedAt: string;
  completedAt?: string;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  description: string;
}

export default function BulkOperationsPage() {
  const bulkOperations: BulkOperation[] = [
    {
      id: "BULK-001",
      type: "deposit",
      status: "completed",
      initiatedBy: "Admin User",
      initiatedAt: "2024-01-15 10:00 AM",
      completedAt: "2024-01-15 10:05 AM",
      totalRecords: 50,
      processedRecords: 50,
      failedRecords: 0,
      description: "Bulk deposit approval for January settlements",
    },
    {
      id: "BULK-002",
      type: "user_update",
      status: "processing",
      initiatedBy: "Admin User",
      initiatedAt: "2024-01-15 09:30 AM",
      totalRecords: 100,
      processedRecords: 67,
      failedRecords: 3,
      description: "Bulk user status update for KYC verified users",
    },
    {
      id: "BULK-003",
      type: "withdrawal",
      status: "failed",
      initiatedBy: "Admin User",
      initiatedAt: "2024-01-14 16:00 PM",
      completedAt: "2024-01-14 16:15 PM",
      totalRecords: 25,
      processedRecords: 20,
      failedRecords: 5,
      description: "Bulk withdrawal processing for crypto payments",
    },
    {
      id: "BULK-004",
      type: "kyc_verification",
      status: "pending",
      initiatedBy: "Admin User",
      initiatedAt: "2024-01-14 14:00 PM",
      totalRecords: 30,
      processedRecords: 0,
      failedRecords: 0,
      description: "Bulk KYC document verification",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      case "processing":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Processing</span>;
      case "failed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>;
      case "pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return "Deposit";
      case "withdrawal":
        return "Withdrawal";
      case "user_update":
        return "User Update";
      case "kyc_verification":
        return "KYC Verification";
      default:
        return type;
    }
  };

  const getProgressPercentage = (processed: number, total: number) => {
    return Math.round((processed / total) * 100);
  };

  const stats = [
    { label: "Total Operations", value: bulkOperations.length, icon: FileText, color: "bg-purple-500" },
    { label: "Completed", value: bulkOperations.filter(op => op.status === "completed").length, icon: CheckCircle, color: "bg-green-500" },
    { label: "Processing", value: bulkOperations.filter(op => op.status === "processing").length, icon: Clock, color: "bg-blue-500" },
    { label: "Failed", value: bulkOperations.filter(op => op.status === "failed").length, icon: XCircle, color: "bg-red-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bulk Operations Log</h1>
            <p className="text-sm text-gray-600 mt-1">Monitor and manage bulk operations across the platform</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Operations Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bulk Operations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operation ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Initiated By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Started
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bulkOperations.map((operation) => (
                  <tr key={operation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {operation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {getTypeLabel(operation.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(operation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 mr-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                operation.status === "completed" ? "bg-green-500" :
                                operation.status === "failed" ? "bg-red-500" :
                                operation.status === "processing" ? "bg-blue-500" : "bg-yellow-500"
                              }`}
                              style={{ width: `${getProgressPercentage(operation.processedRecords, operation.totalRecords)}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {operation.processedRecords}/{operation.totalRecords}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {operation.initiatedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {operation.initiatedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {operation.completedAt || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        {operation.status === "failed" && (
                          <button className="text-orange-600 hover:text-orange-900">
                            <AlertCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
                  <span className="font-medium">4</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}