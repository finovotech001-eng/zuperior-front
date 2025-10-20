"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  ArrowRightLeft,
  Save,
  X,
  User,
} from "lucide-react";

interface MT5Account {
  id: string;
  login: string;
  name: string;
  balance: number;
  group: string;
}

export default function InternalTransferPage() {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Mock data - replace with API call
  const mt5Accounts: MT5Account[] = [
    { id: "1", login: "100001", name: "John Doe", balance: 10000, group: "demo\\standard" },
    { id: "2", login: "100002", name: "Jane Smith", balance: 25000, group: "real\\ecn" },
    { id: "3", login: "100003", name: "Mike Johnson", balance: 5000, group: "real\\pro" },
    { id: "4", login: "100004", name: "Sarah Wilson", balance: 15000, group: "demo\\beginner" },
  ];

  const handleInitiateTransfer = () => {
    if (!fromAccount || !toAccount || !amount) return;
    setShowTransferModal(true);
  };

  const handleConfirmTransfer = () => {
    // Process transfer - replace with API call
    console.log(`Transferring ${amount} from ${fromAccount} to ${toAccount}`);

    setShowTransferModal(false);
    setFromAccount("");
    setToAccount("");
    setAmount("");
    setComment("");
  };

  const selectedFromAccount = mt5Accounts.find(acc => acc.login === fromAccount);
  const selectedToAccount = mt5Accounts.find(acc => acc.login === toAccount);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <ArrowRightLeft className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">Internal Transfer</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Transfer funds between MT5 accounts.</p>
          </div>
        </div>

        {/* Transfer Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* From Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Account
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
              >
                <option value="">Select source account</option>
                {mt5Accounts.map((account) => (
                  <option key={account.id} value={account.login}>
                    {account.login} - {account.name} (${account.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* To Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Account
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
              >
                <option value="">Select destination account</option>
                {mt5Accounts.map((account) => (
                  <option key={account.id} value={account.login}>
                    {account.login} - {account.name} (${account.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to transfer"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Transfer comment"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleInitiateTransfer}
              disabled={!fromAccount || !toAccount || !amount}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Initiate Transfer
            </button>
          </div>
        </div>

       

        {/* Transfer Confirmation Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Confirm Internal Transfer
                  </h2>
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Transfer Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">From</span>
                      </div>
                      <p className="text-sm text-gray-600">{selectedFromAccount?.login}</p>
                      <p className="text-xs text-gray-500">{selectedFromAccount?.name}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <ArrowRightLeft className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-900">Amount</span>
                      </div>
                      <p className="text-lg font-bold text-green-600">${amount}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">To</span>
                      </div>
                      <p className="text-sm text-gray-600">{selectedToAccount?.login}</p>
                      <p className="text-xs text-gray-500">{selectedToAccount?.name}</p>
                    </div>
                  </div>

                  {comment && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Comment:</span> {comment}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmTransfer}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-medium transition-colors"
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}