"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Award,
} from "lucide-react";

interface IB {
  id: string;
  name: string;
  email: string;
  level: number;
  commission: number;
  totalEarnings: number;
  referredUsers: number;
  status: "active" | "inactive";
  joinDate: string;
}

export default function IBManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - replace with API call
  const ibs: IB[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john.ib@example.com",
      level: 1,
      commission: 25.5,
      totalEarnings: 15420.75,
      referredUsers: 45,
      status: "active",
      joinDate: "01 Oct 2025",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.ib@example.com",
      level: 2,
      commission: 18.5,
      totalEarnings: 8930.25,
      referredUsers: 23,
      status: "active",
      joinDate: "28 Sep 2025",
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.ib@example.com",
      level: 1,
      commission: 30.0,
      totalEarnings: 22150.50,
      referredUsers: 67,
      status: "inactive",
      joinDate: "25 Sep 2025",
    },
  ];

  const filteredIBs = ibs.filter((ib) => {
    const matchesSearch = ib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ib.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ib.status === statusFilter;

    return matchesSearch && matchesStatus;
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

  const getLevelBadge = (level: number) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
        level === 1 ? "bg-blue-100 text-blue-800" :
        level === 2 ? "bg-green-100 text-green-800" :
        "bg-purple-100 text-purple-800"
      }`}>
        Level {level}
      </span>
    );
  };

  const totalEarnings = ibs.reduce((sum, ib) => sum + ib.totalEarnings, 0);
  const totalReferred = ibs.reduce((sum, ib) => sum + ib.referredUsers, 0);
  const activeIBs = ibs.filter(ib => ib.status === "active").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">IB Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage Introducing Brokers and their commissions.</p>
          </div>
          <div className="flex-shrink-0">
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add IB
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
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Referred</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalReferred}
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
                <p className="text-xs sm:text-sm font-medium text-gray-500">Active IBs</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {activeIBs}
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
                placeholder="Search IBs..."
                className="w-full pl-3 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* IBs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission %
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Earnings
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referred Users
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIBs.map((ib) => (
                  <tr key={ib.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ib.name}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ib.email}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {getLevelBadge(ib.level)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ib.commission}%
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      ${ib.totalEarnings.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ib.referredUsers}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ib.status)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ib.joinDate}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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