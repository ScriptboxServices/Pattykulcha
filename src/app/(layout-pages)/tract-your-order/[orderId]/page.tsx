import TrackOrder from '@/views/track-your-order/TrackOrder'
import React from 'react'

const TrackYourOrder = ({params} : {params : any}) => {

  const {orderId} = params
  console.log(orderId);
  return (
    <TrackOrder orderId = {orderId}/>
  )
}

export default TrackYourOrder