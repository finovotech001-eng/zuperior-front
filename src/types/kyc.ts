export interface KYCState {
  isDocumentVerified: boolean;
  isAddressVerified: boolean;
  verificationStatus: "unverified" | "partial" | "verified";
}
export interface DocumentKYCRequestBody {
  reference: string;
  document: {
    proof: Base64URLString; // Base64 encoded image/video
    //additional_proof?: string;
    supported_types: string[];
    fetch_enhanced_data: "1" | "0";
    name: {
      first_name?: string;
      last_name?: string;
      fuzzy_match?: "1" | "0";
    };
    dob?: string;
    //document_number?: string;
  };
}

export interface DocumentKYCResponse {
  reference: string;
  event: "verification.accepted" | "verification.declined" | string;
  verification_url?: string;

  // Only present when declined
  declined_reason?: string;
  declined_codes?: string[] | string;

  // Common extracted document data
  verification_data?: {
    document?: {
      name?: {
        first_name?: string;
        middle_name?: string;
        last_name?: string;
      };
      dob?: string; // sometimes available in verification_data
      selected_type?: string[];
    };
  };

  // Verification result (0 = failed, 1 = passed)
  verification_result?: {
    document?: Record<string, number | null>;
    address?: Record<string, number | null>;
  };

  // Extra proof data from OCR (very useful for accepted)
  additional_data?: {
    document?: {
      proof?: {
        dob?: string;
        document_number?: string;
        country?: string;
        country_code?: string;
        full_name?: string;
        father_name?: string;
        document_official_name?: string;
      };
    };
  };

  // Environment info
  info?: {
    agent?: {
      is_desktop?: boolean;
      is_phone?: boolean;
    };
  };

  // For error cases (like 401)
  error?: {
    message: string;
  };
}

export interface AMLRequestBody {
  reference: string;
  background_checks: {
    name: {
      full_name: string;
      fuzzy_match: "1";
    };
    filters: string[];
    countries?: string[];
    dob?: string;
    match_score: "95";
  };
}

export interface AMLResponse {
  reference?: string;
  event?: string;
  declined_reason?: string;
  error?: {
    message: string;
  };
}

export interface AddressKYCResponse {
  reference: string;
  event?: string;
  declined_reason?: string;
  verification_result: {
    address: {
      address_document: number;
      address_document_must_not_be_expired: number;
      full_address: number;
    };
  };
  error?: {
    message: string;
  };
}

export interface AddressKYCRequestBody {
  reference: string;
  address: {
    proof?: string;
    supported_types?: string[];
    full_address: string;
    address_fuzzy_match?: string;
    issue_date?: string;
    name?: {
      first_name?: string;
      last_name?: string;
      fuzzy_match?: "1" | "0";
    };
    backside_proof_required?: string;
    verification_instructions?: {
      allow_paper_based: string;
      allow_photocopy: string;
      allow_laminated: string;
      allow_screenshot: string;
      allow_cropped: string;
      allow_scanned: string;
    };
    show_ocr_form?: string;
    verification_mode?: string;
  };
}
