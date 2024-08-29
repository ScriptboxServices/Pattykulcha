"use client"

import React, { useState,useEffect } from "react";
import OrderHome from "./orderItem";
import OrderPage from "./orderPage";
import CircularLodar from "@/components/CircularLodar";
import { useAuthContext, useMenuContext } from "@/context";
import { getCartData,calculateGrandTotal } from "@/context";
const Checkout = () => {

  const {user} = useAuthContext()
  const {setGrandTotal,setCarts,setCount,carts} = useMenuContext()

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
      {carts?.length != 0 &&
      <OrderPage  setLoading = {setLoading}/>
      }
      <OrderHome  setLoading = {setLoading}/>
   
    </>
  );
};

export default Checkout;
