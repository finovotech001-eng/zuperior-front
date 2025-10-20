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
    const amlRef = `aml_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    //const countries = [params.country].filter(Boolean); change name to ISOCountry code

    const response = await axios.post("/api/kyc/aml", {
      reference: amlRef,
      background_checks: {
        name: { full_name: params.full_name },
        filters: params.filters,
        //countries,
        dob: params.dob,
      },
    });
    const data: AMLResponse = await response.data;
    data.reference = amlRef;

    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error during document verification:", error);
    // also return error so caller can handle
    return error.response?.data || { error: error.message };
  }
}
