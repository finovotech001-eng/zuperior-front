"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Hand,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ManualGateway {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive";
  instructions: string;
  supportedCurrencies: string[];
  processingTime: string;
  fee: string;
}

export default function ManualGatewaysPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - replace with API call
  const gateways: ManualGateway[] = [
    {
      id: "1",
      name: "Bank Transfer",
      type: "Wire Transfer",
      status: "active",
      instructions: "Please transfer funds to the following bank account...",
      supportedCurrencies: ["USD", "EUR", "GBP"],
      processingTime: "1-3 business days",
      fee: "$10.00",
    },
    {
      id: "2",
      name: "Western Union",
      type: "Money Transfer",
      status: "active",
      instructions: "Send money through Western Union using the details provided...",
      supportedCurrencies: ["USD", "EUR"],
      processingTime: "30 minutes - 2 hours",
      fee: "$5.00",
    },
    {
      id: "3",
      name: "Crypto Manual",
      type: "Cryptocurrency",
      status: "inactive",
      instructions: "Send cryptocurrency to the provided wallet address...",
      supportedCurrencies: ["BTC", "ETH", "USDT"],
      processingTime: "10-30 minutes",
      fee: "0.5%",
    },
  ];

  const filteredGateways = gateways.filter((gateway) => {
    const matchesSearch = gateway.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gateway.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || gateway.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
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
              <Hand className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">Manual Gateways</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Configure manual payment gateways.</p>
          </div>
          <div className="flex-shrink-0">
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Gateway
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search gateways..."
                className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
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

        {/* Gateways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredGateways.map((gateway) => (
            <div key={gateway.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Hand className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{gateway.name}</h3>
                    <p className="text-sm text-gray-500">{gateway.type}</p>
                  </div>
                </div>
                {getStatusBadge(gateway.status)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Processing Time:</span>
                  <span className="text-sm font-medium">{gateway.processingTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fee:</span>
                  <span className="text-sm font-medium">{gateway.fee}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Currencies:</span>
                  <div className="flex flex-wrap gap-1 max-w-32">
                    {gateway.supportedCurrencies.map((currency) => (
                      <span
                        key={currency}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {currency}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-3">{gateway.instructions}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                  <Eye className="h-4 w-4 inline mr-1" />
                  View Details
                </button>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 p-1">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}