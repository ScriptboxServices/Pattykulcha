import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/firebaseAdmin/config";
import { stripe } from "@/stripe/config";

const db = admin.firestore();

export const POST = async (req, res) => {
  const { order_id } = await req.json();
  try {
    const xToken = req.headers.get("x-token").split(" ")[1];
    const decodeToken = await admin.auth().verifyIdToken(xToken);

    if (!decodeToken)
        return NextResponse.json(
          {
            code: 0,
            message: "Unauthorized User",
          },
          {
            status: 401,
          }
      );

    const orderResult = await db.collection("orders").doc(order_id).get();

    if (!orderResult.exists) {
      return NextResponse.json({
        code: 0,
        message: "No Order Found.",
      });
    }

    let orderDetails = orderResult.data();

    const metadata = {
      uid: orderDetails.userId,
      customer: JSON.stringify(orderDetails.customer),
      total_amount: orderDetails.grand_total,
      address: JSON.stringify(orderDetails.address),
      instructions: orderDetails.instructions,
    };

    const refund = await stripe.refunds.create({
      payment_intent: orderDetails.transactionId,
      metadata,
      // amount: 0,
    //   reason: "Order canceled",
    });

    console.log(refund);

    return NextResponse.json({
      code: 1,
      message: "Payment Refunded Successfully",
      refund,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      code: 0,
      message: "Internal Server Error",
    });
  }
};
