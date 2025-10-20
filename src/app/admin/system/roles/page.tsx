"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Shield,
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  createdAt: string;
  status: "active" | "inactive";
}

interface PermissionGroup {
  title: string;
  permissions: {
    id: string;
    name: string;
    description: string;
  }[];
}

export default function AdminRolesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Mock data - replace with API call
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Super Admin",
      email: "admin@company.com",
      permissions: ["system_settings", "user_management", "dashboard"],
      createdAt: "01 Oct 2025",
      status: "active",
    },
    {
      id: "2",
      name: "Manager",
      email: "manager@company.com",
      permissions: ["user_management", "dashboard"],
      createdAt: "28 Sep 2025",
      status: "active",
    },
  ]);

  const permissionGroups: PermissionGroup[] = [
    {
      title: "System",
      permissions: [
        { id: "system_settings", name: "System Settings", description: "Access to system configuration" },
        { id: "general", name: "General", description: "General system access" },
        { id: "roles", name: "Roles", description: "Role management permissions" },
        { id: "add", name: "Add", description: "Add new items" },
        { id: "users", name: "Users", description: "User management" },
        { id: "active", name: "Active", description: "Active user management" },
        { id: "banned", name: "Banned", description: "Banned user management" },
        { id: "unverified", name: "Unverified", description: "Unverified user management" },
      ],
    },
    {
      title: "KYC",
      permissions: [
        { id: "kyc", name: "KYC", description: "KYC management" },
        { id: "messaging", name: "Messaging", description: "Messaging system" },
        { id: "mt5", name: "MT5", description: "MT5 platform access" },
        { id: "finance", name: "Finance", description: "Financial management" },
        { id: "assign", name: "Assign", description: "Assignment permissions" },
        { id: "payments", name: "Payments", description: "Payment management" },
        { id: "deposits", name: "Deposits", description: "Deposit management" },
        { id: "withdrawals", name: "Withdrawals", description: "Withdrawal management" },
      ],
    },
    {
      title: "IB & Trading",
      permissions: [
        { id: "ib", name: "IB", description: "Introducing Broker" },
        { id: "pamm", name: "PAMM", description: "PAMM accounts" },
        { id: "copier_master", name: "Copier/Master", description: "Copy trading" },
        { id: "bots", name: "Bots", description: "Trading bots" },
        { id: "chat", name: "Chat", description: "Chat system" },
        { id: "prize", name: "Prize", description: "Prize management" },
        { id: "lots", name: "Lots", description: "Lot management" },
      ],
    },
  ];

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = () => {
    setSelectedRole({
      id: "",
      name: "",
      email: "",
      permissions: [],
      createdAt: new Date().toLocaleDateString(),
      status: "active",
    });
    setSelectedPermissions([]);
    setIsEditing(false);
    setShowRoleForm(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions);
    setIsEditing(true);
    setShowRoleForm(true);
  };

  const handleSaveRole = () => {
    if (!selectedRole) return;

    const roleData = {
      ...selectedRole,
      permissions: selectedPermissions,
    };

    if (isEditing) {
      setRoles(roles.map((r) => (r.id === selectedRole.id ? roleData : r)));
    } else {
      setRoles([...roles, { ...roleData, id: Date.now().toString() }]);
    }

    setShowRoleForm(false);
    setSelectedRole(null);
    setSelectedPermissions([]);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((r) => r.id !== roleId));
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };


  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">Roles & Permissions</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage user roles and permissions.</p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleCreateRole}
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">New/Edit Role</span>
              <span className="xs:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Role Form Modal */}
        {showRoleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isEditing ? "Edit Role" : "Add / Edit Role"}
                  </h2>
                  <button
                    onClick={() => setShowRoleForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Role Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Name
                    </label>
                    <input
                      type="text"
                      value={selectedRole?.name || ""}
                      onChange={(e) =>
                        setSelectedRole((prev) => prev && { ...prev, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter role name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={selectedRole?.email || ""}
                      onChange={(e) =>
                        setSelectedRole((prev) => prev && { ...prev, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password (optional — leave blank to keep existing)
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter password"
                  />
                </div>

                {/* Permissions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Permissions</h3>
                    <span className="text-sm text-gray-500">
                      {selectedPermissions.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {permissionGroups.map((group) => (
                      <div key={group.title} className="space-y-3">
                        <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">
                          {group.title}
                        </h4>
                        <div className="space-y-2">
                          {group.permissions.map((permission) => (
                            <label
                              key={permission.id}
                              className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedPermissions.includes(permission.id)}
                                onChange={() => togglePermission(permission.id)}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">
                                  {permission.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {permission.description}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowRoleForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRole}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg hover:from-green-500 hover:to-blue-600 text-sm font-medium transition-all"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Save Role
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search permissions... (e.g. IB, withdrawals, KYC)"
                className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm font-medium">
                Select All
              </button>
              <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm font-medium">
                Clear
              </button>
              <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm font-medium">
                Invert
              </button>
            </div>
          </div>
        </div>

        {/* Roles Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role, index) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{role.name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {role.email}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <span
                              key={permission}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {permission}
                            </span>
                          ))}
                          {role.permissions.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{role.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditRole(role)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}