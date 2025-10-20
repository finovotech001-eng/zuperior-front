"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/layouts/admin-layout";
import {
  ArrowLeft,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Target,
  Calendar,
  Phone,
  MapPin,
  Settings
} from "lucide-react";
import Link from "next/link";

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

export default function IBProfileDetailPage() {
  const params = useParams();
  const [ibProfile, setIbProfile] = useState<IBProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    const mockProfiles: IBProfile[] = [
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

    const profile = mockProfiles.find(p => p.id === params.id);
    setIbProfile(profile || null);
    setLoading(false);
  }, [params.id]);

  const getStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
        status === "active"
          ? "bg-green-100 text-green-800"
          : status === "inactive"
          ? "bg-gray-100 text-gray-800"
          : "bg-red-100 text-red-800"
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!ibProfile) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-lg text-gray-500 mb-4">IB Profile not found</div>
          <Link
            href="/admin/ib/profiles"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Back to Profiles
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/ib/profiles"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profiles
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                IB Profile - {ibProfile.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Detailed information and performance metrics
              </p>
            </div>
          </div>
        </div>

        {/* Profile Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100">
                <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Commission</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${ibProfile.totalCommission.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-green-100">
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Referral Commission</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${ibProfile.referralCommission.toLocaleString()}
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
                <p className="text-xs sm:text-sm font-medium text-gray-500">Pip Commission</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${ibProfile.pipCommission}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-orange-100">
                <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Withdrawal</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${ibProfile.totalWithdrawal.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-cyan-100">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-cyan-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Referrals</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {ibProfile.totalReferrals}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{ibProfile.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs text-blue-600">@</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{ibProfile.email}</p>
                </div>
              </div>
              {ibProfile.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{ibProfile.phone}</p>
                  </div>
                </div>
              )}
              {ibProfile.country && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="font-medium text-gray-900">{ibProfile.country}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="font-medium text-gray-900">{ibProfile.joinDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Status & Plan</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(ibProfile.status)}
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm font-medium text-gray-900">{ibProfile.plan}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Performance:</span>
                {getPerformanceBadge(ibProfile.performance)}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Clients:</span>
                <span className="text-sm font-medium text-gray-900">{ibProfile.totalClients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Active Referrals:</span>
                <span className="text-sm font-medium text-gray-900">{ibProfile.activeReferrals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Monthly Commission:</span>
                <span className="text-sm font-medium text-gray-900">${ibProfile.monthlyCommission.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Activity:</span>
                <span className="text-sm font-medium text-gray-900">{ibProfile.lastActivity}</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Net Position:</span>
                  <span className={`text-lg font-bold ${
                    (ibProfile.totalCommission - ibProfile.totalWithdrawal) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    ${(ibProfile.totalCommission - ibProfile.totalWithdrawal).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral People Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Referral People</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Join Date
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Commission
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Trades
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ibProfile.referralPeople.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {person.name}
                    </td>
                    <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {person.email}
                    </td>
                    <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {person.joinDate}
                    </td>
                    <td className="px-2 sm:px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        person.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {person.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                      ${person.commission.toLocaleString()}
                    </td>
                    <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                      {person.trades}
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