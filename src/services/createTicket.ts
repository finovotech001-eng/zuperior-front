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
  access_token?: string; // Optional - backend will fetch it if not provided

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
  success: boolean;
  message?: string;
  data: {
    id: number;
    ticket_no: string;
    parent_id: string;
    title: string;
    description?: string;
    ticket_type?: string;
    priority: string;
    status: string;
    account_number?: string;
    created_at: string;
    updated_at?: string;
    last_reply_at?: string;
  };
}

export async function createTicket(
  params: CreateTicketParams
): Promise<CreateTicketResponse> {
  try {
    // Backend expects these fields: title, description, ticket_type, priority, account_number
    // parent_id and status are handled by the backend from the authenticated user
    const { parent_id, status, access_token, ...bodyParams } = params;
    
    // Get auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    
    const response = await axios.post<CreateTicketResponse>(
      "/api/support/tickets",
      bodyParams,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
