"use client";

// import Image from "next/image";
import { Search, MessageCircle, ChevronDown, Info, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState, store } from "@/store";
import { Plus } from "lucide-react";
import { TextAnimate } from "@/components/ui/text-animate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo, useCallback } from "react";
import OpenTicketFlow from "./_components/OpenTicketFlow";
import { TicketFormData } from "./_components/types";
import {
  createTicket,
  TicketPriority,
  TicketStatus,
} from "@/services/createTicket";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { fetchAccessToken } from "@/store/slices/accessCodeSlice";

const statusOptions = [
  "All",
  "New",
  "Under Review",
  "Action Required",
  "Escalated to provider",
  "Reopened",
  "Solution Provided",
  "Closed",
];

export default function SupportHub() {
  const userName = useSelector(
    (state: RootState) => state.user.data?.accountname
  )?.split(" ")[0];

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleStatusChange = useCallback((status: string) => {
    setSelectedStatus(status);
  }, []);

  // Ticket flow states
  const [openTicketMode, setOpenTicketMode] = useState(false);

  const handleTicketSubmit = async (data: TicketFormData) => {
    setLoading(true);
    try {
      const freshToken = await dispatch(fetchAccessToken()).unwrap();
      const params = {
        title: data.subject,
        parent_id: store.getState().user.data?.crm_account_id.toString() || "",
        status: "Open" as TicketStatus,
        priority: (data.priority.toLowerCase() as TicketPriority) || "normal",
        description: data.description,
        ticket_type: data.category,
        access_token: freshToken,
        ...(data.account_number && { account_number: data.account_number }),
      };

      const response = await createTicket(params);
      toast.success(
        "Ticket created successfully! Ticket No: " + response.ticket_no
      );
    } catch (err) {
      console.log("Failed to create ticket:", err);
      toast.error("Failed to create ticket, please try again later");
    } finally {
      setLoading(false);
      setOpenTicketMode(false);
    }
  };

  const statusList = useMemo(
    () =>
      statusOptions.map((status) => (
        <DropdownMenuItem
          key={status}
          onClick={() => handleStatusChange(status)}
          className="cursor-pointer py-2.5 px-3
            dark:hover:bg-[#23203a] dark:hover:text-fuchsia-300
            hover:bg-gray-300 hover:text-black
            dark:text-white/60 transition-colors"
        >
          {status}
        </DropdownMenuItem>
      )),
    [handleStatusChange]
  );

  if (openTicketMode) {
    return (
      <OpenTicketFlow
        onBack={() => setOpenTicketMode(false)}
        onSubmit={handleTicketSubmit}
        loading={loading}
      />
    );
  }

  const openCrispChat = () => {
    if (typeof window !== "undefined" && window.$crisp) {
      // For open tha chat
      window.$crisp.push(["do", "chat:show"]);
      window.$crisp.push(["do", "chat:open"]);

      // After close hide it from every page
      window.$crisp.push([
        "on",
        "chat:closed",
        () => {
          window.$crisp.push(["do", "chat:hide"]);
        },
      ]);
    } else {
      console.error("Crisp chat is not loaded yet");
    }
  };

  return (
    <div className="px-3 md:px-0 pb-6">
      {/* Header */}
      <TextAnimate
        as="h1"
        duration={0.2}
        className="mb-4 text-[34px] font-semibold dark:text-white/75"
      >
        Support hub
      </TextAnimate>
      <TextAnimate
        as="h2"
        duration={0.2}
        className="text-2xl dark:text-white/75 mb-3"
      >
        Help center
      </TextAnimate>

      {/* Help Section */}
      <section className="rounded-lg border-2 border-gray-300 dark:border-[#1D1825] dark:bg-gradient-to-r from-[#FFFFFF] to-[#f4e7f6] p-5 sm:p-7 dark:from-[#110F17] dark:to-[#1E1429]">
        {/* Header */}
        <h3 className="mb-4 text-xl sm:text-2xl font-semibold dark:text-white/75">
          Hello {userName || "User"}, how can we help you?
        </h3>
        <p className="text-sm sm:text-base dark:text-white/75">
          Your one-stop solution for all your needs. Find answers, troubleshoot
          issues, and explore guides.
        </p>

        {/* Search */}
        {/* <div className="relative max-w-4xl">
          <Input
            type="text"
            placeholder="Please enter your question or keyword..."
            className="h-12 pr-12 text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            size="sm"
            className="absolute right-1 top-1 h-10 w-10 bg-[#c5a3e9] text-black hover:bg-[#c5a3e9] "
          >
            <Search className="h-4 w-4" />
          </Button>
        </div> */}
      </section>

      {/* Contact Section */}
      <TextAnimate
        as="h3"
        duration={0.2}
        className="mb-4 mt-6 text-xl sm:text-2xl font-semibold dark:text-white/75"
      >
        Contact us
      </TextAnimate>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {/* Ticket Card */}
        <Card className="overflow-hidden dark:bg-[#120f18] py-0">
          {/* <div className="relative h-40 sm:h-48">
            <Image
              src={contact3}
              alt="Need assistance illustration"
              fill
              className="object-cover"
            />
          </div> */}
          <CardContent className="p-6">
            <h4 className="text-lg sm:text-xl dark:text-white/75 font-semibold mb-3">
              Need assistance?
            </h4>
            <p className="text-sm sm:text-base dark:text-white/75 mb-4">
              Complete the form and we will get back to you shortly.
            </p>
            <Button
              className="gap-1 w-full sm:w-auto bg-gradient-to-r from-[#6242a5] to-[#9f8bcf] text-white rounded-lg font-medium"
              onClick={() => setOpenTicketMode(true)}
            >
              <Plus className="w-3 h-3" />Open a ticket
            </Button>
          </CardContent>
        </Card>

        {/* Chat Card */}
        <Card className="overflow-hidden dark:bg-[#120f18] py-0">
          {/* <div className="relative h-40 sm:h-48">
            <Image
              src={contact1}
              alt="Live chat illustration"
              fill
              className="object-cover"
            />
          </div> */}
          <CardContent className="p-6">
            <h4 className="text-lg sm:text-xl dark:text-white/75 font-semibold mb-3">
              Live chat
            </h4>
            <p className="text-sm sm:text-base dark:text-white/75 mb-4">
              Can&apos;t find the answers? Chat with our Intelligent Assistant.
            </p>
            <Button
              variant="outline"
              className="w-full sm:w-auto font-medium border-2 bg-transparent"
              onClick={openCrispChat}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start chat
            </Button>
          </CardContent>
        </Card>

        {/* Phone Card */}
        <Card className="overflow-hidden dark:bg-[#120f18] py-0">
          {/* <div className="relative h-40 sm:h-48">
            <Image
              src={contact2}
              alt="Phone support illustration"
              fill
              className="object-cover"
            />
          </div> */}
          <CardContent className="p-6">
            <h4 className="text-lg sm:text-xl dark:text-white/75 font-semibold mb-3">
              Still need help?
            </h4>
            <p className="text-sm sm:text-base dark:text-white/75 mb-4">
              To speak with our support team, Email us at
            </p>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex items-center dark:text-white/75">
                <Mail className="h-4 w-4 mr-2" />
                <span>support@zuperior.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Section */}
      <TextAnimate
        as="h1"
        duration={0.2}
        className="mb-4 mt-6 text-2xl font-semibold dark:text-white/75 "
      >
        My tickets
      </TextAnimate>

      <div className="rounded-lg p-6 bg-white dark:bg-gradient-to-r from-[#FFFFFF] dark:from-[#110F17] to-[#f4e7f6] dark:to-[#1E1429] border-2 dark:border-[#1D1825] border-gray-300">
        {/* Controls Bar */}
        <div className="flex items-center justify-between gap-4">
          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground bg-transparent"
              >
                Active statuses: {selectedStatus}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-44 dark:bg-[#110f17] dark:text-white/50"
            >
              {statusList}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Bar */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Info className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg dark:text-white/75 font-medium">
            You don&apos;t have any tickets
          </p>
        </div>
      </div>
    </div>
  );
}
