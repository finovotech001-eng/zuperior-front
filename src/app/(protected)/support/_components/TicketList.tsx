"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Calendar, Clock, Search, Eye } from "lucide-react";
import { format, parseISO } from "date-fns";
import { getTickets, Ticket } from "@/services/getTickets";
import { useAppDispatch } from "@/store/hooks";
import { fetchAccessToken } from "@/store/slices/accessCodeSlice";
import { toast } from "sonner";

interface TicketListProps {
  selectedStatus: string;
  searchQuery: string;
  onTicketClick?: (ticket: Ticket) => void;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  New: { bg: "bg-blue-500/10", text: "text-blue-500" },
  "Under Review": { bg: "bg-yellow-500/10", text: "text-yellow-500" },
  "Action Required": { bg: "bg-orange-500/10", text: "text-orange-500" },
  "Escalated to provider": { bg: "bg-purple-500/10", text: "text-purple-500" },
  Reopened: { bg: "bg-red-500/10", text: "text-red-500" },
  "Solution Provided": { bg: "bg-green-500/10", text: "text-green-500" },
  Closed: { bg: "bg-gray-500/10", text: "text-gray-500" },
};

const priorityColors: Record<string, string> = {
  low: "bg-green-500",
  normal: "bg-gray-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

export default function TicketList({
  selectedStatus,
  searchQuery,
  onTicketClick,
}: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus, searchQuery]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      let token: string;
      try {
        token = await dispatch(fetchAccessToken()).unwrap();
      } catch (tokenError: any) {
        console.error("Failed to fetch access token:", tokenError);
        setTickets([]);
        return;
      }

      if (!token) {
        console.warn("Access token not available, skipping ticket fetch");
        setTickets([]);
        return;
      }

      const params: any = {};
      if (selectedStatus !== "All") params.status = selectedStatus;
      if (searchQuery) params.search = searchQuery;

      const data = await getTickets(params, token);
      setTickets(data);
    } catch (error: any) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-muted-foreground">Loading tickets...</div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg dark:text-white/75 font-medium">
          You don't have any tickets
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {selectedStatus !== "All" || searchQuery
            ? "Try adjusting your filters"
            : "Create a new ticket to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => onTicketClick?.(ticket)}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge
                    variant="outline"
                    className={statusColors[ticket.status]?.text}
                  >
                    {ticket.status}
                  </Badge>
                  <span className="text-sm font-mono text-muted-foreground">
                    {ticket.ticket_no}
                  </span>
                  <div
                    className={`h-2 w-2 rounded-full ${priorityColors[ticket.priority]}`}
                  />
                </div>
                <h3 className="text-lg font-semibold dark:text-white/75 mb-2">
                  {ticket.title}
                </h3>
                {ticket.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {ticket.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(parseISO(ticket.created_at), "MMM dd, yyyy")}
                  </div>
                  {ticket.last_reply_at && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(parseISO(ticket.last_reply_at), "MMM dd, yyyy")}
                    </div>
                  )}
                  {ticket.account_number && (
                    <Badge variant="secondary" className="text-xs">
                      {ticket.account_number}
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

