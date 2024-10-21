import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/firebaseAdmin/config";
import { stripe } from "@/stripe/config"

const db = admin.firestore();

const calculateGrandTotal = (_cart) => {
  let total_tax = 0;
  let sub_total = 0;
  const grandTotal = _cart?.reduce((acc, item) => {
    const { order } = item;
    const { kulcha, additional } = order;

    const total = additional?.reduce((acc, value) => {
      return (acc = acc + (Number(value?.items?.[0]?.price) * Number(value?.items?.[0]?.quantity)));
    }, Number(kulcha?.price) * Number(kulcha?.quantity));

    let tax = Number(total) * 0.13;
    total_tax = total_tax + tax;
    sub_total = sub_total + total

    return (acc = acc + (Number(total) + Number(tax)));
  }, 0);

  return { grand_total: Number(grandTotal).toFixed(2), total_tax,sub_total };
};

export const POST = async (req, res) => {
  const { address, instructions, name, tip, selectedOption, pickupTime,kitchenId } = await req.json();
  try {
    const xToken = req.headers.get("x-token").split(" ")[1];
    const decodeToken = await admin.auth().verifyIdToken(xToken);

    if (!decodeToken)
      return NextResponse.json({
        code: 0,
        message: "Unauthorized User",
      },{
        status : 401
    });

    
    const { uid, phone_number } = decodeToken;
    const { city, state, line1, postal_code } = address.seperate;
    const delivery_charges = selectedOption === 'pickup' ? 0 : address?.distance?.value > 3000 ? ((address?.distance?.value / 1000 ) * 0.90) > 8 ? 8 : ((address?.distance?.value / 1000 ) * 0.90) : 3.99
    
    const cartResult = await db
      .collection("carts")
      .where("userId", "==", uid)
      .get();
    let cart = [];
    if (cartResult.empty) {
      return NextResponse.json({
        code: 0,
        message: "No item found.",
      });
    }
    
    let description = ''
  
    cartResult.forEach((doc,index) => {
      cart.push({_id : doc.id,...doc.data()});
    });

    for(let i = 0 ; i < cart.length ; i++){
      description += cart[i].order.kulcha.name;
        
      if (i < cart.length - 1) {
        description += ' | ';
      }
    }

    const {grand_total,total_tax ,sub_total} = calculateGrandTotal(cart);

    let customer;

    const metadata = {
      uid: uid,
      order: JSON.stringify([...cart.map(item => ({_id : item._id,userId : item.userId}))]),
      grand_total,
      total_tax,
      basic_amount: sub_total,
      instructions,
      address: JSON.stringify(address),
      name : name ? name : `Customer_${uid}`,
      phoneNumber : phone_number,
      delivery_charges,
      tip,
      pickupTime : JSON.stringify(pickupTime),
      selectedOption,
      kitchenId 
    };

    const _address = {
      city,
      state,
      postal_code,
      line1,
    };
    const list = await stripe.customers.search({
      query: `metadata[\'uid\']:\'${uid}\'`,
    });

    if (list.data.length) {
      customer = list.data[0];
    } else {
      customer = await stripe.customers.create({
        phone: phone_number,
        shipping: {
          phone: phone_number,
          address: _address,
          name: name ? `${name}` : `Customer_${uid}`,
        },
        address: _address,
        name: name ? `${name}` : `Customer_${uid}`,
      });
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-06-20" }
    );

    const totalAmount = Number(grand_total) + Number(delivery_charges) + Number(tip)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((totalAmount) * 100),
      description,
      currency: "cad",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true
      },
      metadata,
      shipping: {
        phone: phone_number,
        address: _address,
        name: name ? `${name}` : `Customer_${uid}`,
      },
    });

    return NextResponse.json({
      code: 1,
      message: "Payment Intents initiated Successfully",
      data: {
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        payment_id : paymentIntent.id
      },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      code: 0,
      message: "Internal Server Error",
    },{
      status: 500
    });
  }
};
