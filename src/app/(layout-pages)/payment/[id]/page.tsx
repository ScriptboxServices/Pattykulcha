import PaymentPage from "@/views/payment"
import { decrypt } from '@/utils/commonFunctions';

export const metadata={
  title:"Pattykulcha - Payment Page",
}

const PaymentRoute = ({params} : {params : any}) => {
  const { id } = params
  const {tip} = decrypt(decodeURIComponent(id))
  return (
    <>
        <PaymentPage tip={tip}/>
    </>
  )
}

export default PaymentRoute