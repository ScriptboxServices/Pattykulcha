import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/firebaseAdmin/config";
import { stripe } from "@/stripe/config";

const db = admin.firestore();

const calculateGrandTotal = (_cart) => {
  let total_tax = 0;
  let sub_total = 0;
  const grandTotal = _cart?.reduce((acc, item) => {
    const { order } = item;
    const { kulcha, additional } = order;

    const total = additional?.reduce((acc, value) => {
      return (acc =
        acc +
        Number(value?.items?.[0]?.price) * Number(value?.items?.[0]?.quantity));
    }, Number(kulcha?.price));

    let tax = Number(total) * 0.13;
    total_tax = total_tax + tax;
    sub_total = sub_total + total;

    return (acc = acc + (Number(total) + Number(tax)));
  }, 0);

  return { grand_total: Number(grandTotal).toFixed(2), total_tax, sub_total };
};

export const POST = async (req, res) => {
  const { order_id } = await req.json();
  try {
    const xToken = req.headers.get("x-token").split(" ")[1];
    console.log(order_id);
    if (!xToken)
      return NextResponse.json(
        {
          code: 0,
          message: "Unauthorized User",
        },
        {
          status: 401,
        }
    );

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
