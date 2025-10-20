"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Users,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

interface MT5Group {
  id: string;
  name: string;
  type: "demo" | "real";
  leverage: string;
  spreadType: "fixed" | "floating";
  minDeposit: number;
  maxLeverage: string;
  commission: string;
  swaps: "enabled" | "disabled";
  status: "active" | "inactive";
  users: number;
}

export default function ManageMT5GroupsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock data - replace with API call
  const mt5Groups: MT5Group[] = [
    {
      id: "1",
      name: "Standard Demo",
      type: "demo",
      leverage: "1:100",
      spreadType: "floating",
      minDeposit: 0,
      maxLeverage: "1:500",
      commission: "$0",
      swaps: "enabled",
      status: "active",
      users: 245,
    },
    {
      id: "2",
      name: "ECN Pro",
      type: "real",
      leverage: "1:200",
      spreadType: "floating",
      minDeposit: 1000,
      maxLeverage: "1:200",
      commission: "$7 per lot",
      swaps: "enabled",
      status: "active",
      users: 89,
    },
    {
      id: "3",
      name: "Cent Account",
      type: "real",
      leverage: "1:1000",
      spreadType: "fixed",
      minDeposit: 10,
      maxLeverage: "1:1000",
      commission: "$0",
      swaps: "disabled",
      status: "inactive",
      users: 156,
    },
  ];

  const filteredGroups = mt5Groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || group.type === typeFilter;

    return matchesSearch && matchesType;
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

  const getTypeBadge = (type: string) => {
    return type === "demo" ? (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
        Demo
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
        Real
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
              <span className="truncate">Manage MT5 Groups</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Configure and manage MT5 trading groups.</p>
          </div>
          <div className="flex-shrink-0">
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Group
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search groups..."
                className="w-full pl-3 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="flex-1 sm:flex-none px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="demo">Demo</option>
                <option value="real">Real</option>
              </select>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    group.type === "demo" ? "bg-blue-100" : "bg-green-100"
                  }`}>
                    <Users className={`h-5 w-5 ${group.type === "demo" ? "text-blue-600" : "text-green-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    <div className="flex items-center space-x-2">
                      {getTypeBadge(group.type)}
                      {getStatusBadge(group.status)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 p-1">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Leverage:</span>
                    <p className="text-sm font-medium">{group.leverage}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Spread:</span>
                    <p className="text-sm font-medium capitalize">{group.spreadType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Min Deposit:</span>
                    <p className="text-sm font-medium">${group.minDeposit}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Commission:</span>
                    <p className="text-sm font-medium">{group.commission}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">Users:</span>
                  <span className="text-sm font-medium">{group.users}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}