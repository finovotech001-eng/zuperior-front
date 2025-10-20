"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Search,
  Users,
  UserPlus,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MT5Account {
  mt5Id: string;
  password: string;
  investor: string;
  phonePass: string;
  leverage: string;
  currency: string;
  server: string;
  accountType: string;
  createdAt: string;
  balance: number;
  equity: number;
  marginFree: number;
}

interface MT5User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  mt5Accounts: string;
  totalBalance: number;
  mt5AccountDetails?: MT5Account[];
}

export default function MT5UsersListPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with API call
  const mt5Users: MT5User[] = [
    {
      id: "1",
      fullName: "Naitik Sharma",
      email: "rakesh231980@gmail.com",
      phone: "6280325055",
      country: "India",
      mt5Accounts: "1",
      totalBalance: 5141.08,
      mt5AccountDetails: [
        {
          mt5Id: "200707",
          password: "Rakesh@123",
          investor: "Inv9210@",
          phonePass: "Ph7597",
          leverage: "1:50",
          currency: "USD",
          server: "RevoCapital-Live",
          accountType: "Standard",
          createdAt: "09 Oct 2025",
          balance: 5141.08,
          equity: 4567.55,
          marginFree: 4567.55,
        }
      ]
    },
    {
      id: "2",
      fullName: "TestAccount Account",
      email: "test@gmail.com",
      phone: "7529860737",
      country: "India",
      mt5Accounts: "3",
      totalBalance: 999999.02,
    },
    {
      id: "3",
      fullName: "Manmohan Singh",
      email: "manmohansingh98@gmail.com",
      phone: "6284558815",
      country: "India",
      mt5Accounts: "1",
      totalBalance: 0.00,
    },
  ];

  const filteredUsers = mt5Users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);

    return matchesSearch;
  });


  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">MT5 Users List</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage MT5 platform users and accounts.</p>
          </div>
          <div className="flex-shrink-0 flex gap-2">
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Phone
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Country
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MT5 Accounts
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Balance
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{user.fullName}</div>
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {user.phone}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {user.country}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.mt5Accounts}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${user.totalBalance.toLocaleString()}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                            View
                          </button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                          <DialogHeader className="pb-4">
                            <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 pr-8">
                              MT5 Accounts - {user.fullName}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-600 mt-1">
                              Detailed information about MT5 accounts for this user
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-6">
                            {user.mt5AccountDetails && user.mt5AccountDetails.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 table-auto">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        MT5 ID
                                      </th>
                                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Password
                                      </th>
                                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                        Investor
                                      </th>
                                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                        Phone Pass
                                      </th>
                                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Leverage
                                      </th>
                                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                        Currency
                                      </th>
                                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Server
                                      </th>
                                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                        Account Type
                                      </th>
                                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                        Created At
                                      </th>
                                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Balance
                                      </th>
                                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                        Equity
                                      </th>
                                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Margin Free
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {user.mt5AccountDetails.map((account, accountIndex) => (
                                      <tr key={accountIndex} className="hover:bg-gray-50">
                                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {account.mt5Id}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {account.password}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                          {account.investor}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                          {account.phonePass}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {account.leverage}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                          {account.currency}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                                          {account.server}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                                          {account.accountType}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                                          {account.createdAt}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                          ${account.balance.toLocaleString()}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                                          ${account.equity.toLocaleString()}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                                          ${account.marginFree.toLocaleString()}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                No MT5 account details available
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}