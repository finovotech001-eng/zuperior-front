"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import {
  Settings,
  Save,
  RotateCcw,
  Shield,
  Database,
  Mail,
  Globe,
  Clock,
} from "lucide-react";

interface SystemSetting {
  id: string;
  category: string;
  name: string;
  value: string;
  type: "text" | "number" | "boolean" | "select";
  options?: string[];
  description: string;
}

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([
    {
      id: "1",
      category: "General",
      name: "Site Name",
      value: "ZuperiorX",
      type: "text",
      description: "Main site name displayed in header",
    },
    {
      id: "2",
      category: "General",
      name: "Default Language",
      value: "en",
      type: "select",
      options: ["en", "es", "fr", "de", "it"],
      description: "Default language for the platform",
    },
    {
      id: "3",
      category: "General",
      name: "Timezone",
      value: "UTC",
      type: "select",
      options: ["UTC", "EST", "PST", "GMT", "CET"],
      description: "Default timezone for the system",
    },
    {
      id: "4",
      category: "Security",
      name: "Two-Factor Authentication",
      value: "true",
      type: "boolean",
      description: "Enable 2FA for all admin accounts",
    },
    {
      id: "5",
      category: "Security",
      name: "Session Timeout",
      value: "30",
      type: "number",
      description: "Session timeout in minutes",
    },
    {
      id: "6",
      category: "Security",
      name: "Max Login Attempts",
      value: "5",
      type: "number",
      description: "Maximum failed login attempts before lockout",
    },
    {
      id: "7",
      category: "Email",
      name: "Email Verification Required",
      value: "true",
      type: "boolean",
      description: "Require email verification for new users",
    },
    {
      id: "8",
      category: "Email",
      name: "Welcome Email",
      value: "true",
      type: "boolean",
      description: "Send welcome email to new users",
    },
    {
      id: "9",
      category: "Trading",
      name: "Default Leverage",
      value: "100",
      type: "select",
      options: ["50", "100", "200", "500"],
      description: "Default leverage for new accounts",
    },
    {
      id: "10",
      category: "Trading",
      name: "Weekend Trading",
      value: "false",
      type: "boolean",
      description: "Allow trading on weekends",
    },
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (id: string, value: string) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, value } : setting
    ));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // Save settings - replace with API call
    console.log("Saving settings:", settings);
    setHasChanges(false);
  };

  const handleResetSettings = () => {
    // Reset to defaults - replace with API call
    console.log("Resetting settings to defaults");
    setHasChanges(false);
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, SystemSetting[]>);

  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.type) {
      case "boolean":
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={setting.value === "true"}
              onChange={(e) => handleSettingChange(setting.id, e.target.checked ? "true" : "false")}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        );
      case "select":
        return (
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
          >
            {setting.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case "number":
        return (
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
          />
        );
      default:
        return (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
          />
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">System Settings</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Configure global system settings and preferences.</p>
          </div>
          <div className="flex-shrink-0 flex gap-2">
            <button
              onClick={handleResetSettings}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={!hasChanges}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center mb-4">
              {category === "General" && <Globe className="h-5 w-5 text-blue-500 mr-3" />}
              {category === "Security" && <Shield className="h-5 w-5 text-green-500 mr-3" />}
              {category === "Email" && <Mail className="h-5 w-5 text-purple-500 mr-3" />}
              {category === "Trading" && <Database className="h-5 w-5 text-orange-500 mr-3" />}
              <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
            </div>

            <div className="space-y-4">
              {categorySettings.map((setting) => (
                <div key={setting.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      {setting.name}
                    </label>
                    <p className="text-xs text-gray-500">{setting.description}</p>
                  </div>
                  <div className="w-full sm:w-48">
                    {renderSettingInput(setting)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Save Status */}
        {hasChanges && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  You have unsaved changes
                </p>
                <p className="text-sm text-blue-700">
                  Don&apos;t forget to save your settings before leaving this page.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}