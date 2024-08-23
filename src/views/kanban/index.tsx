import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
} from "@dnd-kit/core";
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
    { id: `container-1`, title: "Carts" },
    { id: `container-2`, title: "New" },
    { id: `container-3`, title: "Ready for delivery" },
    { id: `container-4`, title: "Delivered" },
    { id: `container-5`, title: "Cancelled" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  return (
    <Box
      className=" w-auto p-5 h-[100%] bg-white no-scrollbar"
      sx={{ overflowY: "hidden", overflowX: "auto" }}
    >
      <DndContext sensors={sensors} collisionDetection={closestCorners}>
        <SortableContext items={containers.map((container) => container.id)}>
          <Box
            display="flex"
            justifyContent="space-evenly"
            gap={2}
            minWidth="1900px"
            marginTop={3}
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
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: "center",
                    padding: 2,
                    backgroundColor: "#3f51b5",
                    color: "#fff",
                  }}
                >
                  {container.title}
                </Typography>
                <SortableContext items={orders.map((order) => order.orderId)}>
                  {orders.map((order) => (
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
                                Order {order.orderId}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {order.date}
                              </Typography>
                            </Box>
                            <Chip
                              label={order.status}
                              color={
                                order.status === "Delivered"
                                  ? "success"
                                  : "warning"
                              }
                              sx={{
                                borderRadius: "50px",
                                textTransform: "none",
                              }}
                            />
                          </Box>

                          {order.items.map((item, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 2,
                              }}
                            >
                              <Avatar
                                src={"/images/landingpage/menu1.png"}
                                sx={{ width: 50, height: 50, mr: 2 }}
                              />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body1">
                                  {item.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {item.addons}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography variant="body1">
                                  {item.price}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Qty: {item.quantity}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </CardContent>
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
                              X{order.items.length} Items
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Box>
                  ))}
                </SortableContext>
              </Box>
            ))}
          </Box>
        </SortableContext>
      </DndContext>
    </Box>
  );
};

export default KanbanBoard;
