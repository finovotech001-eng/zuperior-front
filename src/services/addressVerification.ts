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
    const addressRef = `kyc_addr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const base64String = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(params.file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

    // Get auth token
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;

    console.log('📤 Submitting address verification:', {
      reference: addressRef,
      documentType: params.selected_document_type,
      fullAddress: params.full_address,
      firstName: params.first_name,
      lastName: params.last_name
    });

    const response = await axios.post("/api/kyc/address", {
      reference: addressRef,
      address: {
        proof: base64String,
        supported_types: params.selected_document_type
          ? [params.selected_document_type]
          : ["utility_bill", "bank_statement", "rent_agreement"],
        full_address: params.full_address,
        name: {
          first_name: params.first_name,
          last_name: params.last_name,
          fuzzy_match: "1",
        },
        fuzzy_match: "1"
      },
    }, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      }
    });

    const data: AddressKYCResponse = response.data;
    data.reference = addressRef;

    console.log('✅ Address verification response:', {
      reference: addressRef,
      event: data.event,
      status: data.verification_result?.address?.status
    });

    return data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Error during address verification:", error);
    // also return error so caller can handle
    return error.response?.data || { error: error.message };
  }
}
