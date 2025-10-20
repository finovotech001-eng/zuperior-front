import axios from 'axios';

interface getLifetimeDepositParams {
  email: string;
  accessToken: string;
}

interface ParsedLifetimeDepositResponse {
  status: string;
  status_code: string;
  data: {
    total_deposited_usd: number;
  };
}

export async function getLifetimeDeposit(
  params: getLifetimeDepositParams
): Promise<number> {
  try {
    const response = await axios.post('/api/financial-data', {
      email: params.email,
      accessToken: params.accessToken,
    });

    const rawValue = response.data?.data?.total_deposited_usd;

    const numericResponse: ParsedLifetimeDepositResponse = {
      ...response.data,
      data: {
        ...response.data.data,
        total_deposited_usd: rawValue !== null && rawValue !== undefined 
          ? parseFloat(rawValue) 
          : 0, // if null or undefined, default to 0
      },
    };

    return numericResponse.data.total_deposited_usd;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("API error:", error.response?.data || error.message);
      throw new Error("Failed to fetch lifetime deposit data.");
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
}


/* export async function updateLifetimeDeposit(email: string | undefined, amount: number) {
  if (!email) throw new Error("Email is required");

// Step 1: get current lifetime_deposit
const currentDeposit = await getLifetimeDeposit(email);
const updatedDeposit = currentDeposit + amount;

// Step 2: update lifetime_deposit
const { error: updateError } = await supabase
  .from("user_kyc")
  .update({ lifetime_deposit: updatedDeposit })
  .eq("email", email);

if (updateError) throw updateError;

return updatedDeposit;
}
 */