"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/layouts/admin-layout";
import {
  Search,
  Download,
  Plus,
  Users,
  UserCheck,
  UserX,
  Shield,
  Eye,
  Edit,
  Ban,
  UserPlus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchUsers, updateUser, banUser } from "@/store/slices/adminSlice";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { StatCardSkeleton } from "@/components/admin/StatCardSkeleton";
import { Pagination } from "@/components/admin/Pagination";
import { SearchBar } from "@/components/admin/SearchBar";
import { FilterDropdown } from "@/components/admin/FilterDropdown";
import { UserDetailsDialog } from "@/components/admin/UserDetailsDialog";

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  country?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  kyc?: any;
  mt5Accounts: any[];
  manualDeposits: any[];
  withdrawals: any[];
  _count: {
    mt5Accounts: number;
    manualDeposits: number;
    withdrawals: number;
  };
}

export default function AllUsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.admin);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState("all");
  const [pageSize, setPageSize] = useState(25);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers({
      page: currentPage,
      limit: pageSize,
      search: searchQuery,
      status: statusFilter === "all" ? "" : statusFilter,
      kycStatus: kycFilter === "all" ? "" : kycFilter,
      emailVerified: emailVerifiedFilter === "all" ? "" : emailVerifiedFilter,
    }));
  }, [dispatch, currentPage, pageSize, searchQuery, statusFilter, kycFilter, emailVerifiedFilter]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleKycFilter = (value: string) => {
    setKycFilter(value);
    setCurrentPage(1);
  };

  const handleEmailVerifiedFilter = (value: string) => {
    setEmailVerifiedFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleBanUser = async (userId: string, action: 'ban' | 'unban') => {
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await dispatch(banUser({ id: userId, action, reason: `Admin ${action} action` }));
        // Refresh the users list
        dispatch(fetchUsers({
          page: currentPage,
          limit: pageSize,
          search: searchQuery,
          status: statusFilter,
          kycStatus: kycFilter,
          emailVerified: emailVerifiedFilter,
        }));
      } catch (error) {
        console.error('Error banning user:', error);
      }
    }
  };

  const handleExportUsers = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/admin/users/export/csv', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting users:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case "inactive":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
      case "banned":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">Banned</span>;
      case "suspended":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">Suspended</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">Admin</span>;
      case "moderator":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">Moderator</span>;
      case "user":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">User</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">{role}</span>;
    }
  };

  const getVerificationBadge = (emailVerified: boolean, kyc?: any) => {
    const kycStatus = kyc?.verificationStatus || 'unverified';
    return (
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <span className={`text-xs ${emailVerified ? 'text-green-600' : 'text-red-600'}`}>
            Email: {emailVerified ? 'Verified' : 'Unverified'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs ${
            kycStatus === 'Approved' ? 'text-purple-600' :
            kycStatus === 'Pending' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            KYC: {kycStatus === 'Approved' ? 'Verified' : kycStatus === 'Pending' ? 'Pending' : 'Unverified'}
          </span>
        </div>
      </div>
    );
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "banned", label: "Banned" },
    { value: "suspended", label: "Suspended" },
  ];

  const kycOptions = [
    { value: "Approved", label: "Verified" },
    { value: "Pending", label: "Pending" },
    { value: "unverified", label: "Unverified" },
  ];

  const emailVerifiedOptions = [
    { value: "true", label: "Verified" },
    { value: "false", label: "Unverified" },
  ];

  const pageSizeOptions = [
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ];

  const stats = users.list.length > 0 ? [
    { label: "Total Users", value: users.total, icon: Users, color: "bg-purple-500" },
    { label: "Active Users", value: users.list.filter(u => u.status === "active").length, icon: UserCheck, color: "bg-green-500" },
    { label: "Banned Users", value: users.list.filter(u => u.status === "banned").length, icon: UserX, color: "bg-red-500" },
    { label: "KYC Verified", value: users.list.filter(u => u.kyc?.verificationStatus === "Approved").length, icon: Shield, color: "bg-purple-600" },
  ] : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-6 w-6 mr-3" />
              All Users
            </h1>
            <p className="text-sm text-gray-600 mt-1">Complete list of all registered users.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={handleExportUsers}
              disabled={isExporting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
            <Link href="/admin/users/add">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.loading ? (
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
                  placeholder="Search (email / name)"
                  onSearch={handleSearch}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterDropdown
                  options={statusOptions}
                  value={statusFilter}
                  onValueChange={handleStatusFilter}
                  placeholder="All Status"
                  className="w-32"
                />
                <FilterDropdown
                  options={kycOptions}
                  value={kycFilter}
                  onValueChange={handleKycFilter}
                  placeholder="All KYC"
                  className="w-32"
                />
                <FilterDropdown
                  options={emailVerifiedOptions}
                  value={emailVerifiedFilter}
                  onValueChange={handleEmailVerifiedFilter}
                  placeholder="Email Status"
                  className="w-32"
                />
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

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {users.loading ? (
              <TableSkeleton rows={10} columns={10} />
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.list.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getVerificationBadge(user.emailVerified, user.kyc)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.country || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.phone || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleViewUser(user)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                          </button>
                          <Link href={`/admin/users/edit?id=${user.id}`}>
                            <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                              <Edit className="h-3 w-3" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleBanUser(user.id, user.status === 'banned' ? 'unban' : 'ban')}
                            className={`${user.status === 'banned' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white px-3 py-1 rounded text-xs font-medium transition-colors`}
                          >
                            <Ban className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!users.loading && users.total > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(users.total / pageSize)}
              onPageChange={handlePageChange}
              totalItems={users.total}
              itemsPerPage={pageSize}
            />
          )}
        </div>

        {/* User Details Dialog */}
        <UserDetailsDialog
          isOpen={showUserDetails}
          onClose={() => setShowUserDetails(false)}
          user={selectedUser}
        />
      </div>
    </AdminLayout>
  );
}