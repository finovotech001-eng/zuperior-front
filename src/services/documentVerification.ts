import { DocumentKYCResponse } from "@/types/kyc";
import axios from "axios";

// type YYYYMMDD = `${number}-${number}-${number}`;

interface DocumentVerificationParams {
  firstName: string;
  lastName: string;
  documentType: string;
  file: File;
  // dob?: YYYYMMDD; // for future
}

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export async function documentVerification(params: DocumentVerificationParams) {
  try {
    const base64String = await fileToBase64(params.file);

    const kycRef = `kyc_doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Get auth token
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;

    console.log('📤 Submitting document verification:', {
      reference: kycRef,
      documentType: params.documentType,
      firstName: params.firstName,
      lastName: params.lastName
    });

    const response = await axios.post("/api/kyc/document", {
      reference: kycRef,
      document: {
        proof: base64String,
        supported_types: [params.documentType],
        name: {
          first_name: params.firstName,
          last_name: params.lastName,
          fuzzy_match: "1",
        },
        // dob: params.dob,
      },
    }, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      }
    });

    const data: DocumentKYCResponse = response.data;
    data.reference = kycRef;

    console.log('✅ Document verification response:', {
      reference: kycRef,
      event: data.event,
      status: data.verification_result?.document?.status
    });

    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Error during document verification:", error);
    // also return error so caller can handle
    return error.response?.data || { error: error.message };
  }
}
