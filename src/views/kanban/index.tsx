import { useState, useEffect } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
} from "@dnd-kit/core";
import { KITCHEN_ID, useAuthContext } from "@/context";
import { db } from "@/firebase";
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  Box,
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import Select from "@mui/material/Select";
import { Visibility } from "@mui/icons-material";
import OutlinedInput from "@mui/material/OutlinedInput";
import CircularLodar from "@/components/CircularLodar";

const KanbanBoard = () => {
  const [containers] = useState([
    { id: `container-1`, title: "Today's Cart" },
    { id: `container-2`, title: "Today's Order" },
    { id: `container-3`, title: "Out for delivery" },
    { id: `container-4`, title: "Delivered" },
    { id: `container-5`, title: "Cancelled" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const { user } = useAuthContext();
  const [allOrders, setAllOrders] = useState<any>({});
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [deliveredOrder, setDeliveredOrder] = useState<any[]>([]);
  const [outForDelivery, setOutForDelivery] = useState<any[]>([]);
  const [canceledOrders, setCanceledOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const today = new Date();
  const startOfToday = Timestamp.fromDate(new Date(today.setHours(0, 0, 0, 0)));
  const endOfToday = Timestamp.fromDate(
    new Date(today.setHours(23, 59, 59, 999))
  );

  useEffect(() => {
    const colRef = collection(db, "orders");
    const newOrderQuery = query(
      colRef,
      where("kitchenId", "==", KITCHEN_ID),
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday),
      orderBy("createdAt", "desc")
    );
    const unsubscribeNewOrder = onSnapshot(newOrderQuery, (snapshot) => {
      let newOrders: any[] = [];
      snapshot.forEach((doc) => {
        const { delivery } = doc.data();
        if (delivery.status === false && delivery.message === "New Order") {
          newOrders.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });
      setNewOrders([...newOrders]);
    });

    const outForDeliveryQuery = query(
      colRef,
      where("kitchenId", "==", KITCHEN_ID),
      where("delivery.status", "==", false),
      where("delivery.message", "==", 'Out For Delivery'),
      orderBy("createdAt", "desc")
    );
    const unsubscribeOutForDelivery = onSnapshot(
      outForDeliveryQuery,
      (snapshot) => {
        let outForDelivery: any[] = [];
        snapshot.forEach((doc) => {
          const { delivery } = doc.data();
          if (
            delivery.status === false &&
            delivery.message === "Out For Delivery"
          ) {
            outForDelivery.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });
        setOutForDelivery([...outForDelivery]);
      }
    );

    const deliveredOrderQuery = query(
      colRef,
      where("kitchenId", "==", KITCHEN_ID),
      where("delivery.status", "==", true),
      where("delivery.message", "==", 'Delivered'),
      orderBy("createdAt", "desc")
    );
    const unsubscribeDelivered = onSnapshot(deliveredOrderQuery, (snapshot) => {
      let deliveredOrder: any[] = [];
      snapshot.forEach((doc) => {
        const { delivery } = doc.data();
        if (delivery.status === true && delivery.message === "Delivered") {
          deliveredOrder.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });
      setDeliveredOrder([...deliveredOrder]);
    });

    const canceledOrderQuery = query(
      colRef,
      where("kitchenId", "==", KITCHEN_ID),
      where("delivery.status", "==", false),
      where("delivery.message", "==", 'Canceled'),
      where("canceled", "==", true),
      orderBy("createdAt", "desc")
    );
    const unsubscribeCanceled = onSnapshot(canceledOrderQuery, (snapshot) => {
      let canceledOrders: any[] = [];
      snapshot.forEach((doc) => {
        const { delivery,canceled } = doc.data();
        if (delivery.status === false && delivery.message === "Canceled" && canceled) {
          canceledOrders.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });
      setCanceledOrders([...canceledOrders]);
    });

    return () => {
      unsubscribeNewOrder();
      unsubscribeOutForDelivery();
      unsubscribeDelivered();
      unsubscribeCanceled();
    };
  }, [user]);

  useEffect(() => {
    setAllOrders({
      "container-1": [],
      "container-2": [...newOrders],
      "container-3": [...outForDelivery],
      "container-4": [...deliveredOrder],
      "container-5": [...canceledOrders],
    });
  }, [user, newOrders, outForDelivery, deliveredOrder, canceledOrders]);

  console.log(allOrders);

  const updateOrderStatus = async (
    _id: string,
    message: string,
    status: boolean
  ) => {
    try{
      setLoading(true)
      const docRef = doc(db,'orders',_id)
      await updateDoc(docRef,{
        delivery : {
          message,
          status
        }
      })
      setLoading(false)
    }catch(err) {
      console.log(err);
      return err
    }finally{
      setLoading(false)
    }
  };

  const cancelOrderStatus = async (_id : string) => {
    try{
      setLoading(true)
      const docRef = doc(db,'orders',_id)
      await updateDoc(docRef,{
        canceled : true,
        delivery : {
          message : 'Canceled',
          status : false
        }
      })
      setLoading(false)
    }catch(err) {
      console.log(err);
      return err
    }finally{
      setLoading(false)
    }
  }

  return (
    <Box sx={{minHeight:"auto",backgroundColor:"white",overflowY:"auto"}}>
      <CircularLodar isLoading={loading} />
      <Box>
        <Typography
          variant='h5'
          sx={{ fontWeight: "bold", mb: 2, pl: 3, pt: 4.5 }}>
          Order Details
        </Typography>
      </Box>
      <Box
        className=' w-auto p-5 max-h-[1300px] bg-white no-scrollbar'
        sx={{ overflowY: "hidden", overflowX: "auto", ml: 3 }}>
        <DndContext sensors={sensors} collisionDetection={closestCorners}>
          <SortableContext items={containers.map((container) => container.id)}>
            <Box
              display='flex'
              justifyContent='space-evenly'
              gap={2}
              minWidth='1900px'
              marginTop={3}>
              {containers.map((container) => (
                <Box
                  key={container.id}
                  sx={{
                    width: 580,
                    maxHeight: "93vh",
                    overflowY: "auto",
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#fff",
                  }}>
                  <Typography
                    variant='h6'
                    sx={{
                      textAlign: "center",
                      padding: 2,
                      backgroundColor: "#3f51b5",
                      color: "#fff",
                    }}>
                    {container.title}
                  </Typography>
                  <SortableContext items={[]}>
                    {allOrders[container.id] &&
                      allOrders[container.id]?.map((order: any) => {
                        return (
                          <Box key={order.orderId} sx={{ padding: 2 }}>
                            <Card
                              sx={{
                                marginBottom: 2,
                                borderRadius: 2,
                                boxShadow: 3,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}>
                              <CardContent sx={{ padding: 2 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 2,
                                  }}>
                                  <Box>
                                    <Typography
                                      variant='h6'
                                      sx={{ fontWeight: "bold", mb: 1 }}>
                                      Order #1234
                                    </Typography>
                                    <Typography
                                      variant='body2'
                                      color='textSecondary'>
                                      {order.date}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={order.delivery.message}
                                    color={
                                      !order.delivery.status && order.canceled ? 'error' : order.delivery.status
                                        ? "success"
                                        : "warning"
                                    }
                                    sx={{
                                      borderRadius: "50px",
                                      textTransform: "none",
                                    }}
                                  />
                                </Box>
                                {order?.order?.map((item: any, idx: number) => {
                                  let { additional } = item?.order;
                                  let addOnName = "";
                                  for (let i = 0; i < additional.length; i++) {
                                    addOnName += additional[i].items[0].name;

                                    if (i < additional.length - 1) {
                                      addOnName += " | ";
                                    }
                                  }
                                  return (
                                    <Box
                                      key={idx}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mt: 2,
                                      }}>
                                      <Avatar
                                        src={item?.order?.kulcha?.image}
                                        sx={{ width: 50, height: 50, mr: 2 }}
                                      />
                                      <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant='body1'>
                                          {item?.order?.kulcha?.name}
                                        </Typography>
                                        {additional?.length !== 0 && (
                                          <Typography
                                            variant='body2'
                                            color='textSecondary'>
                                            Add-ons : {addOnName}
                                          </Typography>
                                        )}
                                      </Box>
                                      <Box sx={{ textAlign: "right" }}>
                                        <Typography
                                          variant='body2'
                                          color='textSecondary'
                                          sx={{
                                            display: "flex",
                                            width: "50px",
                                            justifyContent: "flex-end",
                                          }}>
                                          Qty: {item?.order?.kulcha?.quantity}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  );
                                })}
                              </CardContent>
                              <Box>
                                <Divider sx={{ my: 1 }} />
                                <Box
                                  sx={{
                                    px: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}>
                                  <Typography
                                    variant='body2'
                                    color='textSecondary'>
                                    Total Tax
                                  </Typography>
                                  <Typography
                                    variant='body2'
                                    color='textSecondary'>
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
                                  }}>
                                  <Typography
                                    variant='body2'
                                    color='textSecondary'>
                                    Total
                                  </Typography>
                                  <Typography
                                    variant='body2'
                                    color='textSecondary'>
                                    ${Number(order?.grand_total).toFixed(2)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ px: 2 }}>
                                  <Typography variant='h6' gutterBottom>
                                    Billing Address
                                  </Typography>
                                  <Typography
                                    variant='body2'
                                    color='textSecondary'>
                                    Name: {order?.customer?.name}
                                  </Typography>
                                  <Typography
                                    variant='body2'
                                    color='textSecondary'>
                                    Address: {order?.address}
                                  </Typography>
                                  <Typography
                                    variant='body2'
                                    color='textSecondary'>
                                    Phone: {order?.customer?.phoneNumber}
                                  </Typography>
                                  <Typography
                                    variant='body2'
                                    color='textSecondary'>
                                    Instructions: {order?.instructions}
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
                                  }}>
                                  <Typography
                                    variant='body2'
                                    color='textSecondary'>
                                    X{order?.order?.length} Items
                                  </Typography>
                                  <Typography
                                    variant='body2'
                                    color='textSecondary'
                                    sx={{ display: "flex", gap: 1 }}>
                                    {container.id === "container-2" && (
                                      <Button
                                        onClick={() =>
                                          updateOrderStatus(
                                            order.id,
                                            "Out For Delivery",
                                            false
                                          )
                                        }
                                        variant='contained'
                                        sx={{
                                          backgroundColor: "#ECAB21",
                                          color: "white",
                                          fontWeight: "bold",
                                          fontSize: "10px",
                                          "&:hover": {
                                            backgroundColor: "white",
                                            color: "#ECAB21",
                                          },
                                        }}>
                                        Out For Delivery
                                      </Button>
                                    )}
                                    {container.id === "container-3" && (
                                      <Button
                                        onClick={() =>
                                          updateOrderStatus(
                                            order.id,
                                            "Delivered",
                                            true
                                          )
                                        }
                                        variant='contained'
                                        sx={{
                                          backgroundColor: "#ECAB21",
                                          color: "white",
                                          fontWeight: "bold",
                                          fontSize: "10px",
                                          "&:hover": {
                                            backgroundColor: "white",
                                            color: "#ECAB21",
                                          },
                                        }}>
                                        Delivered
                                      </Button>
                                    )}
                                     {(container.id === "container-3" || container.id === "container-2")  && (
                                      <Button
                                        onClick={() =>
                                          cancelOrderStatus(order.id)
                                        }
                                        variant='contained'
                                        sx={{
                                          backgroundColor: "red",
                                          color: "white",
                                          fontWeight: "bold",
                                          fontSize: "10px",
                                          "&:hover": {
                                            backgroundColor: "white",
                                            color: "red",
                                          },
                                        }}>
                                        Cancel
                                      </Button>
                                     )}
                                  </Typography>
                                </Box>
                              </Box>
                            </Card>
                          </Box>
                        );
                      })}
                  </SortableContext>
                </Box>
              ))}
            </Box>
          </SortableContext>
        </DndContext>
      </Box>
    </Box>
  );
};

export default KanbanBoard;
