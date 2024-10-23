"use client";

import React, { useState, useEffect } from "react";
import OrderHome from "./orderItem";
import OrderPage from "./orderPage";
import CircularLodar from "@/components/CircularLodar";
import { useAuthContext, useMenuContext } from "@/context";
import { getCartData, calculateGrandTotal } from "@/context";
const Checkout = () => {
  const { user } = useAuthContext();
  const { setGrandTotal, setCarts, setCount, carts,setTotalTax } = useMenuContext();
  const time = new Date(new Date().setHours(new Date().getHours() + 1));
  const minutes = time.getMinutes();
  const hours = time.getHours();
  const [pickupTime, setPickupTime] = useState(
    `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`
  );
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [loading, setLoading] = useState(false);
  const getData = async (_id: string) => {
    try {
      if (_id) {
        const result = await getCartData(_id);
        if (result) {
          const {total,tax} = calculateGrandTotal(result || [])
          setGrandTotal(total);
          setTotalTax(tax)
          setCarts([...result]);
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
      try {
        setLoading(true);
        await getData(user?.uid);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    init();
  }, [user]);

  return (
    <>
      <CircularLodar isLoading={loading} />
      {carts?.length != 0 && (
        <OrderPage
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          setLoading={setLoading}
          setPickupTime={setPickupTime}
          pickupTime={pickupTime}
        />
      )}
      <OrderHome
        setSelectedOption={setSelectedOption}
        selectedOption={selectedOption}
        setLoading={setLoading}
        setPickupTime={setPickupTime}
        pickupTime={pickupTime}
      />
    </>
  );
};

export default Checkout;
