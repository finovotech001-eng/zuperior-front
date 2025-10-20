"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Search,
  Save,
  X,
  Users,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

interface User {
  id: string;
  srNo: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: "active" | "inactive" | "banned";
  currentRole: string;
  joinDate: string;
  emailVerified: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export default function AssignRolesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Mock data - replace with API call
  const users: User[] = [
    {
      id: "1",
      srNo: 1,
      name: "rk",
      email: "katochrasik000@gmail.com",
      phone: "9090909090",
      country: "India",
      status: "active",
      currentRole: "Super Admin",
      joinDate: "05 Oct 2025",
      emailVerified: false,
    },
    {
      id: "2",
      srNo: 2,
      name: "testAccount Account",
      email: "test@gmail.com",
      phone: "7529860737",
      country: "India",
      status: "active",
      currentRole: "Manager",
      joinDate: "29 Sep 2025",
      emailVerified: true,
    },
    {
      id: "3",
      srNo: 3,
      name: "Abc def",
      email: "nogaba157@dotxan.com",
      phone: "1234567890",
      country: "India",
      status: "active",
      currentRole: "User",
      joinDate: "24 Sep 2025",
      emailVerified: true,
    },
  ];

  const roles: Role[] = [
    { id: "1", name: "Super Admin", description: "Full system access", permissions: ["all"] },
    { id: "2", name: "Manager", description: "Management access", permissions: ["users", "reports"] },
    { id: "3", name: "User", description: "Standard user access", permissions: ["profile"] },
    { id: "4", name: "Support", description: "Customer support access", permissions: ["tickets"] },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignRole = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.currentRole);
    setShowAssignModal(true);
  };

  const handleSaveRoleAssignment = () => {
    if (!selectedUser) return;

    // Update user role - replace with API call
    console.log(`Assigning role ${selectedRole} to user ${selectedUser.name}`);

    setShowAssignModal(false);
    setSelectedUser(null);
    setSelectedRole("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case "inactive":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
      case "banned":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">Banned</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getVerificationBadge = (emailVerified: boolean) => {
    return (
      <span className={`text-xs ${emailVerified ? 'text-green-600' : 'text-red-600'}`}>
        {emailVerified ? 'Verified' : 'Unverified'}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">Assign Roles</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Assign roles to users and manage permissions.</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Verified
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.srNo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.phone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.country}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.currentRole}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getVerificationBadge(user.emailVerified)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joinDate}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleAssignRole(user)}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Assign Role
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assign Role Modal */}
        {showAssignModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Assign Role to {selectedUser.name}
                  </h2>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedUser.email}</p>
                        <p className="text-xs text-gray-500">Email</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedUser.phone}</p>
                        <p className="text-xs text-gray-500">Phone</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedUser.currentRole}</p>
                        <p className="text-xs text-gray-500">Current Role</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedUser.joinDate}</p>
                        <p className="text-xs text-gray-500">Join Date</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select New Role
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {roles.map((role) => (
                      <label
                        key={role.id}
                        className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                          selectedRole === role.name
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.name}
                          checked={selectedRole === role.name}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex flex-1">
                          <div className="flex flex-col">
                            <span className="block text-sm font-medium text-gray-900">
                              {role.name}
                            </span>
                            <span className="mt-1 text-sm text-gray-500">
                              {role.description}
                            </span>
                            <span className="mt-2 text-xs text-gray-400">
                              Permissions: {role.permissions.join(", ")}
                            </span>
                          </div>
                        </div>
                        <div className={`h-4 w-4 rounded-full border-2 ${
                          selectedRole === role.name
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedRole === role.name && (
                            <div className="h-2 w-2 rounded-full bg-white m-0.5"></div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRoleAssignment}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:from-green-500 hover:to-blue-600 text-sm font-medium transition-all"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}