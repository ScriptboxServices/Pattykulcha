import OrdersPage from '@/views/checkout/orderconformation'
import React from 'react'
import { decrypt } from '@/utils/commonFunctions';
const OrderConformation = ({params} : {params : any}) => {

  const { data } = params

  const res = decrypt(decodeURIComponent(data))

  return (
    <>
        <OrdersPage data= {res}/>
    </>
  )
}

export default OrderConformation
