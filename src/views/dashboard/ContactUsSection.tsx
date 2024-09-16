"use client";

import React, { useState } from "react";
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
import { Box, Card, CardContent, Typography } from "@mui/material";

const ContactUsection = () => {
  const [containers] = useState([
    { id: `container-1`, title: "Contact Us section" },
  ]);

  const [customerQueries, setCustomerQueries] = useState([
    {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      message: "Issue with order #12345",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "0987654321",
      message: "Refund request for order #23456",
    },
    {
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex.johnson@example.com",
      phone: "1122334455",
      message: "Late delivery of order #34567",
    },
    {
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@example.com",
      phone: "2233445566",
      message: "Incorrect item received in order #45678",
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "white",
        overflow: "hidden",
        mt: 10,
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 2, pl: 3, pt: 2 }}
        >
          Customer Support
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          height: "calc(100vh - 64px)",
          overflowX: "auto",
          padding: 2,
        }}
      >
        <DndContext sensors={sensors} collisionDetection={closestCorners}>
          <SortableContext items={containers.map((container) => container.id)}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="flex-start"
              flexWrap="wrap"
              gap={2}
              width="100%"
              marginTop={1}
            >
              {containers.map((container) => (
                <Box
                  key={container.id}
                  sx={{
                    flex: "1 1 calc(33.333% - 16px)",
                    height: "100%",
                    overflowY: "auto",
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#ECAB21",
                      flexShrink: 0,
                      border: "none",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#fff",
                        textAlign: "center",
                        padding: 2,
                        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      {container.title}
                    </Typography>
                  </Box>
                  <SortableContext items={[]}>
                    {container.id === "container-1" && (
                      <Box sx={{ padding: 2, flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            gap: 2,
                          }}
                        >
                          {customerQueries.map((customer, index) => (
                            <Card
                              key={index}
                              sx={{
                                width: "calc(33.333% - 16px)",
                                marginBottom: 2,
                                borderRadius: 2,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <CardContent>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    Customer Name: {customer.firstName}{" "}
                                    {customer.lastName}
                                  </Typography>

                                  <Typography
                                    variant="body2"
                                    sx={{ marginTop: 1 }}
                                  >
                                    Email: {customer.email}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ marginTop: 1 }}
                                  >
                                    Phone: {customer.phone}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      mt: 2,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{ marginTop: 1 }}
                                    >
                                      Message: {customer.message}
                                    </Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Box>
                      </Box>
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

export default ContactUsection;
