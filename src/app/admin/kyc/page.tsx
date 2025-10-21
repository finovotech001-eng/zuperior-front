"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  FileText,
  User,
  Loader2,
} from "lucide-react";
import {
  getAllKycRequests,
  approveKyc,
  rejectKyc,
  type KycRequest,
} from "@/services/adminKycService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AdminKycPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kycRequests, setKycRequests] = useState<KycRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<KycRequest | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 25;

  // Fetch KYC requests
  const fetchKycRequests = async () => {
    try {
      setLoading(true);
      const response = await getAllKycRequests({
        page: currentPage,
        limit,
        verificationStatus: statusFilter !== "all" ? statusFilter : undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response.success) {
        setKycRequests(response.data.kycRequests);
        setTotalPages(response.data.pagination.pages);
        setTotal(response.data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching KYC requests:", error);
      toast.error("Failed to fetch KYC requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycRequests();
  }, [currentPage, statusFilter]);

  // Filter by search term
  const filteredRequests = kycRequests.filter((request) => {
    const matchesSearch =
      request.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user.clientId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Handle approve
  const handleApprove = async (id: string) => {
    try {
      setActionLoading(true);
      await approveKyc(id);
      toast.success("KYC approved successfully");
      fetchKycRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error approving KYC:", error);
      toast.error("Failed to approve KYC");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setActionLoading(true);
      await rejectKyc(selectedRequest.id, rejectionReason);
      toast.success("KYC rejected successfully");
      fetchKycRequests();
      setShowRejectDialog(false);
      setSelectedRequest(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      toast.error("Failed to reject KYC");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus === "verified") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Verified</span>;
    } else if (normalizedStatus === "partially verified" || normalizedStatus === "partial") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Partially Verified</span>;
    } else if (normalizedStatus === "pending") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
    } else if (normalizedStatus === "declined") {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Declined</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
  };

  const stats = [
    { label: "Total Requests", value: total, icon: FileText, color: "bg-purple-500" },
    { 
      label: "Pending", 
      value: kycRequests.filter(r => r.verificationStatus.toLowerCase() === "pending").length, 
      icon: Clock, 
      color: "bg-yellow-500" 
    },
    { 
      label: "Verified", 
      value: kycRequests.filter(r => r.verificationStatus.toLowerCase() === "verified").length, 
      icon: CheckCircle, 
      color: "bg-green-500" 
    },
    { 
      label: "Declined", 
      value: kycRequests.filter(r => r.verificationStatus.toLowerCase() === "declined").length, 
      icon: XCircle, 
      color: "bg-red-500" 
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KYC Verifications</h1>
            <p className="text-sm text-gray-600 mt-1">Review and manage KYC document submissions</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by user name, email, or client ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Partially Verified">Partially Verified</option>
                  <option value="Verified">Verified</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* KYC Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No KYC requests found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{request.user.name || "N/A"}</div>
                              <div className="text-sm text-gray-500">{request.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.user.clientId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.isDocumentVerified ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-300" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.isAddressVerified ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-300" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.verificationStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {request.verificationStatus.toLowerCase() === "pending" && (
                              <>
                                <button 
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => handleApprove(request.id)}
                                  disabled={actionLoading}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowRejectDialog(true);
                                  }}
                                  disabled={actionLoading}
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
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
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(currentPage * limit, total)}</span> of{" "}
                      <span className="font-medium">{total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                              currentPage === pageNum
                                ? "bg-blue-50 text-blue-600"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* View Details Dialog */}
        {selectedRequest && !showRejectDialog && (
          <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>KYC Request Details</DialogTitle>
                <DialogDescription>
                  Review KYC verification details for {selectedRequest.user.name || selectedRequest.user.email}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">User</p>
                    <p className="text-sm text-gray-900">{selectedRequest.user.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{selectedRequest.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Client ID</p>
                    <p className="text-sm text-gray-900">{selectedRequest.user.clientId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Country</p>
                    <p className="text-sm text-gray-900">{selectedRequest.user.country || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Document Verified</p>
                    <p className="text-sm text-gray-900">{selectedRequest.isDocumentVerified ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address Verified</p>
                    <p className="text-sm text-gray-900">{selectedRequest.isAddressVerified ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedRequest.verificationStatus)}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Submitted</p>
                    <p className="text-sm text-gray-900">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {selectedRequest.rejectionReason && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rejection Reason</p>
                    <p className="text-sm text-red-600 mt-1">{selectedRequest.rejectionReason}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Reject Dialog */}
        {showRejectDialog && selectedRequest && (
          <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject KYC Request</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting this KYC request.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason("");
                }}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || actionLoading}
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Reject
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}
