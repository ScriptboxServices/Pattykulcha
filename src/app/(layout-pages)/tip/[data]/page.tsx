import TipPage from "@/views/checkout/tip"
import { decrypt } from '@/utils/commonFunctions';

const Tip = ({params} : {params : any}) => {
  const { data } = params
  const {selectedOption,pickupTime } = decrypt(decodeURIComponent(data))
  return (
    <TipPage selectedOption = {selectedOption} pickupTime={pickupTime}/>
  )
}

export default Tip