import PaymentPage from "@/views/payment"
import { decrypt } from '@/utils/commonFunctions';

export const metadata={
  title:"Pattykulcha - Payment Page",
}

const PaymentRoute = ({params} : {params : any}) => {
  const { id } = params
  const { tip ,selectedOption ,pickupTime,kitchen } = decrypt(decodeURIComponent(id))
  return (
    <>
        <PaymentPage tip={tip} pickupTime={pickupTime} selectedOption={selectedOption} kitchen={kitchen}/>
    </>
  )
}

export default PaymentRoute