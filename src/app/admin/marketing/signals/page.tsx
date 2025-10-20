"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Radio,
  Send,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

interface Signal {
  id: string;
  title: string;
  type: "BUY" | "SELL" | "HOLD";
  symbol: string;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  status: "active" | "completed" | "cancelled";
  sentDate: string;
  recipients: number;
}

export default function SendSignalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);
  const [signalForm, setSignalForm] = useState({
    title: "",
    type: "BUY" as "BUY" | "SELL" | "HOLD",
    symbol: "",
    entryPrice: "",
    targetPrice: "",
    stopLoss: "",
    message: "",
  });

  // Mock data - replace with API call
  const signals: Signal[] = [
    {
      id: "1",
      title: "EUR/USD Buy Signal",
      type: "BUY",
      symbol: "EUR/USD",
      entryPrice: 1.0850,
      targetPrice: 1.0950,
      stopLoss: 1.0800,
      status: "active",
      sentDate: "01 Oct 2025",
      recipients: 150,
    },
    {
      id: "2",
      title: "GBP/JPY Sell Signal",
      type: "SELL",
      symbol: "GBP/JPY",
      entryPrice: 185.50,
      targetPrice: 184.00,
      stopLoss: 186.50,
      status: "completed",
      sentDate: "28 Sep 2025",
      recipients: 89,
    },
  ];

  const filteredSignals = signals.filter((signal) =>
    signal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    signal.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendSignal = () => {
    // Send signal - replace with API call
    console.log("Sending signal:", signalForm);
    setShowSendModal(false);
    setSignalForm({
      title: "",
      type: "BUY",
      symbol: "",
      entryPrice: "",
      targetPrice: "",
      stopLoss: "",
      message: "",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case "completed":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">Completed</span>;
      case "cancelled":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "BUY":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">BUY</span>;
      case "SELL":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">SELL</span>;
      case "HOLD":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">HOLD</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">{type}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Radio className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">Send Signals</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Send trading signals to users.</p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowSendModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Signal
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search signals..."
                className="w-full pl-3 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Signals Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entry
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stop Loss
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSignals.map((signal) => (
                  <tr key={signal.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {signal.title}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {signal.symbol}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(signal.type)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${signal.entryPrice}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${signal.targetPrice}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${signal.stopLoss}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(signal.status)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {signal.recipients}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {signal.sentDate}
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

        {/* Send Signal Modal */}
        {showSendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Send New Signal
                  </h2>
                  <button
                    onClick={() => setShowSendModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Signal Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      value={signalForm.title}
                      onChange={(e) => setSignalForm({...signalForm, title: e.target.value})}
                      placeholder="Enter signal title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symbol
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      value={signalForm.symbol}
                      onChange={(e) => setSignalForm({...signalForm, symbol: e.target.value})}
                      placeholder="e.g. EUR/USD"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Signal Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      value={signalForm.type}
                      onChange={(e) => setSignalForm({...signalForm, type: e.target.value as "BUY" | "SELL" | "HOLD"})}
                    >
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                      <option value="HOLD">HOLD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entry Price
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      value={signalForm.entryPrice}
                      onChange={(e) => setSignalForm({...signalForm, entryPrice: e.target.value})}
                      placeholder="0.0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Price
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      value={signalForm.targetPrice}
                      onChange={(e) => setSignalForm({...signalForm, targetPrice: e.target.value})}
                      placeholder="0.0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stop Loss
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    value={signalForm.stopLoss}
                    onChange={(e) => setSignalForm({...signalForm, stopLoss: e.target.value})}
                    placeholder="0.0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    value={signalForm.message}
                    onChange={(e) => setSignalForm({...signalForm, message: e.target.value})}
                    placeholder="Additional message or analysis..."
                  />
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendSignal}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-medium transition-colors"
                >
                  <Send className="h-4 w-4 mr-2 inline" />
                  Send Signal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}