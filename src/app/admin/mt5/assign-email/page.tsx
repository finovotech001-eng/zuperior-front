"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

export default function AssignMT5ToEmailPage() {
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [mt5Id, setMt5Id] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user emails for the dropdown (as shown in image)
  const userEmails = [
    "abhishpkpy@gmail.com",
    "adrianaleexeev@gmail.ru",
    "altopizi@gmail.com",
    "garahaltopa@gmail.com",
    "garrykahlonsingh@gmail.com",
    "katochrasik000@gmail.com"
  ];

  const handleFetchInfo = async () => {
    if (!selectedUserEmail || !mt5Id) {
      alert("Please select user email and enter MT5 ID");
      return;
    }

    setIsLoading(true);
    try {
      // Replace with actual API call
      console.log("Fetching info for:", { selectedUserEmail, mt5Id, newPassword });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert("MT5 account information fetched successfully!");
    } catch {
      alert("Error fetching MT5 information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPassword = () => {
    if (!newPassword) {
      alert("Please enter a new password");
      return;
    }

    // Replace with actual API call
    console.log("Setting new password:", newPassword);
    alert("Password updated successfully!");
    setNewPassword("");
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 w-full">
        <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-12 xl:py-16 2xl:px-16 2xl:py-20">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2">
              Assign Existing MT5 Account
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-4xl mx-auto">
              Map an existing MT5 ID to a user account and save it to the database.
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 w-full">
            <div className="space-y-6 lg:space-y-8">
              {/* User Email Selection */}
              <div className="w-full">
                <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-3">
                  Select User (Email)
                </label>
                <div className="relative w-full">
                  <select
                    value={selectedUserEmail}
                    onChange={(e) => setSelectedUserEmail(e.target.value)}
                    className="w-full h-10 sm:h-12 lg:h-14 xl:h-16 px-3 sm:px-4 lg:px-6 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base lg:text-lg appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-white text-gray-900">
                      Search User email
                    </option>
                    {userEmails.map((email, index) => (
                      <option
                        key={index}
                        value={email}
                        className="bg-white text-gray-900"
                      >
                        {email}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 sm:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* MT5 ID Input */}
              <div className="w-full">
                <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-3">
                  Enter MT5 ID
                </label>
                <input
                  type="text"
                  value={mt5Id}
                  onChange={(e) => setMt5Id(e.target.value)}
                  placeholder="Enter MT5 ID"
                  className="w-full h-10 sm:h-12 lg:h-14 xl:h-16 px-3 sm:px-4 lg:px-6 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base lg:text-lg"
                />
              </div>

              {/* Password Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                <div className="w-full">
                  <label className="block text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-3">
                    New Password (optional)
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full h-10 sm:h-12 lg:h-14 xl:h-16 px-3 sm:px-4 lg:px-6 pr-10 sm:pr-12 lg:pr-16 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base lg:text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-end w-full">
                  <button
                    onClick={handleSetPassword}
                    disabled={!newPassword}
                    className="w-full h-10 sm:h-12 lg:h-14 xl:h-16 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed text-sm sm:text-base lg:text-lg"
                  >
                    Set new password
                  </button>
                </div>
              </div>

              {/* Fetch Info Button */}
              <div className="pt-4 lg:pt-6 w-full">
                <button
                  onClick={handleFetchInfo}
                  disabled={!selectedUserEmail || !mt5Id || isLoading}
                  className="w-full h-10 sm:h-12 lg:h-14 xl:h-16 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base lg:text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 border-b-2 border-white mr-2 lg:mr-3"></div>
                      Fetching...
                    </div>
                  ) : (
                    "Fetch Info"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 lg:mt-12 w-full">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3">MT5 Account Info</h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-600">
                <p>• Account details will be displayed here</p>
                <p>• Balance and trading history</p>
                <p>• Current account status</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-3">Assignment Summary</h3>
              <div className="space-y-2 text-sm sm:text-base text-gray-600">
                <p>• Review assignment details</p>
                <p>• Confirm user mapping</p>
                <p>• Save to database</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}