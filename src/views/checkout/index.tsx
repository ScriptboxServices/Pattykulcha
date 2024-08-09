"use client"

import React from "react";
import AddCouponComponent from "./oderSummary";
import OrderHome from "./orderItem";
import OrderPage from "./orderPage";
import RecommendationSlider from "./recommendation";

const Checkout = () => {
  return (
    <>
      <OrderPage />
      <OrderHome />
      <RecommendationSlider />
      <AddCouponComponent />
    </>
  );
};

export default Checkout;
