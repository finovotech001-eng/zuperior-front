// // app/api/epay/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";
// import { randomUUID } from "crypto";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const {
//       countrycode,
//       mobilenumber,
//       orderAmount,
//       user_name,
//       orderCurrency,
//     } = body;

//     // ✅ Generate alphanumeric-only orderID
//     const orderID = "ORD" + Date.now() + randomUUID().replace(/-/g, "").slice(0, 8);
//     const customerId = "CUS" + Date.now() + randomUUID().replace(/-/g, "").slice(0, 8);

//     const payload = {
//       channelId : "WEB",
//       customerId,
//       merchantId :process.env.EPAY_SERVICES_MERCHANT_ID,
//       merchantType :"ECOMMERCE",
//       orderID,
//       email : process.env.EPAY_SERVICES_EMAIL,
//       countrycode,
//       mobilenumber,
//       orderDescription: "Adding Funds to Zuperior Account",
//       orderAmount,
//       user_name,
//       orderCurrency,
//       success_url: process.env.EPAY_SERVICES_SUCCESS_URL,
//       failure_url: process.env.EPAY_SERVICES_FAILED_URL,
//       callback_url: process.env.EPAY_SERVICES_CALLBACK_URL,
//     };

//     const response = await axios.post(
//       "https://api.paymentservice.me/v1/stage/create-new-order",
//       payload,
//       { headers: { "Content-Type": "application/json" } }
//     );

//     return NextResponse.json(response.data, { status: 200 });
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.error("EPAY Create Order Error:", error.response?.data || error.message);
//     return NextResponse.json(
//       { error: error.response?.data || "Failed to create order" },
//       { status: error.response?.status || 500 }
//     );
//   }
// }


// app/api/epay/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { randomUUID } from "crypto";
import { supabase } from '@/lib/supabase'; // Add this import

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      countrycode,
      mobilenumber,
      orderAmount,
      user_name,
      success_url,
      failure_url,
      account_number, // Add account details
      account_type,   // Add account details
    } = body;

    // ✅ Generate alphanumeric-only orderID
    const orderID = "ORD" + Date.now() + randomUUID().replace(/-/g, "").slice(0, 8);
    const customerId = "CUS" + Date.now() + randomUUID().replace(/-/g, "").slice(0, 8);

    const payload = {
      channelId: "WEB",
      customerId,
      merchantId: process.env.EPAY_SERVICES_MERCHANT_ID,
      merchantType: "ECOMMERCE",
      orderID,
      email: process.env.EPAY_SERVICES_EMAIL,
      countrycode,
      mobilenumber,
      orderDescription: "Adding Funds to Zuperior Account",
      orderAmount,
      user_name,
      orderCurrency : "USD",
      success_url,
      failure_url,
      callback_url: process.env.EPAY_SERVICES_CALLBACK_URL,
    };

    const response = await axios.post(
      "https://api.paymentservice.me/v1/auth/create-new-order",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    // Store the order in Supabase with the generated orderID
    const { error: orderError } = await supabase
      .from('epay_order')
      .insert([
        {
          order_id: orderID, // Store the generated order ID
          currency: "USD",
          account_number: account_number,
          account_type: account_type,
          amount: parseFloat(orderAmount),
          status: 'initiated',
          redirect_url: response.data.redirectUrl || '',
        },
      ])
      .select();

    if (orderError) {
      console.error('Supabase order insert error:', orderError);
    }

    return NextResponse.json({
      ...response.data,
      orderId: orderID, // Return the order ID to the client
    }, { status: 200 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("EPAY Create Order Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Failed to create order" },
      { status: error.response?.status || 500 }
    );
  }
}