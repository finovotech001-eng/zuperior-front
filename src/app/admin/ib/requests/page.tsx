"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Clock,
  CheckCircle,
  X,
  Search
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IBRequest {
  id: string;
  applicant: string;
  email: string;
  requestedPipLot: string;
  type: string;
  appliedDate: string;
  appliedTime: string;
  status: string;
}

interface ApprovedIB {
  id: string;
  name: string;
  email: string;
  approvedDate: string;
  pipLotRate: string;
  type: string;
  status: string;
}

export default function IBRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<IBRequest | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const ibRequests: IBRequest[] = [
    {
      id: "1",
      applicant: "Ram Bhardwaj",
      email: "ram.bhardwaj.sp@gmail.com",
      requestedPipLot: "1.00 pip",
      type: "normal",
      appliedDate: "2025-09-29",
      appliedTime: "18:35",
      status: "Pending"
    },
    {
      id: "2",
      applicant: "Manmohan Singh",
      email: "manmohan.singh88@gmail.com",
      requestedPipLot: "1.00 pip",
      type: "normal",
      appliedDate: "2025-09-29",
      appliedTime: "18:34",
      status: "Pending"
    },
    {
      id: "3",
      applicant: "Kiranpreet Singh Kahlon",
      email: "kpspahra@gmail.com",
      requestedPipLot: "1.00 pip",
      type: "normal",
      appliedDate: "2025-09-29",
      appliedTime: "14:56",
      status: "Pending"
    },
    {
      id: "4",
      applicant: "Mandeep Singh",
      email: "ms8322835@gmail.com",
      requestedPipLot: "1.00 pip",
      type: "normal",
      appliedDate: "2025-09-25",
      appliedTime: "21:48",
      status: "Pending"
    },
    {
      id: "5",
      applicant: "RAJESH KARLOPIA",
      email: "rajesh.karlopia64@gmail.com",
      requestedPipLot: "1.00 pip",
      type: "normal",
      appliedDate: "2025-09-23",
      appliedTime: "00:29",
      status: "Pending"
    },
  ];

  const approvedIBs: ApprovedIB[] = [
    {
      id: "1",
      name: "Katoch Rishi",
      email: "katochrisik794@gmail.com",
      approvedDate: "2025-09-19 16:57",
      pipLotRate: "15.00 pip",
      type: "master",
      status: "Approved"
    },
  ];

  const getStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
        status === "Pending"
          ? "bg-yellow-100 text-yellow-800"
          : status === "Approved"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}>
        {status}
      </span>
    );
  };

  const handleApprove = (request: IBRequest) => {
    setSelectedRequest(request);
    setIsApproveModalOpen(true);
  };

  const handleReject = (request: IBRequest) => {
    setSelectedRequest(request);
    setIsRejectModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">IB Requests</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Review and approve IB applications</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-yellow-100">
                <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {ibRequests.filter(r => r.status === "Pending").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-green-100">
                <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Approved Today</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  0
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-red-100">
                <X className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Rejected Today</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending IB Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Pending IB Requests</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Requested Pip/Lot
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Type
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ibRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.applicant}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {request.email}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      {request.requestedPipLot}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {request.type}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{request.appliedDate}</div>
                      <div className="text-xs">{request.appliedTime}</div>
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleApprove(request)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleReject(request)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          × Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recently Approved IBs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recently Approved IBs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IB Name
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Approved Date
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Pip/Lot Rate
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Type
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvedIBs.length > 0 ? (
                  approvedIBs.map((ib) => (
                    <tr key={ib.id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ib.name}
                      </td>
                      <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {ib.email}
                      </td>
                      <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {ib.approvedDate}
                      </td>
                      <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                        {ib.pipLotRate}
                      </td>
                      <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {ib.type}
                        </span>
                      </td>
                      <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(ib.status)}
                      </td>
                      <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                          Profiles
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-2 sm:px-6 py-4 text-center text-sm text-gray-500">
                      No approved IBs yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approve Modal */}
        <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Approve IB Request</DialogTitle>
              <DialogDescription>
                Approve the IB request for {selectedRequest?.applicant}
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Applicant</p>
                  <p className="font-medium">{selectedRequest.applicant}</p>
                  <p className="text-sm text-gray-500">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">IB Type</p>
                  <p className="font-medium capitalize">{selectedRequest.type}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    ✓ Approval will set status to Approved and stamp approved_at.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsApproveModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
                    ✓ Approve
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Modal */}
        <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reject IB Request</DialogTitle>
              <DialogDescription>
                Reject the IB request for {selectedRequest?.applicant}
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Applicant</p>
                  <p className="font-medium">{selectedRequest.applicant}</p>
                  <p className="text-sm text-gray-500">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reason</p>
                  <textarea
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm"
                    rows={3}
                    placeholder="Enter rejection reason (optional)"
                  />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠ Rejection will set status to Rejected. You can re-approve later from requests if needed.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsRejectModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
                    × Reject
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}