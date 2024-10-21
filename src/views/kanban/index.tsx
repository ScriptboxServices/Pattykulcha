import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
} from "@dnd-kit/core";
import { render, Printer, Text } from "react-thermal-printer";
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
  Paper,
  TextField,
} from "@mui/material";
import CircularLodar from "@/components/CircularLodar";
import axios from "axios";
import { getIdToken } from "firebase/auth";
import {
  formatTimestampToCustomDate,
  ShortTime,
} from "@/utils/commonFunctions";
import KulchaCard from "@/components/KulchaCard";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import PrintComponent from "@/components/PrintComponent";
import { useReactToPrint } from "react-to-print";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import CartItemCard from "@/components/CartItemCard";

const KanbanBoard = () => {
  const [containers] = useState([
    { id: `container-1`, title: "Today's Cart" },
    { id: `container-2`, title: "Today's Order" },
    { id: `container-3`, title: "Out For delivery" },
    { id: `container-7`, title: "Ready For Pickup" },
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
    let name = "";
    const _driver = await getDoc(driverRef);
    if (_driver.exists()) {
      name = _driver.data().name;
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
  const { user, metaData, kitchenProfile } = useAuthContext();
  const [allOrders, setAllOrders] = useState<any>({});
  const [totalKulcha, setTotalKulcha] = useState<number>(0);
  const [alooKulcha, setAlooKulcha] = useState<number>(0);
  const [paneerKulcha, setPaneerKulcha] = useState<number>(0);
  const [gobiKulcha, setGobiKulcha] = useState<number>(0);
  const [mixKulcha, setMixKulcha] = useState<number>(0);
  const [onionKulcha, setOnionKulcha] = useState<number>(0);
  const [cart, setCart] = useState<any[]>([]);
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [sortedOrders, setSortedOrders] = useState<any[]>([]);
  const [deliveredOrder, setDeliveredOrder] = useState<any[]>([]);
  const [pickupOrder, setPickupOrder] = useState<any[]>([]);
  const [searchValue, setSeachValue] = useState<any>("");
  const [outForDelivery, setOutForDelivery] = useState<any[]>([]);
  const [canceledOrders, setCanceledOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showStickyNote, setShowStickyNote] = useState(false);
  const [stickyNotePosition, setStickyNotePosition] = useState({
    top: 0,
    left: 0,
  });
  const [noteText, setNoteText] = useState("");
  const handleSaveNote = () => {
    console.log("Note saved:", noteText);
    setShowStickyNote(false);
  };
  const handleNotesClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setStickyNotePosition({
      top: rect.top + window.scrollY - 10,
      left: rect.left + window.scrollX + 50,
    });
    setShowStickyNote(true);
  };

  const handleCloseNote = () => {
    setShowStickyNote(false);
  };

  const startOfToday = Timestamp.fromDate(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
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
      let outForDelivery: any[] = [];
      let canceledOrders: any[] = [];
      let deliveredOrder: any[] = [];
      let pickupOrder: any[] = [];
      let alooKulcha = 0;
      let gobiKulcha = 0;
      let paneerKulcha = 0;
      let mixKulcha = 0;
      let onionKulcha = 0;
      let total = 0;
      snapshot.forEach((doc) => {
        const {
          delivery,
          canceled,
          refunded,
          order,
          pickUpAction,
          readyForPickup,
        } = doc.data();
        for (let i = 0; i < order.length; i++) {
          const { kulcha } = order[i].order;
          total = total + Number(kulcha?.quantity);
        }
        if (delivery.status === false && delivery.message === "Preparing") {
          newOrders.push({
            id: doc.id,
            ...doc.data(),
          });
          const { order } = doc.data();
          for (let i = 0; i < order.length; i++) {
            const { kulcha } = order[i].order;
            if (kulcha?.name === "Mix Kulcha") {
              mixKulcha = mixKulcha + kulcha?.quantity;
            }

            if (kulcha?.name === "Onion Kulcha") {
              onionKulcha = onionKulcha + kulcha?.quantity;
            }

            if (kulcha?.name === "Paneer Kulcha") {
              paneerKulcha = paneerKulcha + kulcha?.quantity;
            }

            if (kulcha?.name === "Gobi Kulcha") {
              gobiKulcha = gobiKulcha + kulcha?.quantity;
            }

            if (kulcha?.name === "Aloo Kulcha") {
              alooKulcha = alooKulcha + kulcha?.quantity;
            }
          }
        }
        if (delivery.status === false && !canceled && !refunded) {
          sortedOrders.push({
            id: doc.id,
            ...doc.data(),
          });
        }

        if (
          delivery.status === false &&
          delivery.message === "Out For Delivery" &&
          !pickUpAction
        ) {
          outForDelivery.push({
            id: doc.id,
            ...doc.data(),
          });
        }

        if (delivery.message === "Out For Delivery" && readyForPickup) {
          pickupOrder.push({
            id: doc.id,
            ...doc.data(),
          });
        }

        if (delivery.status === true && delivery.message === "Delivered") {
          deliveredOrder.push({
            id: doc.id,
            ...doc.data(),
          });
        }
        if (delivery.status === false && canceled) {
          canceledOrders.push({
            id: doc.id,
            ...doc.data(),
          });
        }
      });
      setAlooKulcha(alooKulcha);
      setTotalKulcha(total);
      setPaneerKulcha(paneerKulcha);
      setGobiKulcha(gobiKulcha);
      setMixKulcha(mixKulcha);
      setOnionKulcha(onionKulcha);
      sortedOrders.sort(
        (a: any, b: any) =>
          a.address?.distance?.value - b.address?.distance?.value
      );
      setSortedOrders([...sortedOrders]);
      setNewOrders([...newOrders]);
      setOutForDelivery([...outForDelivery]);
      setDeliveredOrder([...deliveredOrder]);
      setCanceledOrders([...canceledOrders]);
      setPickupOrder([...pickupOrder]);
    });
    return () => {
      unsubscribeNewOrder();
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
      "container-7": [...pickupOrder],
    });
  }, [
    user,
    metaData,
    newOrders,
    outForDelivery,
    deliveredOrder,
    canceledOrders,
    cart,
    pickupOrder,
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
      return err;
    } finally {
      setLoading(false);
    }
  };

  const readyForPickUp = async (
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
        readyForPickup: true,
      });
      setLoading(false);
    } catch (err) {
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
      setLoading(false);
    } catch (err) {
      // console.log(err);
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

  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [flagPrint, setFlagPrint] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedOrderId) return;
    handlePrint();
  }, [flagPrint]);

  const handlePrint = useReactToPrint({
    content: () => (selectedOrderId ? printRef.current[selectedOrderId] : null),
    documentTitle: "Receipt",
    onAfterPrint: () => setSelectedOrderId(""),
  });

  const receiptPrinterHandler = async (id: string) => {
    setFlagPrint(!flagPrint);
    setSelectedOrderId(id);
  };

  const filteredOrders = Object.keys(allOrders)
    .filter((containerId) => containerId !== "container-1")
    .filter((containerId) => containerId !== "container-6")
    .reduce((acc: any[], containerId) => {
      const filteredContainerOrders = allOrders[containerId]?.filter(
        (order: any) =>
          order?.customer?.phoneNumber
            ?.toString()
            .includes(searchValue.toString()) ||
          order?.orderNumber?.forKitchen
            ?.toString()
            ?.includes(searchValue.toString())
      );
      return [...acc, ...filteredContainerOrders];
    }, []);

  // interface Navigator {
  //   serial: any;
  // }

  // const printReceipt = async () => {
  //   const data = await render(
  //     <Printer type='epson'>
  //       <Text>Hello World</Text>
  //     </Printer>
  //   );

  //   const Navigator :any = window.navigator

  //   const port = await Navigator.serial.requestPort();
  //   await port.open({ baudRate: 19600 });

  //   const writer = port.writable?.getWriter();
  //   if (writer != null) {
  //     await writer.write(data);
  //     writer.releaseLock();
  //   }
  // };

  return (
    <Box
      sx={{ minHeight: "auto", backgroundColor: "white", overflowY: "auto" }}>
      <CircularLodar isLoading={loading} />
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Grid
          sx={{ pl: 3 }}
          container
          spacing={0}
          justifyContent='flex-start'
          gap={2}>
          <KulchaCard name='Mix' count={mixKulcha} />
          <KulchaCard name='Aloo' count={alooKulcha} />
          <KulchaCard name='Gobi' count={gobiKulcha} />
          <KulchaCard name='Onion' count={onionKulcha} />
          <KulchaCard name='Paneer' count={paneerKulcha} />
          <KulchaCard name='Total' count={totalKulcha} />
        </Grid>
      </Box>
      <Box
        sx={{
          marginTop: 4,
          marginLeft: 3,
          display: "flex",
          justifyContent: "space-between",
        }}>
        <TextField
          placeholder='Seach order using order number or phone number'
          sx={{ width: "30%",margin : 'auto 0' }}
          value={searchValue}
          onChange={(e) => setSeachValue(e.target.value)}
        />
        <Box sx={{mr:3}}>
          <Typography variant='h6' sx={{ fontSize:'15px', fontWeight: "bold" }}>
            Kitchen Id : {kitchenProfile?.truckIdentifier} 
          </Typography>
          <Typography variant='h6' sx={{ fontSize:'15px', fontWeight: "bold" }}>
            Kitchen Name : {kitchenProfile?.name} 
          </Typography>
          <Typography variant='h6' sx={{ fontSize:'15px', fontWeight: "bold" }}>
            Kitchen Address : {kitchenProfile?.address?.raw} 
          </Typography>
        </Box>
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
              minWidth={searchValue ? "3200px" : "2800px"}
              marginTop={3.5}>
              {searchValue && filteredOrders?.length > 0 && (
                <Box
                  sx={{
                    width: 580,
                    maxHeight: "93vh",
                    overflowY: "auto",
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#fff",
                  }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor: "#ECAB21",
                    }}>
                    <Typography
                      variant='h6'
                      sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        backgroundColor: "#ECAB21",
                        color: "#fff",
                        textAlign: "center",
                        padding: 2,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      }}>
                      Search results
                    </Typography>
                    <Typography
                      variant='h6'
                      sx={{
                        position: "sticky",
                        top: 12,
                        zIndex: 15,
                        right: 4,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        color: "#ECAB21",
                        textAlign: "center",
                        padding: "8px 16px",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                        width: "40px",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      {filteredOrders.length}
                    </Typography>
                  </Box>
                  <SortableContext items={[]}>
                    <>
                      {filteredOrders?.map((order: any, idy: number) => {
                        const isExpanded = expandedCards[order.id] || false;
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
                                      sx={{ fontWeight: "bold" }}>
                                      Order #{order?.orderNumber?.forKitchen}
                                    </Typography>

                                    <Typography
                                      variant='body2'
                                      color='textSecondary'>
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
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}>
                                  <Typography variant='body2'>
                                    <Typography
                                      variant='body2'
                                      component='span'
                                      sx={{
                                        fontWeight: "bold",
                                      }}>
                                      Customer&rsquo;s order id:
                                    </Typography>{" "}
                                    {order?.orderNumber?.forCustomer}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}>
                                  <Typography
                                    variant='h6'
                                    sx={{
                                      fontWeight: "bold",
                                      color: "black",
                                    }}>
                                    {order?.customer?.phoneNumber}{" "}
                                  </Typography>
                                  <Typography
                                    variant='h6'
                                    sx={{ fontWeight: "bold" }}>
                                    {ShortTime(order.createdAt)}{" "}
                                  </Typography>
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
                                        sx={{
                                          width: 50,
                                          height: 50,
                                          mr: 2,
                                        }}
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
                                            fontWeight: "bold",
                                          }}>
                                          Qty: {item?.order?.kulcha?.quantity}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  );
                                })}
                              </CardContent>
                              <Divider sx={{ mb: 1 }} />

                              {!order?.pickUpAction ? (
                                <Box
                                  sx={{
                                    px: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}>
                                  <Typography
                                    variant='body2'
                                    sx={{
                                      fontWeight: "bold",
                                    }}>
                                    Driver Name:
                                  </Typography>
                                  <Typography
                                    variant='body2'
                                    color='textSecondary'>
                                    {order?.driverName}
                                  </Typography>
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    px: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}>
                                  <Typography
                                    variant='body2'
                                    sx={{
                                      fontWeight: "bold",
                                    }}>
                                    Order Type:
                                  </Typography>
                                  <Typography
                                    variant='body2'
                                    sx={{
                                      fontWeight: "bold",
                                      mt: 1,
                                      color: "red",
                                      fontSize: "1rem",
                                    }}>
                                    Pickup Order
                                  </Typography>
                                </Box>
                              )}
                              <Box
                                sx={{
                                  px: 2,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}>
                                <Typography variant='body2'>
                                  <Typography
                                    variant='body2'
                                    component='span'
                                    sx={{
                                      fontWeight: "bold",
                                    }}>
                                    Address:
                                  </Typography>{" "}
                                  {order?.address?.raw || order?.address}
                                </Typography>
                              </Box>

                              {!isExpanded && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mt: 1,
                                    mb: 2,
                                    position: "relative",
                                  }}>
                                  {/* "Show More" button centered */}
                                  <Button
                                    variant='text'
                                    onClick={() => handleToggleExpand(order.id)}
                                    size='small'
                                    sx={{
                                      fontWeight: "bold",
                                      fontSize: "10px",
                                    }}>
                                    Show More
                                  </Button>

                                  {/* <Box
                                      sx={{
                                        position: "absolute",
                                        right: 4, 
                                      }}
                                    >
                                      <IconButton
                                        sx={{
                                          borderRadius: "50%", 
                                          padding: 1,
                                          mt: 2,
                                          backgroundColor: "#ECAB21",
                                          color: "white",
                                          marginTop: "0.5rem",
                                          fontWeight: "bold",
                                          "&:hover": {
                                            backgroundColor: "#FFC107",
                                            color: "white",
                                          },
                                        }}
                                        onClick={handleNotesClick}
                                      >
                                        <DescriptionIcon />
                                      </IconButton>
                                    </Box> */}
                                </Box>
                              )}
                              {/* {showStickyNote && (
                                <Paper
                                  elevation={3}
                                  sx={{
                                    position: "absolute",
                                    top: stickyNotePosition.top,
                                    left: stickyNotePosition.left,
                                    width: "300px",
                                    padding: "10px",
                                    backgroundColor: "#fffbcc",
                                    zIndex: 1000,
                                    borderRadius: "10px",
                                  }}
                                >
                                  <IconButton
                                    onClick={handleCloseNote}
                                    sx={{
                                      position: "absolute",
                                      top: 5,
                                      right: 5,
                                      backgroundColor: "#fffbcc",
                                      "&:hover": {
                                        backgroundColor: "#fffbcc",
                                      },
                                    }}
                                  >
                                    <CloseIcon />
                                  </IconButton>

                                  <Typography variant="h6" sx={{ mb: 1 }}>
                                    Untitled Note
                                  </Typography>

                                  <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="standard"
                                    placeholder="Write your notes here..."
                                    value={noteText}
                                    onChange={(e) =>
                                      setNoteText(e.target.value)
                                    }
                                    InputProps={{
                                      disableUnderline: true,
                                    }}
                                    sx={{
                                      mb: 1,
                                      backgroundColor: "#fffbcc",
                                      padding: "5px",
                                    }}
                                  />

                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      mt: 2,
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={handleSaveNote}
                                      sx={{
                                        borderRadius: "10px",
                                        padding: 1,
                                        mt: 2,
                                        backgroundColor: "#ECAB21",
                                        color: "white",
                                        marginTop: "0.5rem",
                                        fontWeight: "bold",
                                        "&:hover": {
                                          backgroundColor: "#FFC107",
                                          color: "white",
                                        },
                                      }}
                                    >
                                      Save
                                    </Button>
                                  </Box>
                                </Paper>
                              )} */}
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
                                      }}>
                                      <Typography
                                        variant='body2'
                                        component='span'
                                        sx={{
                                          fontWeight: "bold",
                                        }}>
                                        Payment Mode:
                                      </Typography>
                                      <Typography
                                        variant='body2'
                                        color='textSecondary'>
                                        {order.paymentMode}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        px: 2,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}>
                                      <Typography
                                        variant='body2'
                                        component='span'
                                        sx={{
                                          fontWeight: "bold",
                                        }}>
                                        Source:
                                      </Typography>
                                      <Typography
                                        variant='body2'
                                        color='textSecondary'>
                                        {order.source}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box>
                                    {/* <Divider sx={{ my: 1 }} />
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
                                      </Box> */}
                                  </Box>
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
                                        component='span'
                                        sx={{
                                          fontWeight: "bold",
                                        }}>
                                        Delivery Charges:
                                      </Typography>
                                      <Typography
                                        variant='body2'
                                        color='textSecondary'>
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
                                      }}>
                                      <Typography
                                        variant='body2'
                                        component='span'
                                        sx={{
                                          fontWeight: "bold",
                                        }}>
                                        Total Tax:
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
                                        component='span'
                                        sx={{
                                          fontWeight: "bold",
                                        }}>
                                        Total:
                                      </Typography>
                                      <Typography
                                        variant='body2'
                                        color='textSecondary'>
                                        $
                                        {Number(
                                          Number(order?.grand_total) +
                                            Number(order.deliverCharge || 0) +
                                            Number(order.tip)
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
                                      <Typography variant='body2'>
                                        <Typography
                                          variant='body2'
                                          component='span'
                                          sx={{
                                            fontWeight: "bold",
                                          }}>
                                          Name:
                                        </Typography>{" "}
                                        {order?.customer?.name}
                                      </Typography>
                                      <Typography variant='body2'>
                                        <Typography
                                          variant='body2'
                                          component='span'
                                          sx={{
                                            fontWeight: "bold",
                                          }}>
                                          Customer&rsquo;s order id:
                                        </Typography>{" "}
                                        {order?.orderNumber?.forCustomer}
                                      </Typography>
                                      <Typography variant='body2'>
                                        <Typography
                                          variant='body2'
                                          component='span'
                                          sx={{
                                            fontWeight: "bold",
                                          }}>
                                          Distance:
                                        </Typography>{" "}
                                        {order?.address?.distance?.text || ""}
                                      </Typography>
                                      <Typography variant='body2'>
                                        <Typography
                                          variant='body2'
                                          component='span'
                                          sx={{
                                            fontWeight: "bold",
                                          }}>
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
                                      }}>
                                      <Typography
                                        variant='body2'
                                        color='textSecondary'>
                                        X{order?.order?.length} Items
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        mt: 2,
                                        mb: 1,
                                        position: "relative",
                                      }}>
                                      <Button
                                        variant='text'
                                        onClick={() =>
                                          handleToggleExpand(order.id)
                                        }
                                        size='small'
                                        sx={{
                                          fontWeight: "bold",
                                          fontSize: "10px",
                                        }}>
                                        Show Less
                                      </Button>
                                      {/* 
                                        <Box
                                      sx={{
                                        position: "absolute",
                                        right: 6,
                                        bottom: 0.1,
                                      }}
                                    >
                                      <IconButton
                                        sx={{
                                          borderRadius: "50%", 
                                          padding: 1,
                                          backgroundColor: "#ECAB21",
                                          color: "white",
                                          marginTop: "0.5rem",
                                          fontWeight: "bold",
                                          "&:hover": {
                                            backgroundColor: "#FFC107",
                                            color: "white",
                                          },
                                        }}
                                        onClick={handleNotesClick}
                                      >
                                        <DescriptionIcon />
                                      </IconButton>
                                    </Box> */}
                                    </Box>
                                  </Box>
                                </>
                              )}
                            </Card>
                          </Box>
                        );
                      })}
                    </>
                  </SortableContext>
                </Box>
              )}
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor: "#ECAB21",
                    }}>
                    <Typography
                      variant='h6'
                      sx={{
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        backgroundColor: "#ECAB21",
                        color: "#fff",
                        textAlign: "center",
                        padding: 2,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      }}>
                      {container.title}
                    </Typography>
                    <Typography
                      variant='h6'
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
                      }}>
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
                          }}>
                          <Box
                            sx={{
                              px: 2,
                              width: "100%",
                            }}>
                            <Typography variant='body1'>
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
                                <CartItemCard
                                  key={order.orderId}
                                  order={order}
                                  additional={additional}
                                />
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
                                          sx={{ fontWeight: "bold" }}>
                                          Order #
                                          {order?.orderNumber?.forKitchen}
                                        </Typography>
                                      </Box>
                                      {order.pickUpAction && (
                                        <Chip
                                          label={"Pickup"}
                                          sx={{
                                            borderRadius: "50px",
                                            textTransform: "none",
                                            backgroundColor: "red",
                                            color: "white",
                                            marginX: 2,
                                          }}
                                        />
                                      )}
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
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: 1,
                                      }}>
                                      <Typography variant='body1'>
                                        <Typography
                                          variant='body1'
                                          component='span'
                                          sx={{
                                            fontWeight: "bold",
                                          }}>
                                          Customer&rsquo;s order id:
                                        </Typography>{" "}
                                        {order?.orderNumber?.forCustomer}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}>
                                      <Typography
                                        variant='h6'
                                        sx={{
                                          fontWeight: "bold",
                                          color: "black",
                                        }}>
                                        {order?.customer?.phoneNumber}{" "}
                                      </Typography>
                                      <Typography
                                        variant='h6'
                                        sx={{ fontWeight: "bold" }}>
                                        {ShortTime(order.createdAt)}{" "}
                                      </Typography>
                                    </Box>
                                    {order?.iamHere &&
                                      !order?.delivery?.status && (
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                          }}>
                                          <Typography
                                            variant='h6'
                                            sx={{
                                              fontWeight: "bold",
                                              mt: 1,
                                              color: "green",
                                            }}>
                                            Person arrived for order pickup.
                                          </Typography>
                                        </Box>
                                      )}

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
                                            }}>
                                            <Avatar
                                              src={item?.order?.kulcha?.image}
                                              sx={{
                                                width: 50,
                                                height: 50,
                                                mr: 2,
                                              }}
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
                                                  fontWeight: "bold",
                                                }}>
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

                                  <Box sx={{ px: 2, mb: 1 }}>
                                    {/* <Typography
                                            variant="body2"
                                            sx={{
                                              fontWeight: "bold",
                                              marginBottom: 1,
                                            }}
                                          >
                                            Billing Address :
                                          </Typography> */}
                                    <Typography variant='body2'>
                                      <Typography
                                        variant='body2'
                                        component='span'
                                        sx={{
                                          fontWeight: "bold",
                                        }}>
                                        Name:
                                      </Typography>{" "}
                                      {order?.customer?.name}
                                    </Typography>
                                    {/* <Typography variant="body2">
                                            <Typography
                                              variant="body2"
                                              component="span"
                                              sx={{
                                                fontWeight: "bold",
                                              }}
                                            >
                                              Customer&rsquo;s order id:
                                            </Typography>{" "}
                                            {order?.orderNumber?.forCustomer}
                                          </Typography> */}
                                    <Typography variant='body2'>
                                      <Typography
                                        variant='body2'
                                        component='span'
                                        sx={{
                                          fontWeight: "bold",
                                        }}>
                                        Distance:
                                      </Typography>{" "}
                                      {order?.address?.distance?.text || ""}
                                    </Typography>
                                    <Typography variant='body2'>
                                      <Typography
                                        variant='body2'
                                        component='span'
                                        sx={{
                                          fontWeight: "bold",
                                        }}>
                                        Instructions:
                                      </Typography>{" "}
                                      {order?.instructions}
                                    </Typography>
                                  </Box>
                                  <Divider sx={{ mb: 1 }} />

                                  {!order?.pickUpAction ? (
                                    <Box
                                      sx={{
                                        px: 2,
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}>
                                      <Typography
                                        variant='body2'
                                        sx={{
                                          fontWeight: "bold",
                                        }}>
                                        Driver Name:
                                      </Typography>
                                      <Typography
                                        variant='body2'
                                        color='textSecondary'>
                                        {order?.driverName}
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <> </>
                                    // <Box
                                    //   sx={{
                                    //     px: 2,
                                    //     display: "flex",
                                    //     justifyContent: "space-between",
                                    //     alignItems: "center",
                                    //   }}
                                    // >
                                    //   <Typography
                                    //     variant="body2"
                                    //     sx={{
                                    //       fontWeight: "bold",
                                    //     }}
                                    //   >
                                    //     Order Type:
                                    //   </Typography>
                                    //   <Typography
                                    //     variant="body2"
                                    //     sx={{
                                    //       fontWeight: "bold",
                                    //       mt: 1,
                                    //       color: "red",
                                    //       fontSize: "1rem",
                                    //     }}
                                    //   >
                                    //     Pickup Order
                                    //   </Typography>
                                    // </Box>
                                  )}
                                  <Box
                                    sx={{
                                      px: 2,
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}>
                                    <Typography variant='body2'>
                                      <Typography
                                        variant='body2'
                                        component='span'
                                        sx={{
                                          fontWeight: "bold",
                                        }}>
                                        {order?.pickUpAction
                                          ? "Pickup Address:"
                                          : "Address:"}
                                      </Typography>{" "}
                                      {order?.address?.raw || order?.address}
                                    </Typography>
                                  </Box>

                                  {!isExpanded && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        mt: 1,
                                        mb: 2,
                                        position: "relative",
                                      }}>
                                      {/* "Show More" button centered */}
                                      <Button
                                        variant='text'
                                        onClick={() =>
                                          handleToggleExpand(order.id)
                                        }
                                        size='small'
                                        sx={{
                                          fontWeight: "bold",
                                          fontSize: "10px",
                                        }}>
                                        Show More
                                      </Button>

                                      {/* <Box
                                        sx={{
                                          position: "absolute",
                                          right: 4, 
                                        }}
                                      >
                                        <IconButton
                                          sx={{
                                            borderRadius: "50%", 
                                            padding: 1,
                                            mt: 2,
                                            backgroundColor: "#ECAB21",
                                            color: "white",
                                            marginTop: "0.5rem",
                                            fontWeight: "bold",
                                            "&:hover": {
                                              backgroundColor: "#FFC107",
                                              color: "white",
                                            },
                                          }}
                                          onClick={handleNotesClick}
                                        >
                                          <DescriptionIcon />
                                        </IconButton>
                                      </Box> */}
                                    </Box>
                                  )}
                                  {/* {showStickyNote && (
                                    <Paper
                                      elevation={3}
                                      sx={{
                                        position: "absolute",
                                        top: stickyNotePosition.top,
                                        left: stickyNotePosition.left,
                                        width: "300px",
                                        padding: "10px",
                                        backgroundColor: "#fffbcc",
                                        zIndex: 1000,
                                        borderRadius: "10px",
                                      }}
                                    >
                                      <IconButton
                                        onClick={handleCloseNote}
                                        sx={{
                                          position: "absolute",
                                          top: 5,
                                          right: 5,
                                          backgroundColor: "#fffbcc",
                                          "&:hover": {
                                            backgroundColor: "#fffbcc",
                                          },
                                        }}
                                      >
                                        <CloseIcon />
                                      </IconButton>

                                      <Typography variant="h6" sx={{ mb: 1 }}>
                                        Untitled Note
                                      </Typography>

                                      <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="standard"
                                        placeholder="Write your notes here..."
                                        value={noteText}
                                        onChange={(e) =>
                                          setNoteText(e.target.value)
                                        }
                                        InputProps={{
                                          disableUnderline: true,
                                        }}
                                        sx={{
                                          mb: 1,
                                          backgroundColor: "#fffbcc",
                                          padding: "5px",
                                        }}
                                      />

                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "center",
                                          mt: 2,
                                        }}
                                      >
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={handleSaveNote}
                                          sx={{
                                            borderRadius: "10px",
                                            padding: 1,
                                            mt: 2,
                                            backgroundColor: "#ECAB21",
                                            color: "white",
                                            marginTop: "0.5rem",
                                            fontWeight: "bold",
                                            "&:hover": {
                                              backgroundColor: "#FFC107",
                                              color: "white",
                                            },
                                          }}
                                        >
                                          Save
                                        </Button>
                                      </Box>
                                    </Paper>
                                  )} */}
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
                                          }}>
                                          <Typography
                                            variant='body2'
                                            component='span'
                                            sx={{
                                              fontWeight: "bold",
                                            }}>
                                            Payment Mode:
                                          </Typography>
                                          <Typography
                                            variant='body2'
                                            color='textSecondary'>
                                            {order.paymentMode}
                                          </Typography>
                                        </Box>
                                        <Box
                                          sx={{
                                            px: 2,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                          }}>
                                          <Typography
                                            variant='body2'
                                            component='span'
                                            sx={{
                                              fontWeight: "bold",
                                            }}>
                                            Source:
                                          </Typography>
                                          <Typography
                                            variant='body2'
                                            color='textSecondary'>
                                            {order.source}
                                          </Typography>
                                        </Box>
                                      </Box>
                                      <Box>
                                        {/* <Divider sx={{ my: 1 }} />
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
                                        </Box> */}
                                      </Box>
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
                                            component='span'
                                            sx={{
                                              fontWeight: "bold",
                                            }}>
                                            Delivery Charges:
                                          </Typography>
                                          <Typography
                                            variant='body2'
                                            color='textSecondary'>
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
                                          }}>
                                          <Typography
                                            variant='body2'
                                            component='span'
                                            sx={{
                                              fontWeight: "bold",
                                            }}>
                                            Total Tax:
                                          </Typography>
                                          <Typography
                                            variant='body2'
                                            color='textSecondary'>
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
                                          }}>
                                          <Typography
                                            variant='body2'
                                            component='span'
                                            sx={{
                                              fontWeight: "bold",
                                            }}>
                                            Total:
                                          </Typography>
                                          <Typography
                                            variant='body2'
                                            color='textSecondary'>
                                            $
                                            {Number(
                                              Number(order?.grand_total) +
                                                Number(
                                                  order.deliverCharge || 0
                                                ) +
                                                Number(order.tip)
                                            ).toFixed(2)}
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
                                            {(container.id === "container-2" ||
                                              container.id ===
                                                "container-3") && (
                                              <>
                                                {!order?.pickUpAction ? (
                                                  <>
                                                    <Button
                                                      onClick={() =>
                                                        handleOpenDialog(
                                                          order.id
                                                        )
                                                      }
                                                      variant='contained'
                                                      sx={{
                                                        backgroundColor:
                                                          "#ECAB21",
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        fontSize: "10px",
                                                        marginTop: 2,
                                                        "&:hover": {
                                                          backgroundColor:
                                                            "white",
                                                          color: "#ECAB21",
                                                        },
                                                      }}>
                                                      Assign Driver
                                                    </Button>
                                                    <Dialog
                                                      open={
                                                        openDialog === order.id
                                                      }
                                                      sx={{ zIndex: "999" }}
                                                      onClose={
                                                        handleCloseDialog
                                                      }
                                                      PaperProps={{
                                                        sx: {
                                                          borderRadius: 4,
                                                          padding: 2,
                                                          minWidth: 400,
                                                        },
                                                      }}>
                                                      <DialogTitle>
                                                        Assign Driver
                                                      </DialogTitle>
                                                      <DialogContent>
                                                        <FormControl
                                                          fullWidth
                                                          variant='outlined'
                                                          sx={{ mt: 2 }}>
                                                          <InputLabel>
                                                            Select Driver
                                                          </InputLabel>
                                                          <Select
                                                            value={
                                                              order.driverId
                                                            }
                                                            onChange={(e) =>
                                                              handleDriverSelect(
                                                                order.id,
                                                                e.target.value
                                                              )
                                                            }
                                                            label='Select Driver'
                                                            fullWidth
                                                            sx={{
                                                              borderRadius: 2,
                                                            }}>
                                                            {drivers.map(
                                                              (driver: any) => (
                                                                <MenuItem
                                                                  key={
                                                                    driver.id
                                                                  }
                                                                  value={
                                                                    driver.id
                                                                  }>
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
                                                          }>
                                                          Cancel
                                                        </Button>
                                                      </DialogActions>
                                                    </Dialog>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Button
                                                      onClick={() =>
                                                        readyForPickUp(
                                                          order.id,
                                                          "Out For Delivery",
                                                          false
                                                        )
                                                      }
                                                      variant='contained'
                                                      sx={{
                                                        backgroundColor:
                                                          "#ECAB21",
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        fontSize: "10px",
                                                        marginTop: 2,
                                                        "&:hover": {
                                                          backgroundColor:
                                                            "white",
                                                          color: "#ECAB21",
                                                        },
                                                      }}>
                                                      Ready For Pickup
                                                    </Button>
                                                  </>
                                                )}
                                              </>
                                            )}
                                            {container.id === "container-2" &&
                                              !order?.pickUpAction && (
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
                                                    variant='contained'
                                                    sx={{
                                                      backgroundColor:
                                                        "#ECAB21",
                                                      color: "white",
                                                      fontWeight: "bold",
                                                      fontSize: "10px",
                                                      marginTop: 2,
                                                      "&:hover": {
                                                        backgroundColor:
                                                          "white",
                                                        color: "#ECAB21",
                                                      },
                                                    }}>
                                                    Out For Delivery
                                                  </Button>
                                                </>
                                              )}
                                            {(container.id === "container-3" ||
                                              container.id ===
                                                "container-7") && (
                                              <Typography
                                                variant='body2'
                                                color='textSecondary'
                                                sx={{
                                                  display: "flex",
                                                  gap: 1,
                                                }}>
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
                                                    marginTop: 2,
                                                    fontWeight: "bold",
                                                    fontSize: "10px",
                                                    "&:hover": {
                                                      backgroundColor: "white",
                                                      color: "#ECAB21",
                                                    },
                                                  }}>
                                                  Delivered
                                                </Button>
                                              </Typography>
                                            )}
                                            {(container.id === "container-3" ||
                                              container.id === "container-2" ||
                                              container.id ===
                                                "container-7") && (
                                              <Button
                                                onClick={() =>
                                                  cancelOrderStatus(order.id)
                                                }
                                                variant='contained'
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
                                                }}>
                                                Cancel
                                              </Button>
                                            )}
                                            {container.id === "container-5" && (
                                              <Button
                                                onClick={() =>
                                                  orderRefund(order.id)
                                                }
                                                variant='contained'
                                                disabled={order?.refunded}
                                                sx={{
                                                  backgroundColor: "#ECAB21",
                                                  color: "white",
                                                  fontWeight: "bold",
                                                  marginTop: 2,
                                                  fontSize: "10px",
                                                  "&:hover": {
                                                    backgroundColor: "white",
                                                    color: "#ECAB21",
                                                  },
                                                }}>
                                                Refund
                                              </Button>
                                            )}
                                          </Typography>
                                          {(container.id === "container-2" ||
                                            container.id === "container-3") && (
                                            <Typography
                                              component='div'
                                              sx={{ width: "100%" }}>
                                              <Button
                                                fullWidth
                                                onClick={
                                                  () =>
                                                    receiptPrinterHandler(
                                                      String(idy)
                                                    )
                                                  // printReceipt()
                                                }
                                                variant='contained'
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
                                                }}>
                                                <LocalPrintshopIcon />
                                                &nbsp; Print Receipt
                                              </Button>
                                              <div style={{ display: "none" }}>
                                                <PrintComponent
                                                  address={order?.address?.raw}
                                                  time={formatTimestampToCustomDate(
                                                    order.createdAt
                                                  )}
                                                  total={Number(
                                                    Number(order?.grand_total) +
                                                      Number(
                                                        order.deliverCharge || 0
                                                      )
                                                  ).toFixed(2)}
                                                  totalTax={Number(
                                                    order?.total_tax
                                                  ).toFixed(2)}
                                                  deliverCharges={Number(
                                                    order?.deliverCharge || 0
                                                  ).toFixed(2)}
                                                  order={order}
                                                  phone={
                                                    order?.customer?.phoneNumber
                                                  }
                                                  distance={
                                                    order?.address?.distance
                                                      ?.text || ""
                                                  }
                                                  instructions={
                                                    order?.instructions
                                                  }
                                                  name={order?.customer?.name}
                                                  ref={(el) => {
                                                    printRef.current[idy] = el;
                                                  }}
                                                />
                                              </div>
                                            </Typography>
                                          )}
                                        </Box>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            mt: 2,
                                            mb: 1,
                                            position: "relative",
                                          }}>
                                          <Button
                                            variant='text'
                                            onClick={() =>
                                              handleToggleExpand(order.id)
                                            }
                                            size='small'
                                            sx={{
                                              fontWeight: "bold",
                                              fontSize: "10px",
                                            }}>
                                            Show Less
                                          </Button>
                                          {/* 
                                          <Box
                                        sx={{
                                          position: "absolute",
                                          right: 6,
                                          bottom: 0.1,
                                        }}
                                      >
                                        <IconButton
                                          sx={{
                                            borderRadius: "50%", 
                                            padding: 1,
                                            backgroundColor: "#ECAB21",
                                            color: "white",
                                            marginTop: "0.5rem",
                                            fontWeight: "bold",
                                            "&:hover": {
                                              backgroundColor: "#FFC107",
                                              color: "white",
                                            },
                                          }}
                                          onClick={handleNotesClick}
                                        >
                                          <DescriptionIcon />
                                        </IconButton>
                                      </Box> */}
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
