import OrderHome from "../checkout/orderItem"
import OrderPage from "../checkout/orderPage"
import CheckoutMain from "./payment"

const PaymentPage = () => {
  return (
    <>
        <OrderPage/>
        <OrderHome/>
        <CheckoutMain/>
    </>
  )
}

export default PaymentPage