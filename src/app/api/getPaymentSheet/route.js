import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51PmHOUIxcOjAC9k03p5KLXl2FDHSQX2WkgxattA7F6kOsmIFJSOW1OpP8lbSbzf0AXHgYs9csVPAE0vexZQ3NVQT00N947oLd9"
);

export const POST = async (req , res) => {
  const { id, order, total_amount, tax_amount, sub_total, phoneNumber } =
    await req.json();

  try {
    let customer;
    const metadata = {
      uid: id,
      order: JSON.stringify(order),
      total_amount,
      tax_amount,
      basic_amount: sub_total,
    };
    const list = await stripe.customers.search({
      query: `metadata[\'uid\']:\'${id}\'`,
    });

    if (list.data.length) {
      customer = list.data[0];
    } else {
      customer = await stripe.customers.create({
        phone: phoneNumber,
        shipping: {
          phone: phoneNumber,
        },
        metadata,
      });
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-10-16" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total_amount),
      description: "Abhishek Poddar",
      currency: "cad",
      customer: customer.id,
      metadata,
      shipping: {
        phone: phoneNumber,
      },
    });

    return NextResponse.json({
      code: 1,
      message: "Payment Intents initiated Successfully",
      data: {
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
      },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      code: 0,
      message: "Server Error",
    });
  }
};
