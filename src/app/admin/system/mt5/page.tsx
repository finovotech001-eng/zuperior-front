"use client";
import AdminLayout from "@/layouts/admin-layout";
import {
  Server,
  Wifi,
  WifiOff,
  Settings,
  TestTube,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";

interface MT5Connection {
  id: string;
  serverName: string;
  host: string;
  port: number;
  status: "connected" | "disconnected" | "error";
  lastPing: string;
  uptime: string;
  responseTime: number;
}

export default function MT5ConnectionPage() {

  // Mock data - replace with API call
  const mt5Connections: MT5Connection[] = [
    {
      id: "1",
      serverName: "MT5 Server 1",
      host: "mt5.server1.com",
      port: 443,
      status: "connected",
      lastPing: "2 seconds ago",
      uptime: "15d 8h 32m",
      responseTime: 45,
    },
    {
      id: "2",
      serverName: "MT5 Server 2",
      host: "mt5.server2.com",
      port: 443,
      status: "connected",
      lastPing: "1 second ago",
      uptime: "23d 14h 15m",
      responseTime: 38,
    },
    {
      id: "3",
      serverName: "MT5 Backup Server",
      host: "mt5.backup.com",
      port: 443,
      status: "disconnected",
      lastPing: "5 minutes ago",
      uptime: "0d 0h 0m",
      responseTime: 0,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
            <Wifi className="h-3 w-3 mr-1" />
            Connected
          </span>
        );
      case "disconnected":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
            <WifiOff className="h-3 w-3 mr-1" />
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

  const handleTestConnection = (serverId: string) => {
    // Test connection - replace with API call
    console.log(`Testing connection for server ${serverId}`);
  };

  const handleReconnect = (serverId: string) => {
    // Reconnect - replace with API call
    console.log(`Reconnecting server ${serverId}`);
  };

  const totalConnected = mt5Connections.filter(conn => conn.status === "connected").length;
  const avgResponseTime = mt5Connections
    .filter(conn => conn.responseTime > 0)
    .reduce((sum, conn) => sum + conn.responseTime, 0) / mt5Connections.filter(conn => conn.responseTime > 0).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <Server className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">MT5 Connection</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Monitor and manage MT5 server connections.</p>
          </div>
          <div className="flex-shrink-0">
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </button>
          </div>
        </div>

        {/* Connection Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-green-100">
                <Wifi className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Connected</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  {totalConnected}/{mt5Connections.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-blue-100">
                <Activity className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Avg Response</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {avgResponseTime.toFixed(0)}ms
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-xl bg-purple-100">
                <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Status</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  Healthy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button className="flex flex-col items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <TestTube className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mb-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-900">Test All</span>
            </button>
            <button className="flex flex-col items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Wifi className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mb-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-900">Reconnect All</span>
            </button>
            <button className="flex flex-col items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 mb-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-900">Settings</span>
            </button>
            <button className="flex flex-col items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mb-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-900">Logs</span>
            </button>
          </div>
        </div>

        {/* Connections Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Server Name
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Host
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Port
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response Time
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uptime
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Ping
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mt5Connections.map((connection) => (
                  <tr key={connection.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {connection.serverName}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {connection.host}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {connection.port}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(connection.status)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {connection.responseTime > 0 ? `${connection.responseTime}ms` : "-"}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {connection.uptime}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {connection.lastPing}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleTestConnection(connection.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <TestTube className="h-4 w-4" />
                        </button>
                        {connection.status !== "connected" && (
                          <button
                            onClick={() => handleReconnect(connection.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Wifi className="h-4 w-4" />
                          </button>
                        )}
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