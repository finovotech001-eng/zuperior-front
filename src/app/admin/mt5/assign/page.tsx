"use client";

import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AssignMT5Account() {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [mt5Id, setMt5Id] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sample user emails from the image
  const userEmails = [
    "finovotech001@gmail.com",
    "katochrasik000@gmail.com",
    "mitteysh@gmail.com",
    "nogaba157@odboxan.com",
    "test1@gmail.com",
    "test@gmail.com"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement API call to assign MT5 account
    console.log("Assigning MT5 account:", {
      user: selectedUser,
      mt5Id,
      newPassword
    });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/mt5"
              className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assign Existing MT5 Account</h1>
                <p className="text-sm text-gray-600">Map an existing MT5 ID to a user account and save it to the database.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Account Assignment</CardTitle>
            <CardDescription>
              Select a user and enter their MT5 account details to establish the connection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Selection */}
              <div className="space-y-2">
                <Label htmlFor="user-select" className="text-sm font-medium text-gray-700">
                  Select User (Email)
                </Label>
                <Select value={selectedUser} onValueChange={setSelectedUser} required>
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="Choose a user email" />
                  </SelectTrigger>
                  <SelectContent>
                    {userEmails.map((email) => (
                      <SelectItem key={email} value={email}>
                        {email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* MT5 ID Input */}
              <div className="space-y-2">
                <Label htmlFor="mt5-id" className="text-sm font-medium text-gray-700">
                  Enter MT5 ID
                </Label>
                <Input
                  id="mt5-id"
                  type="text"
                  placeholder="Enter MT5 account ID"
                  value={mt5Id}
                  onChange={(e) => setMt5Id(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                  New Password (optional)
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Set new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || !selectedUser || !mt5Id}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11"
                >
                  {isLoading ? "Processing..." : "Fetch Info"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}