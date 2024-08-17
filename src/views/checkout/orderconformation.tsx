'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Table, TableBody, Divider ,TableCell, TableContainer, TableRow } from '@mui/material';
import { useAuthContext, useMenuContext } from '@/context'; // Adjust the path as necessary
import { getCartData } from '@/context';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import CircularLodar from '@/components/CircularLodar';
import { formatTimestampToDDMMYYYY } from '@/utils/commonFunctions';
const OrdersPage = ({data} :  {data:any}) => {
  const { setCount } = useMenuContext();
  const [loading,setLoading] = useState(false)
  const name = 'Jane Smith';

  const [orderData,setOrderData] = useState<any>()
  const [payment,setPayment] = useState<any>()

  const {user} = useAuthContext()

  const { payment_id } = data

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try{
        const transactionRef = collection(db,"payments")
        const q = query(transactionRef, where("transactionId", "==", payment_id));
        const querySnapshot = await getDocs(q);
  
        if(querySnapshot.size > 0){
          let transaction : any
          querySnapshot.forEach(doc => {
            transaction = doc.data()
          })
          setPayment(transaction)
          const docRef = doc(db,'orders',transaction?.orderId)
          const docSnap = await getDoc(docRef)
          if(docSnap.exists()){
            setOrderData(docSnap.data())
          } 
        }
        setLoading(false)
        setCount(0);
      }catch(err){
        console.log(err);
        setLoading(false)
      }
    }
    init()
  },[data])

  console.log(user);

  return (
    <>
      <CircularLodar isLoading={loading} />  
      <Box maxWidth='xl' sx={{ backgroundColor: '#FFF5EE', minHeight: '90vh', padding: 2 }}>
        <Paper
          elevation={3}
          sx={{
            maxWidth: '1000px',
            margin: '0 auto',
            mt: 5,
            padding: 4,
            borderRadius: '16px',
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} mt={5}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                Thank you for your order!
              </Typography>
              <Typography variant="body1" paragraph>
                Your order will be delivered shortly.
              </Typography>
              <Typography variant="h6" gutterBottom>
                Billing Address
              </Typography>
              <Typography variant="body1">Name: {name}</Typography>
              <Typography variant="body1">Address: {payment?.address}</Typography>
              <Typography variant="body1">Phone: {user?.phoneNumber}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={1}
                sx={{
                  padding: 4,
                  borderRadius: '16px',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                        <TableRow>
                          <TableCell>{formatTimestampToDDMMYYYY(payment?.createdAt)}</TableCell>
                          <TableCell>{payment?.orderId?.slice(0,3)}....{payment?.orderId?.slice(-4)}</TableCell>
                          <TableCell>{payment?.card?.brand} - XXXX {payment?.card?.last4}</TableCell>
                        </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                {orderData?.order?.length > 0 ? (
                  orderData?.order?.map((item : any, index : number) => {
                    const { order } = item;
                    const { kulcha, additional } = order;
                    return (
                      <Box key={index} sx={{ marginBottom: 3 }}>
                        
                        {kulcha && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 3 }}>
                            <Box
                              component="img"
                              src={kulcha.image}
                              alt={kulcha.name}
                              sx={{ width: 60, height: 60, mr: 2 }}
                            />
                            <Box>
                              <Typography variant="body1">{kulcha.name}</Typography>
                            </Box>
                            <Typography variant="body1" sx={{ ml: 'auto' }}>
                              ${kulcha.price.toFixed(2)}
                            </Typography>
                          </Box>
                        )}
                        {additional &&
                          additional.map((item :any, i : number) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {item.items[0].name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                                +${item.items[0].price.toFixed(2)}
                              </Typography>
                            </Box>
                          ))}
                      </Box>
                    )
                  })
                ) : (
                  <Typography variant="body1">No items in the cart.</Typography>
                )}
                <Divider sx={{ mt: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Typography variant="h6">Total Tax</Typography>
                  <Typography variant="h6">${Number(payment?.total_tax).toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Typography variant="h6">Order Total</Typography>
                  <Typography variant="h6">${payment?.grand_total}</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default OrdersPage;