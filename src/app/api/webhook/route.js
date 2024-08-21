import { stripe } from "@/stripe/config";
import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/firebaseAdmin/config";
const db = admin.firestore();

export const POST = async (req, res) => {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  let event = "";
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SK
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        code: 0,
        message: "Unauthorized Request.",
      },
      {
        status: 400,
      }
    );
  }
  try {
    if (event.type === "payment_intent.succeeded") {
      const data = event.data.object;
      const { id, metadata, latest_charge, customer } = data;

      const batch = db.batch()
      const cartResult = await db
        .collection("carts")
        .where("userId", "==", metadata.uid)
        .get();
      let cart = [];
      if (!cartResult.empty) {
        cartResult.forEach((doc) => {
          cart.push({ _id: doc.id, ...doc.data()});
        });
      }

      const orderDocRef = db.collection("orders").doc();
      const paymentDocRef = db.collection("payments").doc();
      const charge = await stripe.charges.retrieve(latest_charge);
      const cardDetails = charge.payment_method_details.card;
      const { brand, last4, exp_month, exp_year } = cardDetails;

      await Promise.all([
        orderDocRef.set({
            address: metadata.address,
            grand_total: metadata.grand_total,
            instructions: metadata.instructions,
            basic_amount: metadata.basic_amount,
            order: cart,
            userId: metadata.uid,
            total_tax: metadata.total_tax,
            paymentId: paymentDocRef.id,
            delivery : {
              message : 'New Order',
              status : false
            },
            canceled : false,
            customer:{
              _id : customer,
              name : metadata.name
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          }),
          paymentDocRef.set({
            address: metadata.address,
            grand_total: metadata.grand_total,
            total_tax: metadata.total_tax,
            instructions: metadata.instructions,
            orderId: orderDocRef.id,
            userId: metadata.uid,
            transactionId : id,
            card:{
                brand, last4, exp_month, exp_year
            },
            customer:{
              _id : customer,
              name : metadata.name
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          })
      ])

      const deleteCartItem = JSON.parse(metadata.order)

      for(let i = 0;i < deleteCartItem.length ; i++){
        const docRef = db.collection('carts').doc(deleteCartItem[i]._id);
        batch.delete(docRef);
      }

      await batch.commit();

      return NextResponse.json(   {
        code: 1,
        message: "Payment Done Successfully",
      },
      {
        status: 200,
      });
    } else if (event.type === "charge.succeeded") {
      return NextResponse.json(
        {
          code: 1,
          message: "Charge Succeed",
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          code: 1,
          message: "Ok",
        },
        {
          status: 200,
        }
      );
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        code: 0,
        message: "Webhook Error",
      },
      {
        status: 400,
      }
    );
  }
};
