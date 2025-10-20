"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Mail,
  Send,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

interface EmailCampaign {
  id: string;
  subject: string;
  type: "promotional" | "informational" | "transactional";
  status: "sent" | "draft" | "scheduled";
  recipients: number;
  sentDate: string;
  openRate: number;
  clickRate: number;
}

export default function SendEmailsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [emailForm, setEmailForm] = useState({
    subject: "",
    type: "promotional" as "promotional" | "informational" | "transactional",
    content: "",
    recipients: "all",
  });

  // Mock data - replace with API call
  const emailCampaigns: EmailCampaign[] = [
    {
      id: "1",
      subject: "Welcome to Our Trading Platform",
      type: "promotional",
      status: "sent",
      recipients: 1250,
      sentDate: "01 Oct 2025",
      openRate: 24.5,
      clickRate: 8.2,
    },
    {
      id: "2",
      subject: "Market Update - October 2025",
      type: "informational",
      status: "sent",
      recipients: 890,
      sentDate: "28 Sep 2025",
      openRate: 31.2,
      clickRate: 12.5,
    },
    {
      id: "3",
      subject: "Account Verification Required",
      type: "transactional",
      status: "draft",
      recipients: 45,
      sentDate: "25 Sep 2025",
      openRate: 0,
      clickRate: 0,
    },
  ];

  const filteredCampaigns = emailCampaigns.filter((campaign) =>
    campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendEmail = () => {
    // Send email - replace with API call
    console.log("Sending email:", emailForm);
    setShowComposeModal(false);
    setEmailForm({
      subject: "",
      type: "promotional",
      content: "",
      recipients: "all",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">Sent</span>;
      case "draft":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">Draft</span>;
      case "scheduled":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">Scheduled</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "promotional":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">Promotional</span>;
      case "informational":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">Informational</span>;
      case "transactional":
        return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">Transactional</span>;
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
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">Send Emails</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Send email campaigns to users.</p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowComposeModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Compose Email
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search emails..."
                className="w-full pl-3 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Email Campaigns Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Open Rate
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Click Rate
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
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                      {campaign.subject}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(campaign.type)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.recipients.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.openRate}%
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.clickRate}%
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.sentDate}
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

        {/* Compose Email Modal */}
        {showComposeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Compose Email
                  </h2>
                  <button
                    onClick={() => setShowComposeModal(false)}
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
                      Subject
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                      placeholder="Enter email subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      value={emailForm.type}
                      onChange={(e) => setEmailForm({...emailForm, type: e.target.value as "promotional" | "informational" | "transactional"})}
                    >
                      <option value="promotional">Promotional</option>
                      <option value="informational">Informational</option>
                      <option value="transactional">Transactional</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    value={emailForm.recipients}
                    onChange={(e) => setEmailForm({...emailForm, recipients: e.target.value})}
                  >
                    <option value="all">All Users</option>
                    <option value="active">Active Users Only</option>
                    <option value="verified">Verified Users Only</option>
                    <option value="vip">VIP Users Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content
                  </label>
                  <textarea
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    value={emailForm.content}
                    onChange={(e) => setEmailForm({...emailForm, content: e.target.value})}
                    placeholder="Enter your email content here..."
                  />
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowComposeModal(false)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm font-medium transition-colors"
                >
                  <Send className="h-4 w-4 mr-2 inline" />
                  Send Email
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}