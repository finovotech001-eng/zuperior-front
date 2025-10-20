// // app/api/payments/callback/route.ts
// import { supabase } from '@/lib/supabase';
// import { NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   try {
//     const callbackData = await request.json();

//     // Validate required fields
//     if (!callbackData.orderid || !callbackData.transactionid || !callbackData.tranmt) {
//       return NextResponse.json(
//         { error: 'Missing required fields: orderid, transactionid, tranmt' },
//         { status: 400 }
//       );
//     }

//     // Extract account details from the callback data
//     // You need to ensure these are passed in the callback URL parameters

//     // Insert data into Supabase with account details
//     const { data, error } = await supabase
//       .from('epay_callback')
//       .insert([
//         {
//           orderid: callbackData.orderid,
//           currency: callbackData.currency,
//           transt: callbackData.transt || 'completed',
//           transactionid: callbackData.transactionid,
//           customerid: callbackData.customerid || null,
//           transaction_amount: parseFloat(callbackData.tranmt),
//           cardholdername: callbackData.cardHolderName || null,
//           cardnumber: callbackData.cardNumber || null,
//           created_at: new Date().toISOString(),
//         },
//       ])
//       .select();

//     if (error) {
//       console.error('Supabase insert error:', error);
//       return NextResponse.json(
//         { error: 'Failed to save callback data to database' },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, data: data[0] },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Callback processing error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// app/api/payments/callback/route.ts
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const callbackData = await request.json();

    // Validate required fields
    if (!callbackData.orderid || !callbackData.transactionid || !callbackData.tranmt) {
      return NextResponse.json(
        { error: 'Missing required fields: orderid, transactionid, tranmt' },
        { status: 400 }
      );
    }

    // Find the corresponding order in epay_order table
    const { data: orderData, error: orderError } = await supabase
      .from('epay_order')
      .select('id, order_id')
      .eq('order_id', callbackData.orderid)
      .single();

    let epayOrderId = null;
    if (!orderError && orderData) {
      epayOrderId = orderData.id; // This is the primary key of the epay_order record
    }

    // Insert data into Supabase with account details
    const { data, error } = await supabase
      .from('epay_callback')
      .insert([
        {
          orderid: callbackData.orderid,
          currency: callbackData.currency,
          transt: callbackData.transt || 'completed',
          transactionid: callbackData.transactionid,
          customerid: callbackData.customerid || null,
          transaction_amount: parseFloat(callbackData.tranmt),
          cardholdername: callbackData.cardHolderName || null,
          cardnumber: callbackData.cardNumber || null,
          epay_order_id: epayOrderId, // Add the foreign key reference
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save callback data to database' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: data[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Callback processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}