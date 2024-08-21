import { useAuthContext } from "@/context";
import { db } from "@/firebase";
import {
  Timestamp,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    TextField,
    Avatar,
    Divider,
    Chip,
    IconButton,
  } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Visibility } from "@mui/icons-material";


const NewOrders: React.FC = () => {
  const { user } = useAuthContext();
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const today = new Date();
  const startOfToday = Timestamp.fromDate(new Date(today.setHours(0, 0, 0, 0)));
  const endOfToday = Timestamp.fromDate(
    new Date(today.setHours(23, 59, 59, 999))
  );
  useEffect(() => {
    const colRef = collection(db, "orders");
    const q = query(
      colRef,
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let newOrders: any[] = [];
      snapshot.forEach((doc) => {
        const { delivery } = doc.data()
        if(delivery.status === false && delivery.message === 'New Order'){
            newOrders.push({
              id: doc.id,
              ...doc.data(),
            });
        }
      });
      setNewOrders([...newOrders]);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  console.log(newOrders);

  return(
    <Grid container spacing={3}>
  {newOrders?.map((order, index) => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      key={index}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Card
        sx={{
          width: 380,
          minHeight: 280,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <CardContent sx={{ padding: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                Order #{order.id.slice(0,3)}...
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {order.date}
              </Typography>
            </Box>
            {/* View More Details Icon */}
            <IconButton size="small">
              <Visibility />
            </IconButton>
          </Box>

          {order?.order?.map((item : any, idx : number) => {
            let { additional } = item?.order
            let addOnName = ''
            for(let i = 0 ; i < additional.length ; i++){
                addOnName += additional[i].items[0].name;
                  
                if (i < additional.length - 1) {
                  addOnName += ' | ';
                }
            }
            return(
            <Box
              key={idx}
              sx={{ display: "flex", alignItems: "center", mt: 2 }}
            >
              <Avatar
                src={item?.order?.kulcha?.image}
                sx={{ width: 50, height: 50, mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1">{item?.order?.kulcha?.name}</Typography>
                {
                    additional?.length !== 0 && 
                    <Typography variant="body2" color="textSecondary">
                        Add-ons : {addOnName}
                    </Typography>
                }
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" color="textSecondary" sx={{display:'flex'}}>
                  Qty: {item?.order?.kulcha?.quantity}
                </Typography>
              </Box>
            </Box>
            )
          }
          )}
        </CardContent>
        <Box>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              px: 2,
              pb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Total Tax 
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ${Number(order?.total_tax).toFixed(2)}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box
            sx={{
              px: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              Total 
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ${Number(order?.grand_total).toFixed(2)}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              px: 2,
              pb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="textSecondary">
              X{order?.order?.length} Items
            </Typography>
            <Chip
              label={order.delivery.message}
              color={order.delivery.status ? "success" : "warning"}
              sx={{ borderRadius: "50px", textTransform: "none" }}
            />
          </Box>
        </Box>
      </Card>
    </Grid>
  ))}
    </Grid>
  )
};

export default NewOrders;
