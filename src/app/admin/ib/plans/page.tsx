"use client";

import AdminLayout from "@/layouts/admin-layout";
import { Target, Users, DollarSign, TrendingUp, Edit, Eye, Plus } from "lucide-react";

interface IBPlan {
  id: string;
  name: string;
  description: string;
  type: "standard" | "premium" | "elite";
  commissionRate: number;
  minClients: number;
  maxClients: number;
  benefits: string[];
  requirements: string[];
  status: "active" | "inactive";
  totalIBs: number;
  totalCommission: number;
  createdAt: string;
  updatedAt: string;
}

export default function IBPlansPage() {
  const ibPlans: IBPlan[] = [
    {
      id: "PLAN-001",
      name: "Standard IB Plan",
      description: "Entry-level plan for new Introducing Brokers",
      type: "standard",
      commissionRate: 0.5,
      minClients: 10,
      maxClients: 50,
      benefits: ["Basic marketing materials", "Standard commission rate", "Email support"],
      requirements: ["Complete IB training", "Minimum 10 clients", "Monthly activity report"],
      status: "active",
      totalIBs: 25,
      totalCommission: 12500.00,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15",
    },
    {
      id: "PLAN-002",
      name: "Premium IB Plan",
      description: "Advanced plan for established Introducing Brokers",
      type: "premium",
      commissionRate: 0.75,
      minClients: 51,
      maxClients: 100,
      benefits: ["Premium marketing materials", "Higher commission rate", "Priority support", "Advanced analytics"],
      requirements: ["6 months experience", "Minimum 50 clients", "Quarterly review"],
      status: "active",
      totalIBs: 18,
      totalCommission: 25600.00,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15",
    },
    {
      id: "PLAN-003",
      name: "Elite IB Plan",
      description: "Top-tier plan for elite Introducing Brokers",
      type: "elite",
      commissionRate: 1.0,
      minClients: 101,
      maxClients: -1, // unlimited
      benefits: ["Elite marketing materials", "Maximum commission rate", "Dedicated support", "Custom solutions", "Revenue sharing"],
      requirements: ["2 years experience", "Minimum 100 clients", "Monthly review", "Performance targets"],
      status: "active",
      totalIBs: 7,
      totalCommission: 45200.00,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-15",
    },
    {
      id: "PLAN-004",
      name: "Regional IB Plan",
      description: "Specialized plan for regional markets",
      type: "premium",
      commissionRate: 0.8,
      minClients: 30,
      maxClients: 75,
      benefits: ["Regional marketing focus", "Local support", "Customized solutions"],
      requirements: ["Regional market knowledge", "Minimum 30 clients", "Local presence"],
      status: "inactive",
      totalIBs: 3,
      totalCommission: 8900.00,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-10",
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "standard":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Standard</span>;
      case "premium":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Premium</span>;
      case "elite":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Elite</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{type}</span>;
    }
  };

  const stats = [
    { label: "Active Plans", value: ibPlans.filter(p => p.status === "active").length, icon: Target, color: "bg-green-500" },
    { label: "Total IBs", value: ibPlans.reduce((acc, p) => acc + p.totalIBs, 0), icon: Users, color: "bg-blue-500" },
    { label: "Total Commission", value: "$92,200.00", icon: DollarSign, color: "bg-purple-500" },
    { label: "Avg. Commission Rate", value: "0.75%", icon: TrendingUp, color: "bg-emerald-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">IB Plans</h1>
            <p className="text-sm text-gray-600 mt-1">Manage Introducing Broker plans and structures</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
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

        {/* IB Plans Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">IB Plans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total IBs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ibPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {plan.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                        <div className="text-sm text-gray-500">{plan.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(plan.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {plan.commissionRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {plan.minClients} - {plan.maxClients === -1 ? "∞" : plan.maxClients}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {plan.totalIBs}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(plan.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plan.updatedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
                  <span className="font-medium">4</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}