import { AMLResponse } from "@/types/kyc";
import axios from "axios";

interface AmlVerificationParams {
  full_name?: string;
  filters: string[];
  country?: string; // country name
  dob?: string;
}

export async function amlVerification(params: AmlVerificationParams) {
  try {
    const amlRef = `kyc_aml_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Get auth token
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;

    console.log('📤 Submitting AML verification:', {
      reference: amlRef,
      fullName: params.full_name,
      filters: params.filters
    });

    const response = await axios.post("/api/kyc/aml", {
      reference: amlRef,
      background_checks: {
        name: { full_name: params.full_name },
        filters: params.filters,
        //countries,
        dob: params.dob,
      },
    }, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      }
    });

    const data: AMLResponse = response.data;
    data.reference = amlRef;

    console.log('✅ AML verification response:', {
      reference: amlRef,
      event: data.event,
      status: data.verification_result?.background_checks?.status
    });

    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Error during AML verification:", error);
    // also return error so caller can handle
    return error.response?.data || { error: error.message };
  }
}
