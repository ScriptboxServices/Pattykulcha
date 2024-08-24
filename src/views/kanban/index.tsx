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
  onSnapshot,
  orderBy,
  query,
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
  Typography,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

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
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [deliveredOrder, setDeliveredOrder] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any>({});
  const [outForDelivery, setOutForDelivery] = useState<any[]>([]);
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
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(deliveredOrderQuery, (snapshot) => {
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

    return () => {
      unsubscribeNewOrder();
      unsubscribeOutForDelivery();
    };
  }, [user]);

  const orders = [
    {
      orderId: "Pending",
      date: "05 Feb 2023, 08:28 PM",
      items: [
        {
          name: "Amritsari Kulcha",
          price: "$5.30",
          addons: "Add-ons: Coke, Extra Chutney",
          quantity: 1,
        },
        { name: "Mushroom kulcha", price: "$5.30", addons: "", quantity: 1 },
      ],
      status: "Pending",
    },
    {
      orderId: "#352",
      date: "05 Feb 2023, 08:28 PM",
      items: [
        {
          name: "Aloo Cheese Kulcha",
          price: "$5.30",
          addons: "Add-ons: Extra Chutney",
          quantity: 1,
        },
        { name: "Gobi kulcha", price: "$5.30", addons: "", quantity: 1 },
      ],
      status: "Delivered",
    },
    {
      orderId: "#353",
      date: "05 Feb 2023, 08:28 PM",
      items: [
        {
          name: "Aloo Kulcha",
          price: "$7.30",
          addons: "Add-ons: Caffe Latte, Amul Butter",
          quantity: 1,
        },
      ],
      status: "Pending",
    },
    {
      orderId: "#354",
      date: "05 Feb 2023, 08:28 PM",
      items: [
        {
          name: "Paneer Kulcha",
          price: "$7.30",
          addons: "Add-ons: Tea, Amul Butter",
          quantity: 1,
        },
      ],
      status: "Pending",
    },
    {
      orderId: "#355",
      date: "05 Feb 2023, 08:28 PM",
      items: [
        {
          name: "Patty Kulcha",
          price: "$5.30",
          addons: "Add-ons: Extra Chutney",
          quantity: 1,
        },
        {
          name: "Mix kulcha",
          price: "$6.30",
          addons: "Add-ons: Dollar Channa, Extra Chutney",
          quantity: 1,
        },
      ],
      status: "Delivered",
    },
    {
      orderId: "#356",
      date: "05 Feb 2023, 08:28 PM",
      items: [
        {
          name: "Corn Kulcha",
          price: "$5.30",
          addons: "Add-ons: Lassi, Extra Chutney",
          quantity: 1,
        },
        {
          name: "Mix kulcha",
          price: "$5.30",
          addons: "Add-ons: Dollar Channa",
          quantity: 1,
        },
      ],
      status: "Delivered",
    },
  ];

  useEffect(() => {
    setAllOrders({
      "container-1": [],
      "container-2": [...newOrders],
      "container-3": [...outForDelivery],
      "container-4": [...deliveredOrder],
      "container-5": [],
    });
  }, [user, newOrders, outForDelivery, deliveredOrder]);

  console.log(allOrders);
  console.log(allOrders["container-1"]);

  return (
    <>
      <Box>
        <Typography
          variant='h5'
          sx={{ fontWeight: "bold", mb: 2, pl: 3, pt: 4.5 }}>
          Order Details
        </Typography>
      </Box>
      <Box
        className=' w-auto p-5 h-[100%] bg-white no-scrollbar'
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
                  <SortableContext items={orders.map((order) => order.orderId)}>
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
                                      Order #{order.id.slice(0, 3)}...
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
                                      order.delivery.status
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
                                          sx={{ display: "flex",width:'50px',textAlign:'right' }}>
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
    </>
  );
};

export default KanbanBoard;
