"use client";

import { useState } from "react";
import Image from "next/image";
import AdminLayout from "@/layouts/admin-layout";
import {
  QrCode,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon,
} from "lucide-react";

interface WalletQR {
  id: string;
  name: string;
  type: string;
  qrImage: string;
  walletAddress: string;
  status: "active" | "inactive";
  uploadDate: string;
}

export default function WalletQRUploadPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Mock data - replace with API call
  const qrWallets: WalletQR[] = [
    {
      id: "1",
      name: "BTC Wallet",
      type: "Bitcoin",
      qrImage: "/api/placeholder/100/100",
      walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      status: "active",
      uploadDate: "01 Oct 2025",
    },
    {
      id: "2",
      name: "ETH Wallet",
      type: "Ethereum",
      qrImage: "/api/placeholder/100/100",
      walletAddress: "0x742d35Cc6635C0532925a3b8D0C8c7bDd7F6F067",
      status: "active",
      uploadDate: "28 Sep 2025",
    },
  ];

  const filteredWallets = qrWallets.filter((wallet) =>
    wallet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Handle file upload - replace with API call
      console.log("Uploading file:", selectedFile.name);
      setSelectedFile(null);
      setPreviewUrl("");
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
        Inactive
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <QrCode className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              <span className="truncate">Wallet QR Upload</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Upload and manage wallet QR codes for payments.</p>
          </div>
          <div className="flex-shrink-0">
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add QR Code
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New QR Code</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select QR Code Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="qr-upload"
                />
                <label htmlFor="qr-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-48 flex items-center justify-center">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="QR Preview"
                    width={200}
                    height={128}
                    className="max-w-full max-h-32 object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No image selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedFile && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Upload QR Code
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search QR codes..."
                className="w-full pl-3 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* QR Wallets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredWallets.map((wallet) => (
            <div key={wallet.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                    <p className="text-sm text-gray-500">{wallet.type}</p>
                  </div>
                </div>
                {getStatusBadge(wallet.status)}
              </div>

              {/* QR Image */}
              <div className="mb-4 bg-gray-50 rounded-lg p-3 flex justify-center">
                <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                  <QrCode className="h-10 w-10 text-gray-400" />
                </div>
              </div>

              {/* Wallet Address */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-1">Wallet Address</p>
                <p className="text-xs font-mono text-gray-600 break-all">{wallet.walletAddress}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                  <Eye className="h-4 w-4 inline mr-1" />
                  View
                </button>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 p-1">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}