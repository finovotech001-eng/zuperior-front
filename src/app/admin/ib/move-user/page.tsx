"use client";

import AdminLayout from "@/layouts/admin-layout";
import { ArrowLeftRight, Users, Plus, CheckCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  currentIB?: string;
  joinDate: string;
  status: "active" | "inactive";
  totalBalance: number;
}

interface IB {
  id: string;
  name: string;
  email: string;
  totalClients: number;
  commission: number;
  status: "active" | "inactive";
}

export default function MoveUserToIBPage() {
  const users: User[] = [
    {
      id: "U-001",
      name: "John Doe",
      email: "john@example.com",
      currentIB: "IB-001",
      joinDate: "2024-01-10",
      status: "active",
      totalBalance: 15000.00,
    },
    {
      id: "U-002",
      name: "Jane Smith",
      email: "jane@example.com",
      joinDate: "2024-01-08",
      status: "active",
      totalBalance: 8500.00,
    },
    {
      id: "U-003",
      name: "Mike Johnson",
      email: "mike@example.com",
      currentIB: "IB-002",
      joinDate: "2024-01-05",
      status: "inactive",
      totalBalance: 3200.00,
    },
  ];

  const ibs: IB[] = [
    {
      id: "IB-001",
      name: "John Doe IB",
      email: "john.ib@example.com",
      totalClients: 45,
      commission: 12500.00,
      status: "active",
    },
    {
      id: "IB-002",
      name: "Jane Smith IB",
      email: "jane.ib@example.com",
      totalClients: 32,
      commission: 8900.00,
      status: "active",
    },
    {
      id: "IB-003",
      name: "Bob Wilson IB",
      email: "bob.ib@example.com",
      totalClients: 28,
      commission: 6700.00,
      status: "active",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case "inactive":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "bg-purple-500" },
    { label: "Users with IB", value: users.filter(u => u.currentIB).length, icon: Users, color: "bg-green-500" },
    { label: "Available IBs", value: ibs.filter(ib => ib.status === "active").length, icon: Users, color: "bg-blue-500" },
    { label: "Pending Moves", value: "3", icon: ArrowLeftRight, color: "bg-yellow-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Move User to IB</h1>
            <p className="text-sm text-gray-600 mt-1">Transfer users between Introducing Brokers</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Bulk Move
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users without IB */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Users Without IB</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {users.filter(user => !user.currentIB).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>Select IB</option>
                        {ibs.map((ib) => (
                          <option key={ib.id} value={ib.id}>{ib.name}</option>
                        ))}
                      </select>
                      <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Move
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Available IBs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Available IBs</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {ibs.map((ib) => (
                  <div key={ib.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{ib.name}</div>
                          <div className="text-sm text-gray-500">{ib.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{ib.totalClients} Clients</div>
                        <div className="text-sm text-gray-500">${ib.commission.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      {getStatusBadge(ib.status)}
                      <span className="text-sm text-gray-500">Active since {ib.id === "IB-001" ? "Jan 2024" : "Dec 2023"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Move History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Moves</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From IB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To IB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moved Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moved By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    John Doe
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    IB-001
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    IB-002
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2024-01-15 10:30 AM
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Admin User
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}