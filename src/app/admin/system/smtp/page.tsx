"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Mail,
  Send,
  TestTube,
  CheckCircle,
  XCircle,
  Settings,
  Activity,
} from "lucide-react";

interface SMTPConfig {
  id: string;
  provider: string;
  host: string;
  port: number;
  encryption: string;
  status: "connected" | "disconnected" | "error";
  lastTest: string;
  successRate: number;
  totalSent: number;
  failedCount: number;
}

export default function SMTPConnectionPage() {
  const [testInProgress, setTestInProgress] = useState(false);

  // Mock data - replace with API call
  const smtpConfigs: SMTPConfig[] = [
    {
      id: "1",
      provider: "Gmail SMTP",
      host: "smtp.gmail.com",
      port: 587,
      encryption: "TLS",
      status: "connected",
      lastTest: "5 minutes ago",
      successRate: 99.2,
      totalSent: 15420,
      failedCount: 118,
    },
    {
      id: "2",
      provider: "SendGrid",
      host: "smtp.sendgrid.net",
      port: 587,
      encryption: "TLS",
      status: "connected",
      lastTest: "2 minutes ago",
      successRate: 98.7,
      totalSent: 8930,
      failedCount: 115,
    },
    {
      id: "3",
      provider: "Amazon SES",
      host: "email-smtp.us-east-1.amazonaws.com",
      port: 587,
      encryption: "TLS",
      status: "error",
      lastTest: "15 minutes ago",
      successRate: 95.4,
      totalSent: 5670,
      failedCount: 256,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </span>
        );
      case "disconnected":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Disconnected
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const handleTestSMTP = (configId: string) => {
    setTestInProgress(true);
    // Test SMTP - replace with API call
    setTimeout(() => {
      setTestInProgress(false);
      console.log(`Testing SMTP for config ${configId}`);
    }, 2000);
  };

  const handleSendTestEmail = () => {
    // Send test email - replace with API call
    console.log("Sending test email");
  };

  const totalEmails = smtpConfigs.reduce((sum, config) => sum + config.totalSent, 0);
  const totalFailed = smtpConfigs.reduce((sum, config) => sum + config.failedCount, 0);
  const avgSuccessRate = smtpConfigs.reduce((sum, config) => sum + config.successRate, 0) / smtpConfigs.length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">SMTP Connection</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Configure and monitor SMTP email connections.</p>
          </div>
          <div className="flex-shrink-0 flex gap-2">
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
            <button
              onClick={handleSendTestEmail}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Test Email
            </button>
          </div>
        </div>

        {/* Email Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100">
                <Mail className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Sent</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalEmails.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-red-100">
                <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Failed</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalFailed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-green-100">
                <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  {avgSuccessRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-purple-100">
                <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Providers</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {smtpConfigs.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SMTP Configurations Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Host
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Port
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Encryption
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sent
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Test
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {smtpConfigs.map((config) => (
                  <tr key={config.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {config.provider}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {config.host}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.port}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {config.encryption}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(config.status)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.successRate}%
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {config.totalSent.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {config.lastTest}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleTestSMTP(config.id)}
                          disabled={testInProgress}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        >
                          <TestTube className="h-4 w-4" />
                        </button>
                      </div>
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