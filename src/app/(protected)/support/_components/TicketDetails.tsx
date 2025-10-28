"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MessageSquare,
  Send,
  User,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  getTicketById,
  TicketWithReplies,
  addTicketReply,
} from "@/services/getTickets";
import { useAppDispatch } from "@/store/hooks";
import { fetchAccessToken } from "@/store/slices/accessCodeSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TicketDetailsProps {
  ticketId: number;
  onBack: () => void;
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

export default function TicketDetails({ ticketId, onBack }: TicketDetailsProps) {
  const [ticket, setTicket] = useState<TicketWithReplies | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      let token: string;
      try {
        token = await dispatch(fetchAccessToken()).unwrap();
      } catch (tokenError: any) {
        console.error("Failed to fetch access token:", tokenError);
        return;
      }

      if (!token) {
        console.warn("Access token not available");
        return;
      }

      const data = await getTicketById(ticketId, token);
      setTicket(data);
    } catch (error: any) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || submittingReply) return;

    setSubmittingReply(true);
    try {
      let token: string;
      try {
        token = await dispatch(fetchAccessToken()).unwrap();
      } catch (tokenError: any) {
        console.error("Failed to fetch access token:", tokenError);
        toast.error("Authentication failed");
        return;
      }

      if (!token) {
        toast.error("Authentication failed");
        return;
      }

      await addTicketReply(ticketId, { content: replyContent }, token);
      toast.success("Reply added successfully");
      setReplyContent("");
      fetchTicket(); // Refresh ticket with new reply
    } catch (error: any) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loading || !ticket) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </Button>
      </div>

      {/* Ticket Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
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
              <CardTitle className="mb-3">{ticket.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Created {format(parseISO(ticket.created_at), "MMM dd, yyyy")}
                </div>
                {ticket.last_reply_at && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Last reply {format(parseISO(ticket.last_reply_at), "MMM dd")}
                  </div>
                )}
                {ticket.account_number && (
                  <Badge variant="secondary">Account: {ticket.account_number}</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        {ticket.description && (
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-sm whitespace-pre-wrap dark:text-white/75">
                {ticket.description}
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Replies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold dark:text-white/75">
          Replies ({ticket.replies?.length || 0})
        </h3>

        <div className="space-y-4">
          {ticket.replies && ticket.replies.length > 0 ? (
            ticket.replies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold dark:text-white/75">
                          {reply.sender_name}
                        </span>
                        {reply.sender_type === "admin" && (
                          <Badge variant="secondary" className="text-xs">
                            Support
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(reply.created_at), "MMM dd, yyyy HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap dark:text-white/75">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No replies yet. Be the first to respond!
            </div>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {ticket.status !== "Closed" && (
        <Card>
          <CardHeader>
            <CardTitle>Add Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReply}>
              <Textarea
                placeholder="Type your reply here..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
                className="mb-4"
              />
              <Button type="submit" disabled={submittingReply || !replyContent.trim()}>
                {submittingReply ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

