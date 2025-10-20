"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Coins,
  QrCode,
  Copy,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface USDTGateway {
  id: string;
  name: string;
  network: string;
  walletAddress: string;
  status: "active" | "inactive";
  minAmount: number;
  maxAmount: number;
  fee: string;
  processingTime: string;
}

export default function USDTGatewayPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - replace with API call
  const gateways: USDTGateway[] = [
    {
      id: "1",
      name: "USDT TRC20",
      network: "Tron (TRC20)",
      walletAddress: "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuW5h",
      status: "active",
      minAmount: 10,
      maxAmount: 100000,
      fee: "1 USDT",
      processingTime: "5-15 minutes",
    },
    {
      id: "2",
      name: "USDT ERC20",
      network: "Ethereum (ERC20)",
      walletAddress: "0x742d35Cc6635C0532925a3b8D0C8c7bDd7F6F067",
      status: "active",
      minAmount: 20,
      maxAmount: 50000,
      fee: "5 USDT",
      processingTime: "10-30 minutes",
    },
    {
      id: "3",
      name: "USDT BEP20",
      network: "Binance Smart Chain (BEP20)",
      walletAddress: "0x742d35Cc6635C0532925a3b8D0C8c7bDd7F6F067",
      status: "inactive",
      minAmount: 15,
      maxAmount: 75000,
      fee: "2 USDT",
      processingTime: "5-20 minutes",
    },
  ];

  const filteredGateways = gateways.filter((gateway) => {
    const matchesSearch = gateway.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gateway.network.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || gateway.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    // You could add a toast notification here
  };

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
              <Coins className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">USDT Gateway</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Configure USDT cryptocurrency payment gateways.</p>
          </div>
          <div className="flex-shrink-0">
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add USDT Gateway
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search gateways..."
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

        {/* Gateways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredGateways.map((gateway) => (
            <div key={gateway.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Coins className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{gateway.name}</h3>
                    <p className="text-sm text-gray-500">{gateway.network}</p>
                  </div>
                </div>
                {getStatusBadge(gateway.status)}
              </div>

              <div className="space-y-3 mb-4">
                {/* Wallet Address */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Wallet Address</span>
                    <button
                      onClick={() => copyToClipboard(gateway.walletAddress)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-mono text-gray-600 break-all">{gateway.walletAddress}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Min Amount:</span>
                    <span className="text-sm font-medium">{gateway.minAmount} USDT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Max Amount:</span>
                    <span className="text-sm font-medium">{gateway.maxAmount} USDT</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fee:</span>
                  <span className="text-sm font-medium">{gateway.fee}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Processing:</span>
                  <span className="text-sm font-medium">{gateway.processingTime}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                  <QrCode className="h-4 w-4 inline mr-1" />
                  QR Code
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