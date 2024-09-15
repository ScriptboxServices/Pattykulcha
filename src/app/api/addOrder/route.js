import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/firebaseAdmin/config";
import { v4 } from "uuid";

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
    }, Number(kulcha?.price) * Number(kulcha?.quantity));

    let tax = Number(total) * 0.13;
    total_tax = total_tax + tax;
    sub_total = sub_total + total;

    return (acc = acc + (Number(total) + Number(tax)));
  }, 0);

  return { grand_total: Number(grandTotal).toFixed(2), total_tax, sub_total };
};

export const POST = async (req, res) => {
  const {
    withKulcha,
    includedItems1,
    includedItems2,
    name,
    phoneNumber,
    address,
    instructions,
    countryCode,
    createdAt,
    paymentmethod
  } = await req.json();

  const kitchenId = "0bXJJJIHMgu5MNGSArY2";

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
    let userId = ''
    const user = await db.collection('users').where('phoneNumber','==',`+${countryCode.phone}${phoneNumber}`).get()
    if(user.empty){
        const createUserRef = db.collection('users').doc()
        await createUserRef.set({
            phoneNumber: phoneNumber,
            profile: "",
            email: "",
            name: name,
            address: address,
            role: "customer",
            isKitchen: false,
            foodTruckId: "",
            enable: true,
        })
        userId = createUserRef.id
    }else{
        user.forEach(user => {
            userId = user.id
        })
    }

    let makeCart = [];
    let cart = [];
    let order = [];

    includedItems1.forEach((data, index) => {
      let total = 0;
      if (index === 0) {
        total = Number(data.price) * Number(data.quantity);
        if (includedItems2.length !== 0) {
          total = includedItems2?.reduce((acc, value) => {
            return (acc =
              acc +
              Number(value?.items?.[0]?.price) *
                Number(value?.items?.[0]?.quantity));
          }, Number(total));
        }
      } else {
        total = Number(data.price) * Number(data.quantity);
      }
      makeCart.push({
        _id: v4(),
        userId: "",
        customer: {
          name: name,
          phoneNumber: phoneNumber,
          address: address,
        },
        order: {
          kulcha: data,
          withKulcha: [...withKulcha],
          additional: index === 0 ? [...includedItems2] : [],
        },
        total_amount: (Number(total) + Number(total) * 0.13).toFixed(2),
        createdAt: createdAt,
      });
    });

    let description = "";

    makeCart.forEach((doc) => {
      cart.push({ ...doc });
    });

    for (let i = 0; i < cart.length; i++) {
      description += cart[i].order.kulcha.name;
      if (i < cart.length - 1) {
        description += " | ";
      }
    }

    const { grand_total, total_tax, sub_total } = calculateGrandTotal(cart);

    cart.forEach((doc) => {
      order.push({ ...doc });
    });

    const orderDocRef = db.collection("orders").doc();
    const paymentDocRef = db.collection("payments").doc();
    const id = `cash_${v4()}`;
     
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

    const today = new Date();
    const startOfToday = admin.firestore.Timestamp.fromDate(new Date(today.setHours(0, 0, 0, 0)));
    const endOfToday = admin.firestore.Timestamp.fromDate(
      new Date(today.setHours(23, 59, 59, 999))
    );
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
        address: address,
        grand_total: grand_total,
        instructions: instructions,
        basic_amount: sub_total,
        order: order,
        userId: userId,
        total_tax: total_tax,
        paymentId: paymentDocRef.id,
        delivery: {
          message: "Preparing",
          status: false,
        },
        transactionId: id,
        canceled: false,
        refunded: false,
        customer: {
          _id: `cus_${userId}`,
          name: name,
          phoneNumber: phoneNumber,
        },
        orderNumber : {
          forKitchen : orderNumberForKitchen,
          forCustomer : orderNumberForCustomer
        },
        kitchenId: kitchenId,
        driverId: '',
        deliverCharge : 0,
        source: "Shop",
        paymentMode: paymentmethod,
        invoices :{
          key:'',
          generated: false
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
      paymentDocRef.set({
        address: address,
        grand_total: grand_total,
        total_tax: total_tax,
        instructions: instructions,
        orderId: orderDocRef.id,
        userId: userId,
        transactionId: id,
        deliverCharge : 0,
        driverId: '',
        card: {
          brand: "",
          last4: "",
          exp_month: "",
          exp_year: "",
        },
        customer: {
          _id: `cus_${userId}`,
          name: name,
          phoneNumber: phoneNumber,
        },
        orderNumber : {
          forKitchen : orderNumberForKitchen,
          forCustomer : orderNumberForCustomer
        },
        paymentMode: paymentmethod,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      }),
    ]);

    return NextResponse.json({
      code: 1,
      message: "Order placed Successfully",
    },{
        status: 200
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      code: 0,
      message: "Internal Server Error",
    }, {
        status: 500,
      });
  }
};
