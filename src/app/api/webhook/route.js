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
        status: 401,
      }
    );
  }
  try {
    if (event.type === "payment_intent.succeeded") {
      const data = event.data.object;
      const { id, metadata, latest_charge, customer } = data;
      const kitchenId = '0bXJJJIHMgu5MNGSArY2'

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
      
      let orderNumberForKitchen;
      let orderNumberForCustomer;
      let kitchenData;
      let latestOrder;
      
      const kitchenDoc = await db.collection('foodtrucks').doc(kitchenId).get()
      if(kitchenDoc.exists){
        kitchenData = kitchenDoc.data();
        orderNumberForCustomer = `${kitchenData.truckIdentifier}-${Math.floor(Math.random() * 900000)}`
      }else{
        orderNumberForCustomer = `${Math.floor(Math.random() * 900000)}`
      }

      // const now = new Date();
      // const estOffset = now.getTimezoneOffset() - 300;
      // const startOfToday = new Date(now.setHours(0 - estOffset / 60, 0, 0, 0));
      // const endOfToday = new Date(now.setHours(23 - estOffset / 60, 59, 59, 999));
      const startOfToday = admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)));
      const endOfToday = admin.firestore.Timestamp.fromDate(new Date(new Date().setHours(23, 59, 59, 999)));

      const latestOrderInKitchen = await db.collection('orders')
      .where('kitchenId', '==', kitchenId)
      .where('createdAt', '>=', startOfToday)
      .where('createdAt', '<=', endOfToday)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

      if (!latestOrderInKitchen.empty) {
          latestOrder = latestOrderInKitchen.docs[0].data();
          if(latestOrder.orderNumber){
            orderNumberForKitchen = Number(latestOrder.orderNumber.forKitchen) + 1
          }else{
            orderNumberForKitchen = 1
          }
      }else{
        orderNumberForKitchen = 1
      }
      
      await Promise.all([
        orderDocRef.set({
            address: JSON.parse(metadata.address),
            grand_total: metadata.grand_total,
            instructions: metadata.instructions,
            basic_amount: metadata.basic_amount,
            order: cart,
            userId: metadata.uid,
            total_tax: metadata.total_tax,
            paymentId: paymentDocRef.id,
            delivery : {
              message : 'Preparing',
              status : false
            },
            transactionId : id,
            canceled : false,
            refunded : false,
            customer:{
              _id : customer,
              name : metadata.name,
              phoneNumber : metadata.phoneNumber
            },
            kitchenId: kitchenId,
            deliverCharge : metadata.delivery_charges,
            tip : metadata.tip,
            driverId: '',
            paymentMode : 'Online',
            source:'Website',
            orderNumber : {
              forKitchen : orderNumberForKitchen,
              forCustomer : orderNumberForCustomer
            },
            invoices :{
              key:'',
              generated: false
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          }),
          paymentDocRef.set({
            address: JSON.parse(metadata.address),
            grand_total: metadata.grand_total,
            total_tax: metadata.total_tax,
            instructions: metadata.instructions,
            orderId: orderDocRef.id,
            userId: metadata.uid,
            transactionId : id,
            driverId: '',
            deliverCharge : metadata.delivery_charges,
            tip : metadata.tip,
            card:{
                brand, last4, exp_month, exp_year
            },
            customer:{
              _id : customer,
              name : metadata.name,
              phoneNumber : metadata.phoneNumber
            },
            paymentMode : 'Online',
            orderNumber : {
              forKitchen : orderNumberForKitchen,
              forCustomer : orderNumberForCustomer
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
