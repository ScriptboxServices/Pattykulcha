"use client"

import React, { useState,useEffect } from "react";
import AddCouponComponent from "./oderSummary";
import OrderHome from "./orderItem";
import OrderPage from "./orderPage";
import RecommendationSlider from "./recommendation";
import CircularLodar from "@/components/CircularLodar";
import { useAuthContext, useMenuContext } from "@/context";
import { getCartData,calculateGrandTotal } from "@/context";
const Checkout = () => {

  const {user} = useAuthContext()
  const {setGrandTotal,setCarts,setCount} = useMenuContext()

  const [loading,setLoading] = useState(false)
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


  useEffect(() => {
    const init = async () => {
      try{
        setLoading(true)
        await getData(user?.uid)
        setLoading(false)
      }catch(err) {
        console.log(err)
        setLoading(false)
      }
    }
    init()
  }, [user]);


  return (
    <>
      <CircularLodar isLoading={loading}/>
      <OrderPage  setLoading = {setLoading}/>
      <OrderHome  setLoading = {setLoading}/>
      {/* <RecommendationSlider /> */}
      {/* <AddCouponComponent /> */}
    </>
  );
};

export default Checkout;
