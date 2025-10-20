import axios from "axios";

// Allowed option types
export type TicketStatus =
  | "Open"
  | "Completed"
  | "In progress"
  | "Wait For Response"
  | "Done"
  | "Closed";
export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type TicketSeverity = "minor" | "major" | "feature" | "critical";
export type TicketCategory = "big problem" | "small problem" | "other problem";

interface CreateTicketParams {
  title: string; // Mandatory
  parent_id: string; // Mandatory
  status: TicketStatus; // Mandatory
  access_token: string; // Mandatory

  assigned_to?: string;
  ticket_type?: string;
  priority?: TicketPriority;
  severity?: TicketSeverity;
  category?: TicketCategory;
  description?: string;
  account_number?: string;
  currency?: string;
  amount?: string;
  last4?: string;
  failed_deposit_error_descr?: string;
  failed_deposit_error_code?: string;
  failed_deposit_transaction_id?: string;
  failed_deposit_gateway_name?: string;
  failed_deposit_gateway_instance?: string;
  requested_leverage?: string;
  internal_transfer_to?: string;
  withdrawal_type?: string;
  withdrawal_bank_details?: string;
  withdrawal_beneficiary_name?: string;
  withdrawal_beneficiary_address?: string;
}

interface CreateTicketResponse {
  ticketid: string;
  message?: string;
  status?: string;
  status_code?: string;
  error?: string;
  ticket_no: string;
  // aur bhi fields add kar sakte ho based on actual API response
}

export async function createTicket(
  params: CreateTicketParams
): Promise<CreateTicketResponse> {
  try {
    const response = await axios.post<CreateTicketResponse>(
      "/api/ticket/create",
      params, // JSON bhejenge, backend usko x-www-form-urlencoded bana dega
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
