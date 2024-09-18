"use client";

import React, { useEffect, useState } from "react";
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
import { Box, Card, CardContent, Typography, Button, Chip } from "@mui/material";
import { useAuthContext } from "@/context";
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
import { db } from "@/firebase";
import CircularLodar from "@/components/CircularLodar";

const ContactUsection = () => {
  const [containers] = useState([
    { id: `container-1`, title: "Today's Complaint" },
    { id: `container-2`, title: "Inprogress Complaint" },
    { id: `container-3`, title: "Fullfilled Complaint" },
  ]);
  const [contacts, setContacts] = useState<any>([]);
  const [contactsInprogress, setContactsInprogress] = useState<any>([]);
  const [contactsResolved, setContactsResolved] = useState<any>([]);
  const { user, metaData } = useAuthContext();
  const today = new Date();
  const startOfToday = Timestamp.fromDate(new Date(today.setHours(0, 0, 0, 0)));
  const endOfToday = Timestamp.fromDate(
    new Date(today.setHours(23, 59, 59, 999))
  );
  const [customerQueries, setCustomerQueries] = useState<any>({});
    const [loading,setLoading] = useState(false)
  useEffect(() => {
    if (!metaData) return;
    console.log(metaData);
    const contactRef = collection(db, "contactus");
    const q = query(
      contactRef,
      where("foodTruckId", "==", metaData?.foodTruckId),
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday),
      where("track.status", "==", false),
      where("track.message", "==", "Initiate"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeInitiate = onSnapshot(q, (snapshot) => {
      let constact: any[] = [];
      snapshot.forEach((doc) => {
        constact.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setContacts([...constact]);
    });

    const queryProgress = query(
      contactRef,
      where("foodTruckId", "==", metaData?.foodTruckId),
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday),
      where("track.status", "==", false),
      where("track.message", "==", "In Progress"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeInProgress = onSnapshot(queryProgress, (snapshot) => {
      let inprogress: any[] = [];
      snapshot.forEach((doc) => {
        inprogress.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setContactsInprogress([...inprogress]);
    });

    const queryResolved = query(
      contactRef,
      where("foodTruckId", "==", metaData?.foodTruckId),
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday),
      where("track.status", "==", true),
      where("track.message", "==", "Resolved"),
      orderBy("createdAt", "desc")
    );
    const unsubscribeResolved = onSnapshot(queryResolved, (snapshot) => {
      let resolved: any[] = [];
      snapshot.forEach((doc) => {
        resolved.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setContactsResolved([...resolved]);
    });

    return () => {
      unsubscribeInitiate();
      unsubscribeInProgress();
      unsubscribeResolved();
    };
  }, [metaData, user]);

  useEffect(() => {
    setCustomerQueries({
      "container-1": [...contacts],
      "container-2": [...contactsInprogress],
      "container-3": [...contactsResolved],
    });
  }, [contacts, contactsInprogress, contactsResolved]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateComplaintStatus = async (
    _id: string,
    message: string,
    status: boolean
  ) => {
    try{
      setLoading(true)
      const docRef = doc(db,"contactus",_id)
      await updateDoc(docRef,{
        track : {
          status : status,
          message : message
        }
      })
      setLoading(false)
    }catch(err) {
      console.log(err)
      setLoading(false)
    }
  };

  return (
    <>
      <CircularLodar isLoading={loading} />
      <Box
        sx={{
          height: "100vh",
          backgroundColor: "white",
          overflow: "hidden",
          mt: 5,
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
                      {customerQueries[container.id]?.length}
                    </Typography>
                  </Box>
                    <SortableContext items={[]}>
                      {customerQueries[container.id]?.length === 0 ? (
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
                          {customerQueries[container.id]?.map(
                            (complaint: any) => {
                              return (
                                <Card
                                  key={complaint.id}
                                  sx={{
                                    // width: "calc(33.333% - 16px)",
                                    margin: 2,
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
                                      <Chip
                                        label={complaint?.track?.message}
                                        color={
                                          complaint?.track?.status
                                            ? "success"
                                            : "warning"
                                        }
                                        sx={{
                                          borderRadius: "50px",
                                          textTransform: "none",
                                        }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{ fontWeight: "bold",mt:2 }}
                                      >
                                        Name: {complaint?.customer?.name}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{ marginTop: 1 }}
                                      >
                                        Phone: {complaint?.customer?.phoneNumber}
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          mt: 2,
                                        }}
                                      >
                                        <Typography variant="body2">
                                          Message: {complaint?.message}
                                        </Typography>
                                      </Box>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ display: "flex", gap: 1 }}
                                      >
                                        {container.id === "container-1" && (
                                          <>
                                            <Button
                                              onClick={() =>
                                                updateComplaintStatus(
                                                  complaint?.id,
                                                  "In Progress",
                                                  false
                                                )
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
                                              In Progress
                                            </Button>
                                          </>
                                        )}
                                        {container.id === "container-2" && (
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
                                                updateComplaintStatus(
                                                  complaint?.id,
                                                  "Resolved",
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
                                              Resolved
                                            </Button>
                                          </Typography>
                                        )}
                                      </Typography>
                                    </Box>
                                  </CardContent>
                                </Card>
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
    </>
  );
};

export default ContactUsection;
