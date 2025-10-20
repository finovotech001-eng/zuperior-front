"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "@/layouts/admin-layout";
import { CheckCircle, Eye, DollarSign, TrendingUp, Download, Search } from "lucide-react";
import { AppDispatch, RootState } from "@/store";
import { fetchManualDeposits } from "@/store/slices/adminSlice";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { StatCardSkeleton } from "@/components/admin/StatCardSkeleton";
import { Pagination } from "@/components/admin/Pagination";
import { SearchBar } from "@/components/admin/SearchBar";
import { FilterDropdown } from "@/components/admin/FilterDropdown";
import { ProofFileViewer } from "@/components/admin/ProofFileViewer";

export default function ApprovedDeposits() {
  const dispatch = useDispatch<AppDispatch>();
  const { deposits } = useSelector((state: RootState) => state.admin);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
  const [showProofViewer, setShowProofViewer] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Pre-filter for approved deposits only
  const statusFilter = "approved";

  useEffect(() => {
    dispatch(fetchManualDeposits({
      page: currentPage,
      limit: pageSize,
      status: statusFilter,
      search: searchQuery,
    }));
  }, [dispatch, currentPage, pageSize, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewProof = (deposit: any) => {
    if (deposit.proofFileUrl) {
      setSelectedDeposit(deposit);
      setShowProofViewer(true);
    }
  };

  const handleExportDeposits = async () => {
    setIsExporting(true);
    try {
      // TODO: Implement export functionality
      console.log('Exporting approved deposits...');
    } catch (error) {
      console.error('Error exporting deposits:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.approved;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const pageSizeOptions = [
    { value: "25", label: "25" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ];

  const stats = deposits.list ? [
    { label: "Total Approved", value: deposits.list.length, icon: CheckCircle, color: "bg-green-500" },
    { label: "Total Amount", value: `$${deposits.list.reduce((sum, deposit) => sum + deposit.amount, 0).toLocaleString()}`, icon: DollarSign, color: "bg-blue-500" },
    { label: "Avg. Amount", value: `$${deposits.list.length > 0 ? (deposits.list.reduce((sum, deposit) => sum + deposit.amount, 0) / deposits.list.length).toFixed(2) : '0'}`, icon: TrendingUp, color: "bg-purple-500" },
    { label: "With Proof", value: deposits.list.filter(d => d.proofFileUrl).length, icon: Eye, color: "bg-orange-500" },
  ] : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <CheckCircle className="h-6 w-6 mr-3" />
              Approved Deposits
            </h1>
            <p className="text-sm text-gray-600 mt-1">Successfully approved manual deposits.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={handleExportDeposits}
              disabled={isExporting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deposits.loading ? (
            <StatCardSkeleton count={4} />
          ) : (
            stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 sm:w-80">
                <SearchBar
                  placeholder="Search approved deposits..."
                  onSearch={handleSearch}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterDropdown
                  options={pageSizeOptions}
                  value={pageSize.toString()}
                  onValueChange={(value) => handlePageSizeChange(parseInt(value))}
                  placeholder="Page Size"
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Deposits Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {deposits.loading ? (
              <TableSkeleton rows={10} columns={8} />
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approved Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deposits.list.map((deposit, index) => (
                    <tr key={deposit.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {deposit.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{deposit.user.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{deposit.user.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${deposit.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        USDT TRC20 QR
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(deposit.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {deposit.approvedAt ? new Date(deposit.approvedAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {deposit.proofFileUrl && (
                            <button 
                              onClick={() => handleViewProof(deposit)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              <Eye className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!deposits.loading && deposits.total > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(deposits.total / pageSize)}
              onPageChange={handlePageChange}
              totalItems={deposits.total}
              itemsPerPage={pageSize}
            />
          )}
        </div>

        {/* Proof File Viewer */}
        <ProofFileViewer
          isOpen={showProofViewer}
          onClose={() => setShowProofViewer(false)}
          fileUrl={selectedDeposit?.proofFileUrl}
          fileName="Payment Proof"
        />
      </div>
    </AdminLayout>
  );
}