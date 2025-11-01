"use client";

import { useState, useEffect } from "react";
import { Monitor, Smartphone, Tablet, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { userService } from "@/services/api.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LoginActivity {
  id: string;
  device: string | null;
  browser: string | null;
  created_at: string;
}

interface LoginActivityResponse {
  success: boolean;
  data: {
    activities: LoginActivity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

const getDeviceIcon = (device: string | null) => {
  if (!device) return <Monitor className="h-4 w-4" />;
  
  const deviceLower = device.toLowerCase();
  if (deviceLower === 'mobile') {
    return <Smartphone className="h-4 w-4" />;
  } else if (deviceLower === 'tablet') {
    return <Tablet className="h-4 w-4" />;
  }
  return <Monitor className="h-4 w-4" />;
};

export default function LoginActivity() {
  const [activities, setActivities] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoginActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = (await userService.getUserLoginActivity(1, 20)) as LoginActivityResponse;
        
        if (response.success && response.data) {
          setActivities(response.data.activities || []);
        } else {
          setError("Failed to load login activity");
        }
      } catch (err: any) {
        console.error("Error fetching login activity:", err);
        setError("Failed to load login activity");
      } finally {
        setLoading(false);
      }
    };

    fetchLoginActivity();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
        No login activity found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <Card
          key={activity.id}
          className="border dark:border-[#1D1825] dark:bg-gradient-to-r from-[#1A1420] to-[#1E1429]"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-r from-[#6242a5]/20 to-[#9f8bcf]/20 p-2 flex-shrink-0">
                  {getDeviceIcon(activity.device)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium dark:text-white/75 text-gray-900">
                      {activity.device || "Desktop"}
                    </span>
                    {index === 0 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-green-600/20 text-green-400 border-green-600/30"
                      >
                        Current Session
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {activity.browser || "Unknown Browser"}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(activity.created_at), "MMM dd, yyyy HH:mm")}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

