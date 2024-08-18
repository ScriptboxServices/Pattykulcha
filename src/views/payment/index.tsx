"use client"
import { useEffect, useState } from "react"
import OrderHome from "../checkout/orderItem"
import OrderPage from "../checkout/orderPage"
import CheckoutMain from "./payment"
import CircularLodar from "@/components/CircularLodar"
import { useAuthContext, useMenuContext } from "@/context"
import axios from "axios"
import { auth } from "@/firebase"
import { getIdToken } from "firebase/auth"
import { getCartData,calculateGrandTotal } from "@/context"
const PaymentPage = () => {
  const [loading,setLoading] = useState(false)
  const [{ clientSecret, customer, ephemeralKey,payment_id }, setStripeCred] = useState({
    clientSecret: "",
    customer: "",
    ephemeralKey: "",
    payment_id : ""
  });

  const {user,isLoggedIn} = useAuthContext()

  const {address,instructions,setCarts,setGrandTotal,setCount} = useMenuContext()

  useEffect(() => {
    const init = async () => {
      try{
        setLoading(true)
        await Promise.allSettled([getPaymentSheet(),getData(user?.uid)])
        setLoading(false)
      }catch(err) {
        console.log(err)
        setLoading(false)
      }
    }
    init()
  }, [user]);

  const getData = async (_id: string) => {
    try {
      if (_id) {
        const result = await getCartData(_id);
        if (result) {
          setGrandTotal(calculateGrandTotal(result || []));
          setCarts([...result] || []);
          setCount(result.length);
        }
        return;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const getPaymentSheet = async () => {
    if (!auth.currentUser && !isLoggedIn) return;
    const token = await getIdToken(user);

    const isValid = clientSecret && customer && ephemeralKey;
    if (isValid) return;

    return axios
      .request({
        method: "POST",
        url: `/api/getPaymentSheet`,
        headers: {
          "x-token": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          address,
          instructions,
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
        <OrderPage setLoading = {setLoading}/>
        <OrderHome setLoading = {setLoading}/>
        <CheckoutMain clientSecret={clientSecret} ephemeralKey= {ephemeralKey} payment_id={payment_id} customer= {customer}  setLoading = {setLoading}/>
    </>
  )
}

export default PaymentPage