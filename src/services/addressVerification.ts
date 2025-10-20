import { AddressKYCResponse } from "@/types/kyc";
import axios from "axios";

interface AddressVerificationParams {
  file: File;
  first_name: string;
  last_name: string;
  full_address: string;
  selected_document_type?: string;
}

export async function addressVerification(params: AddressVerificationParams) {
  try {
    const kycRef = `kyc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(params.file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

    const response = await axios.post("/api/kyc/address", {
      reference: kycRef,
      address: {
        proof: base64String,
        supported_types: params.selected_document_type
          ? [params.selected_document_type]
          : ["id_card", "bank_statement", "utility_bill"],
        full_address: params.full_address,
        address_fuzzy_match: "1",
        //issue_date: new Date().toISOString().split("T")[0], // optional (today's date)
        name: {
          first_name: params.first_name,
          last_name: params.last_name,
          fuzzy_match: "1",
        },
        backside_proof_required: "0",
        verification_instructions: {
          allow_paper_based: "1",
          allow_photocopy: "1",
          allow_laminated: "1",
          allow_screenshot: "1",
          allow_cropped: "1",
          allow_scanned: "1",
        },
        verification_mode: "any",
      },
    });

    const data: AddressKYCResponse = await response.data;
    data.reference = kycRef;

    return data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error during document verification:", error);
    // also return error so caller can handle
    return error.response?.data || { error: error.message };
  }
}
