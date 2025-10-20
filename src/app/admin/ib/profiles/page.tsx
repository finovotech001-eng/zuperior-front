"use client";

import Link from "next/link";
import AdminLayout from "@/layouts/admin-layout";
import {
  Users,
  Activity,
  Search,
  Target,
  Award
} from "lucide-react";

interface ReferralPerson {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: "active" | "inactive";
  commission: number;
  trades: number;
}

interface IBProfile {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: "active" | "inactive" | "suspended";
  plan: string;
  totalClients: number;
  totalCommission: number;
  monthlyCommission: number;
  referralCommission: number;
  pipCommission: number;
  totalWithdrawal: number;
  performance: "excellent" | "good" | "average" | "poor";
  lastActivity: string;
  phone?: string;
  country?: string;
  totalReferrals: number;
  activeReferrals: number;
  referralPeople: ReferralPerson[];
}

export default function IBProfilesPage() {

  const ibProfiles: IBProfile[] = [
    {
      id: "IB-001",
      name: "John Doe",
      email: "john@example.com",
      joinDate: "2024-01-10",
      status: "active",
      plan: "Premium IB Plan",
      totalClients: 45,
      totalCommission: 12500.00,
      monthlyCommission: 2500.00,
      referralCommission: 3500.00,
      pipCommission: 2.50,
      totalWithdrawal: 8200.00,
      performance: "excellent",
      lastActivity: "2024-01-15 10:30 AM",
      phone: "+1-555-0123",
      country: "United States",
      totalReferrals: 45,
      activeReferrals: 38,
      referralPeople: [
        {
          id: "R1",
          name: "Alice Cooper",
          email: "alice@example.com",
          joinDate: "2024-01-12",
          status: "active",
          commission: 450.00,
          trades: 23
        },
        {
          id: "R2",
          name: "Bob Wilson",
          email: "bob@example.com",
          joinDate: "2024-01-10",
          status: "active",
          commission: 320.00,
          trades: 18
        }
      ]
    },
    {
      id: "IB-002",
      name: "Jane Smith",
      email: "jane@example.com",
      joinDate: "2024-01-08",
      status: "active",
      plan: "Standard IB Plan",
      totalClients: 32,
      totalCommission: 8900.00,
      monthlyCommission: 1800.00,
      referralCommission: 2100.00,
      pipCommission: 1.80,
      totalWithdrawal: 5600.00,
      performance: "good",
      lastActivity: "2024-01-15 09:15 AM",
      phone: "+1-555-0456",
      country: "Canada",
      totalReferrals: 32,
      activeReferrals: 28,
      referralPeople: [
        {
          id: "R3",
          name: "Carol Davis",
          email: "carol@example.com",
          joinDate: "2024-01-09",
          status: "active",
          commission: 280.00,
          trades: 15
        }
      ]
    },
    {
      id: "IB-003",
      name: "Mike Johnson",
      email: "mike@example.com",
      joinDate: "2024-01-05",
      status: "inactive",
      plan: "Basic IB Plan",
      totalClients: 18,
      totalCommission: 4200.00,
      monthlyCommission: 800.00,
      referralCommission: 950.00,
      pipCommission: 1.20,
      totalWithdrawal: 2800.00,
      performance: "average",
      lastActivity: "2024-01-14 16:20 PM",
      phone: "+1-555-0789",
      country: "United Kingdom",
      totalReferrals: 18,
      activeReferrals: 12,
      referralPeople: [
        {
          id: "R4",
          name: "David Brown",
          email: "david@example.com",
          joinDate: "2024-01-06",
          status: "inactive",
          commission: 120.00,
          trades: 8
        }
      ]
    },
    {
      id: "IB-004",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      joinDate: "2024-01-03",
      status: "suspended",
      plan: "Premium IB Plan",
      totalClients: 67,
      totalCommission: 18500.00,
      monthlyCommission: 3200.00,
      referralCommission: 4800.00,
      pipCommission: 3.20,
      totalWithdrawal: 12400.00,
      performance: "poor",
      lastActivity: "2024-01-13 14:45 PM",
      phone: "+1-555-0321",
      country: "Australia",
      totalReferrals: 67,
      activeReferrals: 15,
      referralPeople: [
        {
          id: "R5",
          name: "Emma Taylor",
          email: "emma@example.com",
          joinDate: "2024-01-04",
          status: "active",
          commission: 890.00,
          trades: 45
        },
        {
          id: "R6",
          name: "Frank Miller",
          email: "frank@example.com",
          joinDate: "2024-01-05",
          status: "active",
          commission: 650.00,
          trades: 32
        }
      ]
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case "inactive":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
      case "suspended":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Suspended</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "excellent":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Excellent</span>;
      case "good":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Good</span>;
      case "average":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Average</span>;
      case "poor":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Poor</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{performance}</span>;
    }
  };


  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">IB Profiles</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage and monitor Introducing Broker profiles and performance</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total IBs</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {ibProfiles.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-green-100">
                <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Active IBs</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {ibProfiles.filter(ib => ib.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-purple-100">
                <Target className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Clients</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {ibProfiles.reduce((sum, ib) => sum + ib.totalClients, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-orange-100">
                <Award className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Commission</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${ibProfiles.reduce((sum, ib) => sum + ib.totalCommission, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* IB Profiles Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">IB Profiles</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search IBs..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IB Name
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Status
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Plan
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clients
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Commission
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Performance
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ibProfiles.map((ib) => (
                  <tr key={ib.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ib.name}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {ib.email}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      {getStatusBadge(ib.status)}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                      {ib.plan}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ib.totalClients}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      ${ib.totalCommission.toLocaleString()}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      {getPerformanceBadge(ib.performance)}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/ib/profiles/${ib.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors inline-block"
                      >
                        View
                      </Link>
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