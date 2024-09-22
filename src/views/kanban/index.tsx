import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
} from "@dnd-kit/core";
import { Br, Cut, Line, Printer, Row, Text, render } from 'react-thermal-printer';
import { useAuthContext } from "@/context";
import { db } from "@/firebase";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
} from "@mui/material";
import CircularLodar from "@/components/CircularLodar";
import axios from "axios";
import { getIdToken } from "firebase/auth";
import { formatTimestampToCustomDate } from "@/utils/commonFunctions";
import KulchaCard from "@/components/KulchaCard";
import PrintComponent from "@/components/PrintComponent";
import { useReactToPrint } from 'react-to-print';

const KanbanBoard = () => {
  const [containers] = useState([
    { id: `container-1`, title: "Today's Cart" },
    { id: `container-2`, title: "Today's Order" },
    { id: `container-3`, title: "Out for delivery" },
    { id: `container-4`, title: "Delivered" },
    { id: `container-5`, title: "Cancelled" },
    { id: `container-6`, title: "Sorted order" },
  ]);

  const [drivers, setDrivers] = useState<any>([]);
  const [showDriverDropdown, setShowDriverDropdown] = useState<string | null>(
    null
  );
  const printRef = useRef<any>({});
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleOpenDialog = (orderId: string) => {
    setOpenDialog(orderId);
  };

  const handleCloseDialog = () => {
    setOpenDialog(null);
  };

  const handleDriverSelect = async (orderId: string, driverId: string) => {
    const docRef = doc(db, "orders", orderId);
    const driverRef = doc(db, "drivers", driverId);
    setLoading(true);
    let name = ''
    console.log(driverId);
    const _driver = await getDoc(driverRef)
    console.log(_driver.exists());
    if(_driver.exists()){
      name = _driver.data().name
    }
    await updateDoc(docRef, {
      driverId: driverId,
      driverName: name,
    });
    setLoading(false);
    handleCloseDialog();
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [expandedCards, setExpandedCards] = useState<{
    [key: string]: boolean;
  }>({});
  const { user, metaData } = useAuthContext();
  const [allOrders, setAllOrders] = useState<any>({});
  const [alooKulcha, setAlooKulcha] = useState<number>(0);
  const [paneerKulcha, setPaneerKulcha] = useState<number>(0);
  const [gobiKulcha, setGobiKulcha] = useState<number>(0);
  const [mixKulcha, setMixKulcha] = useState<number>(0);
  const [onionKulcha, setOnionKulcha] = useState<number>(0);
  const [cart, setCart] = useState<any[]>([]);
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [sortedOrders, setSortedOrders] = useState<any[]>([]);
  const [deliveredOrder, setDeliveredOrder] = useState<any[]>([]);
  const [outForDelivery, setOutForDelivery] = useState<any[]>([]);
  const [canceledOrders, setCanceledOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const startOfToday = Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)));
  const endOfToday = Timestamp.fromDate(
    new Date(new Date().setHours(23, 59, 59, 999))
  );

  const getDrivers = async () => {
    const driverColRef = collection(db, "drivers");
    const drivers = await getDocs(driverColRef);

    let arr: any = [];
    if (drivers.size > 0) {
      drivers.forEach((doc) => {
        arr.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setDrivers([...arr]);
    }
  };

  useEffect(() => {
    if (!metaData?.isKitchen) return;

    const colRef = collection(db, "orders");
    const cartColRef = collection(db, "carts");

    getDrivers();

    const cartsQuery = query(
      cartColRef,
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday),
      orderBy("createdAt", "desc")
    );

    const unsubscribeCart = onSnapshot(cartsQuery, (snapshot) => {
      let cart: any[] = [];
      snapshot.forEach((doc) => {
        cart.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCart([...cart]);
    });

    const newOrderQuery = query(
      colRef,
      where("kitchenId", "==", metaData?.foodTruckId),
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday),
      orderBy("createdAt", "desc")
    );
    const unsubscribeNewOrder = onSnapshot(newOrderQuery, (snapshot) => {
      let newOrders: any[] = [];
      let sortedOrders: any[] = [];
      let alooKulcha = 0
      let gobiKulcha = 0
      let paneerKulcha = 0
      let mixKulcha = 0
      let onionKulcha = 0
      snapshot.forEach((doc) => {
        const { delivery, canceled, refunded } = doc.data();
        if (delivery.status === false && delivery.message === "Preparing") {
          newOrders.push({
            id: doc.id,
            ...doc.data(),
          });
         const { order} = doc.data()
         for(let i=0;i < order.length;i++){
            const {kulcha} = order[i].order
            if(kulcha?.name === 'Mix Kulcha'){
              mixKulcha = mixKulcha + kulcha?.quantity
              console.log(kulcha?.quantity,i);
            }

            if(kulcha?.name === 'Onion Kulcha'){
              onionKulcha = onionKulcha +  kulcha?.quantity
            }

            if(kulcha?.name === 'Paneer Kulcha'){
              paneerKulcha = paneerKulcha + kulcha?.quantity
            }

            if(kulcha?.name === 'Gobi Kulcha'){
              gobiKulcha = gobiKulcha + kulcha?.quantity
            }

            if(kulcha?.name === 'Aloo Kulcha'){
              alooKulcha = alooKulcha + kulcha?.quantity
            }
         }

        }
        if (delivery.status === false && !canceled && !refunded) {
          sortedOrders.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });
      setAlooKulcha(alooKulcha)
      setPaneerKulcha(paneerKulcha)
      setGobiKulcha(gobiKulcha)
      setMixKulcha(mixKulcha)
      setOnionKulcha(onionKulcha)
      sortedOrders.sort(
        (a: any, b: any) =>
          a.address?.distance?.value - b.address?.distance?.value
      );
      setSortedOrders([...sortedOrders]);
      setNewOrders([...newOrders]);
    });

    const outForDeliveryQuery = query(
      colRef,
      where("kitchenId", "==", metaData?.foodTruckId),
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday),
      where("delivery.status", "==", false),
      where("delivery.message", "==", "Out For Delivery"),
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
      where("kitchenId", "==", metaData?.foodTruckId),
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday),
      where("delivery.status", "==", true),
      where("delivery.message", "==", "Delivered"),
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
      where("kitchenId", "==", metaData?.foodTruckId),
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday),
      where("delivery.status", "==", false),
      where("canceled", "==", true),
      orderBy("createdAt", "desc")
    );
    const unsubscribeCanceled = onSnapshot(canceledOrderQuery, (snapshot) => {
      let canceledOrders: any[] = [];
      snapshot.forEach((doc) => {
        const { delivery, canceled, refunded } = doc.data();
        if (
          delivery.status === false &&
          (delivery.message === "Canceled" ||
            delivery.message === "Refunded") &&
          (canceled || refunded)
        ) {
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
      unsubscribeCart();
    };
  }, [user, metaData]);

  useEffect(() => {
    setAllOrders({
      "container-1": [...cart],
      "container-2": [...newOrders],
      "container-3": [...outForDelivery],
      "container-4": [...deliveredOrder],
      "container-5": [...canceledOrders],
      "container-6": [...sortedOrders],
    });
  }, [
    user,
    metaData,
    newOrders,
    outForDelivery,
    deliveredOrder,
    canceledOrders,
    cart,
  ]);

  const updateOrderStatus = async (
    _id: string,
    message: string,
    status: boolean
  ) => {
    try {
      setLoading(true);
      const docRef = doc(db, "orders", _id);
      await updateDoc(docRef, {
        delivery: {
          message,
          status,
        },
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      return err;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrderStatus = async (_id: string) => {
    try {
      setLoading(true);
      const docRef = doc(db, "orders", _id);
      await updateDoc(docRef, {
        canceled: true,
        delivery: {
          message: "Canceled",
          status: false,
        },
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      return err;
    } finally {
      setLoading(false);
    }
  };

  const orderRefund = async (_id: string) => {
    try {
      setLoading(true);
      const token = await getIdToken(user);
      const result = await axios.post(
        "/api/refundOrder",
        {
          order_id: _id,
        },
        {
          headers: {
            "x-token": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (result.data.code === 1 && result.data.refund) {
        const docRef = doc(db, "orders", _id);
        await updateDoc(docRef, {
          refunded: true,
          delivery: {
            status: false,
            message: "Refunded",
          },
          refundId: result.data.refund.id,
        });
      }
      console.log(result.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [flagPrint, setFlagPrint] = useState<boolean>(false);

  useEffect(() => {
    if(!selectedOrderId) return 
    handlePrint()
  },[flagPrint])

  const handlePrint = useReactToPrint({
    content: () => (selectedOrderId ? printRef.current[selectedOrderId] : null),
  });

  const receiptPrinterHandler = async (id:string) => {
    setFlagPrint(!flagPrint)
    setSelectedOrderId(id)
  }


  return (
    <Box
      sx={{ minHeight: "auto", backgroundColor: "white", overflowY: "auto" }}
    >
      <CircularLodar isLoading={loading} />
      <Box sx={{display:"flex",alignItems:"center",mt:2}}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 2, pl: 3, pt: 4.5,width:"228px" }}
        >
          Order Details
        </Typography>
        <Grid container spacing={0} justifyContent="flex-start" gap={2}>
          <KulchaCard name="Mix Kulcha" count={mixKulcha}/>
          <KulchaCard name="Aloo Kulcha" count={alooKulcha}/>
          <KulchaCard name="Gobi Kulcha" count={gobiKulcha}/>
          <KulchaCard name="Onion Kulcha" count={onionKulcha}/>
          <KulchaCard name="Paneer Kulcha" count={paneerKulcha}/>
        </Grid>
      </Box>
      <Box
        className=" w-auto p-5 max-h-[1300px] bg-white no-scrollbar"
        sx={{ overflowY: "hidden", overflowX: "auto", ml: 3 }}
      >
        <DndContext sensors={sensors} collisionDetection={closestCorners}>
          <SortableContext items={containers.map((container) => container.id)}>
            <Box
              display="flex"
              justifyContent="space-evenly"
              gap={2}
              minWidth="2300px"
              marginTop={5.5}
            >
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
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor: "#ECAB21",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        backgroundColor: "#ECAB21",
                        color: "#fff",
                        textAlign: "center",
                        padding: 2,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      {container.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        position: "sticky",
                        top: 12,
                        zIndex: 15,
                        right: 4,
                        backgroundColor: "white",
                        borderRadius: "50%", // Set to 50% to make the border circular
                        color: "#ECAB21",
                        textAlign: "center",
                        padding: "8px 16px", // Adjust padding to ensure content fits within the circle
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                        width: "40px", // Set width and height to make sure the box is circular
                        height: "40px",
                        display: "flex",
                        alignItems: "center", // Center the text vertically
                        justifyContent: "center", // Center the text horizontally
                      }}
                    >
                      {allOrders[container.id]?.length}
                    </Typography>
                  </Box>
                  <SortableContext items={[]}>
                    {allOrders[container.id]?.length === 0 ? (
                      <>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            mt: 2,
                          }}
                        >
                          <Box
                            sx={{
                              px: 2,
                              width: "100%",
                            }}
                          >
                            <Typography variant="body1">
                              No record found.
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    ) : (
                      <>
                        {allOrders[container.id]?.map(
                          (order: any, idy: number) => {
                            const isExpanded = expandedCards[order.id] || false;
                            if (container.id === "container-1") {
                              let { additional } = order.order;
                              return (
                                <Box key={order.orderId} sx={{ padding: 2 }}>
                                  <Card
                                    sx={{
                                      marginBottom: 1,
                                      borderRadius: 2,
                                      boxShadow: 3,
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <CardContent>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          flexDirection: "column",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            width: "100%",
                                          }}
                                        >
                                          <Avatar
                                            src={order?.order?.kulcha?.image}
                                            sx={{
                                              width: 50,
                                              height: 50,
                                              mr: 2,
                                            }}
                                          />
                                          <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="body1">
                                              {order?.order?.kulcha?.name}
                                            </Typography>
                                          </Box>
                                          <Box sx={{ textAlign: "right" }}>
                                            <Typography
                                              variant="body2"
                                              color="textSecondary"
                                              sx={{
                                                display: "flex",
                                                width: "50px",
                                                justifyContent: "flex-end",
                                              }}
                                            >
                                              Qty:{" "}
                                              {order?.order?.kulcha?.quantity}
                                            </Typography>
                                          </Box>
                                        </Box>

                                        <Box sx={{ width: "100%", mt: 1 }}>
                                          {additional?.length !== 0 && (
                                            <>
                                              <Typography
                                                variant="h6"
                                                sx={{
                                                  fontSize: "12px",
                                                  color: "#1F2937",
                                                  paddingBottom: "4px",
                                                }}
                                              >
                                                Add on items :
                                              </Typography>
                                              {additional.map((add: any) => {
                                                return (
                                                  <Box
                                                    key={add?.id}
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      justifyContent:
                                                        "space-between",
                                                    }}
                                                  >
                                                    <Typography
                                                      variant="body1"
                                                      sx={{
                                                        color: "#1F2937",
                                                        fontWeight: "bold",
                                                        fontSize: "14px",
                                                      }}
                                                    >
                                                      {add?.items?.[0]?.name}: x
                                                      {
                                                        add?.items?.[0]
                                                          ?.quantity
                                                      }
                                                    </Typography>
                                                    <Typography
                                                      variant="body1"
                                                      sx={{
                                                        color: "#1F2937",
                                                        fontWeight: "bold",
                                                        fontSize: "14px",
                                                      }}
                                                    >
                                                      ${add?.items?.[0]?.price}{" "}
                                                      x{" "}
                                                      {
                                                        add?.items?.[0]
                                                          ?.quantity
                                                      }
                                                    </Typography>
                                                  </Box>
                                                );
                                              })}
                                            </>
                                          )}
                                        </Box>
                                      </Box>
                                      {/* {!isExpanded && (
                                        <Box
                                          sx={{ textAlign: "center", mt: 1 }}
                                        >
                                          <Button
                                            variant="text"
                                            onClick={() =>
                                              handleToggleExpand(order.id)
                                            }
                                            size="small"
                                            sx={{
                                              fontWeight: "bold",
                                              fontSize: "10px",
                                            }}
                                          >
                                            Show More
                                          </Button>
                                        </Box>
                                      )} */}
                                      {/* {isExpanded && (
                                        <> */}
                                      <Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                            gap: 0.56,
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            component="span"
                                            sx={{
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Time:
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            component="span"
                                          >
                                            {formatTimestampToCustomDate(
                                              order.createdAt
                                            )}
                                          </Typography>
                                        </Box>
                                        <Box>
                                          <Typography variant="body2">
                                            <Typography
                                              variant="body2"
                                              component="span"
                                              sx={{
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Name:
                                            </Typography>{" "}
                                            {order?.customer?.name}
                                          </Typography>
                                        </Box>
                                        <Box>
                                          <Typography variant="body2">
                                            <Typography
                                              variant="body2"
                                              component="span"
                                              sx={{
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Phone:
                                            </Typography>{" "}
                                            {order?.customer?.phoneNumber}
                                          </Typography>
                                        </Box>
                                        <Box>
                                          <Typography variant="body2">
                                            <Typography
                                              variant="body2"
                                              component="span"
                                              sx={{
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Address:
                                            </Typography>{" "}
                                            {order?.customer?.address?.raw ||
                                              ""}
                                          </Typography>
                                        </Box>
                                        <Box>
                                          <Typography variant="body2">
                                            <Typography
                                              variant="body2"
                                              component="span"
                                              sx={{
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Distance:
                                            </Typography>{" "}
                                            {order?.customer?.address?.distance
                                              ?.text || ""}
                                          </Typography>
                                        </Box>
                                        <Box>
                                          <Typography variant="body2">
                                            <Typography
                                              variant="body2"
                                              component="span"
                                              sx={{
                                                fontWeight: "bold",
                                              }}
                                            >
                                              User:
                                            </Typography>{" "}
                                            {order.isUserExist
                                              ? "Existing User"
                                              : "New User"}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </CardContent>
                                  </Card>
                                </Box>
                              );
                            }
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
                                  }}
                                >
                                  <CardContent sx={{ padding: 2 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 2,
                                      }}
                                    >
                                      <Box>
                                        <Typography
                                          variant="h6"
                                          sx={{ fontWeight: "bold", mb: 1 }}
                                        >
                                          Order #
                                          {order?.orderNumber?.forKitchen}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                        >
                                          {order.date}
                                        </Typography>
                                      </Box>
                                      <Chip
                                        label={order?.delivery?.message}
                                        color={
                                          !order?.delivery?.status &&
                                          (order?.canceled || order?.refunded)
                                            ? "error"
                                            : order?.delivery?.status
                                            ? "success"
                                            : "warning"
                                        }
                                        sx={{
                                          borderRadius: "50px",
                                          textTransform: "none",
                                        }}
                                      />
                                    </Box>
                                    {order?.order?.map(
                                      (item: any, idx: number) => {
                                        let { additional } = item?.order;
                                        let addOnName = "";
                                        for (
                                          let i = 0;
                                          i < additional.length;
                                          i++
                                        ) {
                                          addOnName +=
                                            additional[i].items[0].name;

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
                                            }}
                                          >
                                            <Avatar
                                              src={item?.order?.kulcha?.image}
                                              sx={{
                                                width: 50,
                                                height: 50,
                                                mr: 2,
                                              }}
                                            />
                                            <Box sx={{ flexGrow: 1 }}>
                                              <Typography variant="body1">
                                                {item?.order?.kulcha?.name}
                                              </Typography>
                                              {additional?.length !== 0 && (
                                                <Typography
                                                  variant="body2"
                                                  color="textSecondary"
                                                >
                                                  Add-ons : {addOnName}
                                                </Typography>
                                              )}
                                            </Box>
                                            <Box sx={{ textAlign: "right" }}>
                                              <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={{
                                                  display: "flex",
                                                  width: "50px",
                                                  justifyContent: "flex-end",
                                                }}
                                              >
                                                Qty:{" "}
                                                {item?.order?.kulcha?.quantity}
                                              </Typography>
                                            </Box>
                                          </Box>
                                        );
                                      }
                                    )}
                                  </CardContent>
                                  <Divider sx={{ mb: 1 }} />
                                  <Box
                                          sx={{
                                            px: 2,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            component="span"
                                            sx={{
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Driver Name:
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
                                            {order?.driverName}
                                          </Typography>
                                        </Box>
                                  {!isExpanded && (
                                    <Box
                                      sx={{
                                        textAlign: "center",
                                        mt: 1,
                                        marginBottom: 2,
                                      }}
                                    >
                                      <Button
                                        variant="text"
                                        onClick={() =>
                                          handleToggleExpand(order.id)
                                        }
                                        size="small"
                                        sx={{
                                          fontWeight: "bold",
                                          fontSize: "10px",
                                        }}
                                      >
                                        Show More
                                      </Button>
                                    </Box>
                                  )}
                                  {isExpanded && (
                                    <>
                                      <Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box
                                          sx={{
                                            px: 2,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            component="span"
                                            sx={{
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Payment Mode:
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
                                            {order.paymentMode}
                                          </Typography>
                                        </Box>
                                        <Box
                                          sx={{
                                            px: 2,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            component="span"
                                            sx={{
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Source:
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
                                            {order.source}
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box
                                          sx={{
                                            px: 2,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            component="span"
                                            sx={{
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Time:
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
                                            {formatTimestampToCustomDate(
                                              order.createdAt
                                            )}
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box
                                          sx={{
                                            px: 2,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            component="span"
                                            sx={{
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Delivery Charges:
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
                                            $
                                            {Number(
                                              order?.deliverCharge || 0
                                            ).toFixed(2)}
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
                                          <Typography
                                            variant="body2"
                                            component="span"
                                            sx={{
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Total Tax:
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
                                            $
                                            {Number(order?.total_tax).toFixed(
                                              2
                                            )}
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
                                          <Typography
                                            variant="body2"
                                            component="span"
                                            sx={{
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Total:
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
                                            $
                                            {Number(
                                              Number(order?.grand_total) +
                                                Number(order.deliverCharge || 0)
                                            ).toFixed(2)}
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <Box>
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{ px: 2 }}>
                                          {/* <Typography
                                            variant="body2"
                                            sx={{
                                              fontWeight: "bold",
                                              marginBottom: 1,
                                            }}
                                          >
                                            Billing Address :
                                          </Typography> */}
                                          <Typography variant="body2">
                                            <Typography
                                              variant="body2"
                                              component="span"
                                              sx={{
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Name:
                                            </Typography>{" "}
                                            {order?.customer?.name}
                                          </Typography>
                                          <Typography variant="body2">
                                            <Typography
                                              variant="body2"
                                              component="span"
                                              sx={{
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Phone:
                                            </Typography>{" "}
                                            {order?.customer?.phoneNumber}
                                          </Typography>
                                          <Typography variant="body2">
                                            <Typography
                                              variant="body2"
                                              component="span"
                                              sx={{
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Address:
                                            </Typography>{" "}
                                            {order?.address?.raw ||
                                              order?.address}
                                          </Typography>
                                          <Typography variant="body2">
                                            <Typography
                                              variant="body2"
                                              component="span"
                                              sx={{
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Distance:
                                            </Typography>{" "}
                                            {order?.address?.distance?.text ||
                                              ""}
                                          </Typography>
                                          <Typography variant="body2">
                                            <Typography
                                              variant="body2"
                                              component="span"
                                              sx={{
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Instructions:
                                            </Typography>{" "}
                                            {order?.instructions}
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
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                          }}
                                        >
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                          >
                                            X{order?.order?.length} Items
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ display: "flex", gap: 1 }}
                                          >
                                              {(container.id === "container-2" || container.id === "container-3") && (
                                                <>
                                                    <Button
                                                  onClick={() =>
                                                    handleOpenDialog(order.id)
                                                  }
                                                  variant="contained"
                                                  sx={{
                                                    backgroundColor: "#ECAB21",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    fontSize: "10px",
                                                    marginTop: 2,
                                                    "&:hover": {
                                                      backgroundColor: "white",
                                                      color: "#ECAB21",
                                                    },
                                                  }}
                                                >
                                                  Assigned Driver
                                                </Button>
                                                </>

                                              )}
                                            {(container.id === "container-2") && (
                                              <>
                                                <Button
                                                  onClick={() =>
                                                    updateOrderStatus(
                                                      order.id,
                                                      "Out For Delivery",
                                                      false
                                                    )
                                                  }
                                                  disabled={
                                                    order?.driverId === "" ||
                                                    order?.driverId ===
                                                      undefined
                                                  }
                                                  variant="contained"
                                                  sx={{
                                                    backgroundColor: "#ECAB21",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    fontSize: "10px",
                                                    marginTop: 2,
                                                    "&:hover": {
                                                      backgroundColor: "white",
                                                      color: "#ECAB21",
                                                    },
                                                  }}
                                                >
                                                  Out For Delivery
                                                </Button>
                                                <Dialog
                                                  open={openDialog === order.id}
                                                  sx={{ zIndex: "999" }}
                                                  onClose={handleCloseDialog}
                                                  PaperProps={{
                                                    sx: {
                                                      borderRadius: 4, // Rounds the corners of the dialog
                                                      padding: 2, // Adds padding inside the dialog
                                                      minWidth: 400, // Minimum width for the dialog
                                                    },
                                                  }}
                                                >
                                                  <DialogTitle>
                                                    Assign Driver
                                                  </DialogTitle>
                                                  <DialogContent>
                                                    <FormControl
                                                      fullWidth
                                                      variant="outlined"
                                                      sx={{ mt: 2 }}
                                                    >
                                                      <InputLabel>
                                                        Select Driver
                                                      </InputLabel>
                                                      <Select
                                                        value={order.driverId}
                                                        onChange={(e) =>
                                                          handleDriverSelect(
                                                            order.id,
                                                            e.target.value
                                                          )
                                                        }
                                                        label="Select Driver"
                                                        fullWidth
                                                        sx={{
                                                          borderRadius: 2,
                                                        }}
                                                      >
                                                        {drivers.map(
                                                          (driver: any) => (
                                                            <MenuItem
                                                              key={driver.id}
                                                              value={driver.id}
                                                            >
                                                              {driver.name}
                                                            </MenuItem>
                                                          )
                                                        )}
                                                      </Select>
                                                    </FormControl>
                                                  </DialogContent>
                                                  <DialogActions>
                                                    <Button
                                                      onClick={
                                                        handleCloseDialog
                                                      }
                                                    >
                                                      Cancel
                                                    </Button>
                                                  </DialogActions>
                                                </Dialog>
                                              </>
                                            )}
                                            {container.id === "container-3" && (
                                              <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={{
                                                  display: "flex",
                                                  gap: 1,
                                                }}
                                              >
                                                <Button
                                                  onClick={() =>
                                                    updateOrderStatus(
                                                      order.id,
                                                      "Delivered",
                                                      true
                                                    )
                                                  }
                                                  variant="contained"
                                                  sx={{
                                                    backgroundColor: "#ECAB21",
                                                    color: "white",
                                                    marginTop: 2,
                                                    fontWeight: "bold",
                                                    fontSize: "10px",
                                                    "&:hover": {
                                                      backgroundColor: "white",
                                                      color: "#ECAB21",
                                                    },
                                                  }}
                                                >
                                                  Delivered
                                                </Button>
                                              </Typography>
                                            )}
                                            {(container.id === "container-3" ||
                                              container.id ===
                                                "container-2") && (
                                              <Button
                                                onClick={() =>
                                                  cancelOrderStatus(order.id)
                                                }
                                                variant="contained"
                                                sx={{
                                                  backgroundColor: "red",
                                                  color: "white",
                                                  fontWeight: "bold",
                                                  marginTop: 2,
                                                  fontSize: "10px",
                                                  "&:hover": {
                                                    backgroundColor: "white",
                                                    color: "red",
                                                  },
                                                }}
                                              >
                                                Cancel
                                              </Button>
                                            )}
                                            {container.id === "container-5" && (
                                              <Button
                                                onClick={() =>
                                                  orderRefund(order.id)
                                                }
                                                variant="contained"
                                                disabled={order?.refunded}
                                                sx={{
                                                  backgroundColor: "#ECAB21",
                                                  color: "white",
                                                  fontWeight: "bold",
                                                  fontSize: "10px",
                                                  "&:hover": {
                                                    backgroundColor: "white",
                                                    color: "#ECAB21",
                                                  },
                                                }}
                                              >
                                                Refund
                                              </Button>
                                            )}
                                          </Typography>
                                          {(container.id === "container-2" ||
                                            container.id === "container-3") && (
                                            <Typography
                                              component="div"
                                              sx={{ width: "100%" }}
                                            >
                                              <Button
                                                fullWidth
                                                onClick={() => receiptPrinterHandler(String(idy))}
                                                variant="contained"
                                                sx={{
                                                  backgroundColor: "#ECAB21",
                                                  color: "white",
                                                  fontWeight: "bold",
                                                  fontSize: "12px",
                                                  marginTop: 2,
                                                  "&:hover": {
                                                    backgroundColor: "white",
                                                    color: "#ECAB21",
                                                  },
                                                }}
                                              >
                                                Print Receipt
                                              </Button>
                                              <div style={{ display: 'none' }}>
                                              <PrintComponent 
                                                address = {order?.address?.raw}
                                                time={formatTimestampToCustomDate(
                                                  order.createdAt
                                                )}
                                                total = {Number(
                                                  Number(order?.grand_total) +
                                                    Number(order.deliverCharge || 0)
                                                ).toFixed(2)}
                                                totalTax = {Number(order?.total_tax).toFixed(
                                                  2
                                                )}
                                                deliverCharges= {Number(
                                                  order?.deliverCharge || 0
                                                ).toFixed(2)}
                                                order={order}
                                                phone= {order?.customer?.phoneNumber}
                                                distance= {order?.address?.distance?.text ||
                                                  ""}
                                                  instructions={order?.instructions}
                                                name = {order?.customer?.name}
                                                ref={(el) => {
                                                  printRef.current[idy] = el;
                                                }}  />
                                              </div>
                                            </Typography>
                                          )}
                                        </Box>
                                        <Box
                                          sx={{
                                            textAlign: "center",
                                            mt: 1,
                                            mb: 1,
                                          }}
                                        >
                                          <Button
                                            variant="text"
                                            onClick={() =>
                                              handleToggleExpand(order.id)
                                            }
                                            size="small"
                                            sx={{
                                              fontWeight: "bold",
                                              fontSize: "10px",
                                            }}
                                          >
                                            Show Less
                                          </Button>
                                        </Box>
                                      </Box>
                                    </>
                                  )}
                                </Card>
                              </Box>
                            );
                          }
                        )}
                      </>
                    )}
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
