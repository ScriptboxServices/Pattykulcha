"use client"
import { useEffect, useState,useRef } from "react"
import OrderHome from "../checkout/orderItem"
import OrderPage from "../checkout/orderPage"
import CheckoutMain from "./payment"
import CircularLodar from "@/components/CircularLodar"
import { getUserMetaData, useAuthContext, useMenuContext } from "@/context"
import axios from "axios"
import { auth } from "@/firebase"
import { getIdToken } from "firebase/auth"
import { Timestamp } from "firebase/firestore"

interface Props {
  tip : string,
  pickupTime : string,
  selectedOption : string,
  kitchen : any
}

const PaymentPage : React.FC <Props>= ({tip,selectedOption,pickupTime,kitchen}) => {
  const [loading,setLoading] = useState(false)
  const [{ clientSecret, customer, ephemeralKey,payment_id }, setStripeCred] = useState({
    clientSecret: "",
    customer: "",
    ephemeralKey: "",
    payment_id : ""
  });

  const {user,isLoggedIn,metaData} = useAuthContext()

  const {instructions} = useMenuContext()
  const paymentInitialize = useRef(true)

  useEffect(() => {
    const init = async () => {
      try{
        setLoading(true)
        if(user && metaData){
          if(!paymentInitialize.current) return
          paymentInitialize.current = false 
          await Promise.allSettled([getPaymentSheet(metaData)])
        } 
        setLoading(false)
      }catch(err) {
        console.log(err)
        setLoading(false)
      }
    }
    init()
  }, [user,metaData]);

  function convertToFirebaseTimestamp(timeStr : string) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return Timestamp.fromDate(now);
}

  const getPaymentSheet = async (metaData : any) => {

    if (!auth.currentUser && !isLoggedIn && !metaData) return;

    const token = await getIdToken(user);

    const isValid = clientSecret && customer && ephemeralKey;
    if (isValid) return;

    const pickupTime_ = convertToFirebaseTimestamp(pickupTime)

    return axios
      .request({
        method: "POST",
        url: `/api/getPaymentSheet`,
        headers: {
          "x-token": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          address : selectedOption === 'pickup'? kitchen?.address : metaData?.address,
          instructions,
          name : metaData?.name,
          tip,
          selectedOption,
          pickupTime : pickupTime_,
          kitchenId : kitchen.id
        },
      })
      .then((response : any) => response.data)
      .catch((error :any) => {
        console.log(error);
        return undefined;
      })
      .then((result :any) => {
        if (result.code != 1) return console.log(result.message);
        const { paymentIntent, ephemeralKey, customer, payment_id } = result.data;
        setStripeCred({ clientSecret: paymentIntent, customer, ephemeralKey, payment_id });
      });
  };

  return (
    <>
        <CircularLodar isLoading={loading} />
        {/* <OrderPage setLoading = {setLoading}/>
        <OrderHome setLoading = {setLoading}/> */}
        <CheckoutMain clientSecret={clientSecret} ephemeralKey= {ephemeralKey} payment_id={payment_id} customer= {customer}  setLoading = {setLoading} tip={tip} selectedOption={selectedOption}/>
    </>
  )
}

export default PaymentPage