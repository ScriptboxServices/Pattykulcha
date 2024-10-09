import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Autocomplete,
  Grid,
  InputAdornment,
  Typography,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { countries } from "@/utils/constants";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CountryType } from "@/context/types";
import Image from "next/image";
import { db } from "@/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import CircularLodar from "@/components/CircularLodar";
import { useTheme } from "@mui/material/styles";
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
  formatTimestampToCustomDate,
  ShortTime,
} from "@/utils/commonFunctions";
import { KeyboardArrowRight, KeyboardArrowLeft } from "@mui/icons-material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  countryCode: yup.mixed<CountryType>().required(),
});

type IFormInput = yup.InferType<typeof schema>;

const PastOrders: React.FC = () => {
  const [searchPhoneNumber, setSearchPhoneNumber] = useState<string>("");

  const handleSearch = () => {
    console.log(`Searching for phone number: ${searchPhoneNumber}`);
  };

  const [userData, setUserData] = useState<any>(null);

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: countries.find((country) => country.label === "Canada"),
      phoneNumber: "",
    },
  });

  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allOrders, setAllOrders] = useState<any>([]);
  const [filteredRows, setFilteredRows] = React.useState(allOrders);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;
  const handleFirstPageButtonClick = () => {
    setPage(0);
  };

  const handleBackButtonClick = () => {
    setPage((prevPage) => prevPage - 1);
  };

  useEffect(() => {
    const defaultCountry =
      countries.find((country) => country.label === "Canada") || null;
    setSelectedCountry(defaultCountry);
  }, []);

  const checkUsers = async (value: any) => {
    if (value?.length === 10) {
      const colRef = collection(db, "users");
      const q = query(
        colRef,
        where("phoneNumber", "==", `+${selectedCountry?.phone}${value}`)
      );
      const user = await getDocs(q);
      let userDoc: any;
      if (user.size > 0) {
        user.forEach((doc) => {
          userDoc = {
            id: doc.id,
            ...doc.data(),
          };
        });
        setUserData(userDoc);
      } else {
        setUserData(null);
      }
    }
  };

  const getAllOrders = async (value: any) => {
    setAllOrders([]);
    const orderColRef = collection(db, "orders");
    const ordersQuery = query(
      orderColRef,
      where("customer.phoneNumber", "==", `+${selectedCountry?.phone}${value}`)
    );
    const ordersSnapshot = await getDocs(ordersQuery);

    let arr: any = [];
    if (ordersSnapshot.size > 0) {
      ordersSnapshot.forEach((doc) => {
        arr.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setAllOrders([...arr]);
      setFilteredRows([...arr]);
    }
  };

  const handleChangePage = (
    event: any,
    newPage: React.SetStateAction<number>
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleNextButtonClick = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleLastPageButtonClick = () => {
    setPage(Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1));
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='flex-start'
      padding={2}
      width='100%'
      height='auto'
      bgcolor='white'>
      <CircularLodar isLoading={loading} />
      <Grid
        container
        spacing={2}
        alignItems='center'
        justifyContent='flex-start'
        marginTop={3}>
        <Grid item xs={12} md={3}>
          <Controller
            name='countryCode'
            control={control}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                id='country-select-demo'
                fullWidth
                options={countries}
                autoHighlight
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box
                      key={key}
                      component='li'
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...optionProps}>
                      <Image
                        loading='lazy'
                        width={20}
                        height={15}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt={`${option.label} flag`}
                      />
                      {option.label} ({option.code}) +{option.phone}
                    </Box>
                  );
                }}
                value={selectedCountry}
                onChange={(event, newValue) => {
                  onChange(newValue);
                  setSelectedCountry(newValue || (null as any));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Country Code'
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: selectedCountry && (
                        <InputAdornment position='start'>
                          <Image
                            loading='eager'
                            width={20}
                            height={15}
                            src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                            priority
                            alt='#'
                          />
                          <Typography sx={{ ml: 1 }}>
                            +{selectedCountry.phone}
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name='phoneNumber'
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                required
                fullWidth
                type='tel'
                label='Phone Number'
                placeholder='(123)-456-7890'
                value={value}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message ?? ""}
                onChange={(e) => {
                  onChange(e);
                }}
                inputProps={{
                  maxLength: 10,
                  pattern: "[0-9]*",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <i className='ri-phone-fill' />
                    </InputAdornment>
                  ),
                }}
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            )}
          />
        </Grid>
        <Button
          onClick={async () => {
            setLoading(true);
            await Promise.all([
              checkUsers(getValues("phoneNumber")),
              getAllOrders(getValues("phoneNumber")),
            ]);
            setLoading(false);
          }}
          sx={{
            backgroundColor: "#ECAB21",
            color: "white",
            paddingX: 4,
            paddingY: 1,
            mt: 2,
            ml: 2,

            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#FFC107",
              color: "white",
            },
          }}>
          Search
        </Button>
      </Grid>
      <Box
        sx={{
          display: "flex",
          height: "300px",
          overflowX: "auto",
          minHeight: "300px",
          padding: 2,
          width: "100%",
        }}>
        <DndContext sensors={sensors} collisionDetection={closestCorners}>
          <SortableContext items={["container-1"]}>
            <Box
              display='flex'
              justifyContent='center'
              alignItems='flex-start'
              flexWrap='wrap'
              width='100%'
              marginTop={1}>
              <Box
                key='container-1'
                sx={{
                  flex: "1 1 auto",
                  minWidth: "280px",
                  height: "90%",
                  overflowY: "hidden",
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                }}>
                <Box sx={{ display: "flex", backgroundColor: "#ECAB21" }}>
                  <Typography
                    variant='h6'
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      backgroundColor: "#ECAB21",
                      color: "#fff",
                      textAlign: "center",
                      marginInline: "auto",
                      padding: 2,
                      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                      fontWeight: "bold",
                    }}>
                    User Details
                  </Typography>
                </Box>
                <SortableContext items={[]}>
                  <Grid container spacing={2} padding={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box
                        sx={{
                          borderRadius: 2,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: "90%",
                          backgroundColor: "#fff",
                        }}>
                        {userData ? (
                          <CardContent>
                            <Typography
                              variant='subtitle1'
                              sx={{ fontWeight: "bold" }}>
                              Name: {userData?.name}
                            </Typography>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                color: "black",
                              }}>
                              <b>Phone Number:</b> {userData?.phoneNumber}
                            </Typography>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                color: "black",
                              }}>
                              <b>Address:</b> {userData?.address?.raw}
                            </Typography>
                          </CardContent>
                        ) : (
                          <CardContent>
                            <Typography
                              variant='subtitle1'
                              sx={{ fontWeight: "bold" }}>
                              User Details not fount or user not exist.
                            </Typography>
                          </CardContent>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </SortableContext>{" "}
                :
              </Box>
            </Box>
          </SortableContext>
        </DndContext>
      </Box>
      {allOrders.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 2,
              gap: 2,
            }}>
            <Typography variant='h5' sx={{ fontWeight: "bold", pl: 2 }}>
              Past orders
            </Typography>
          </Box>

          <Table
            sx={{ minWidth: "500px" }}
            aria-label='custom pagination table'>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    paddingY: 2,
                    backgroundColor: "#f5f5f5",
                    borderBottom: "2px solid #dcdcdc",
                  }}>
                  Order Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    paddingY: 2,
                    backgroundColor: "#f5f5f5",
                    borderBottom: "2px solid #dcdcdc",
                  }}>
                  Add-on
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    paddingY: 2,
                    backgroundColor: "#f5f5f5",
                    borderBottom: "2px solid #dcdcdc",
                  }}>
                  Date & Time
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    paddingY: 2,
                    backgroundColor: "#f5f5f5",
                    borderBottom: "2px solid #dcdcdc",
                  }}>
                  Address
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    paddingY: 2,
                    backgroundColor: "#f5f5f5",
                    borderBottom: "2px solid #dcdcdc",
                  }}>
                  Payment
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    paddingY: 2,
                    backgroundColor: "#f5f5f5",
                    borderBottom: "2px solid #dcdcdc",
                  }}>
                  Delivered by
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    paddingY: 2,
                    backgroundColor: "#f5f5f5",
                    borderBottom: "2px solid #dcdcdc",
                  }}>
                  Total Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredRows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredRows
              ).map((row: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    {row?.order?.map((item: any) => (
                      <div key={item._id}>
                        {item.order.kulcha.name} <br />
                      </div>
                    ))}
                  </TableCell>

                  <TableCell sx={{ paddingY: 2 }}>
                    {row?.order?.map((item: any) => (
                      <div key={item._id}>
                        {item.order.additional.map((addon: any) =>
                          addon.items.map((addonItem: any, i: number) => (
                            <span key={i}>{addonItem.name}, </span>
                          ))
                        )}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell sx={{ paddingY: 2 }}>
                    {formatTimestampToCustomDate(row.createdAt)}
                  </TableCell>
                  <TableCell sx={{ paddingY: 2 }}>{row.address.raw}</TableCell>
                  <TableCell sx={{ paddingY: 2 }}>{row.paymentMode}</TableCell>
                  <TableCell sx={{ paddingY: 2 }}>{row.driverName}</TableCell>
                  <TableCell sx={{ paddingY: 2 }}>${row.grand_total}</TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={7}
                  count={filteredRows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={() => (
                    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
                      <IconButton
                        onClick={handleFirstPageButtonClick}
                        disabled={page == 0}
                        aria-label='first page'>
                        {theme.direction == "rtl" ? (
                          <LastPageIcon />
                        ) : (
                          <FirstPageIcon />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={handleBackButtonClick}
                        disabled={page == 0}
                        aria-label='previous page'>
                        {theme.direction == "rtl" ? (
                          <KeyboardArrowRight />
                        ) : (
                          <KeyboardArrowLeft />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={handleNextButtonClick}
                        disabled={
                          page >=
                          Math.ceil(filteredRows.length / rowsPerPage) - 1
                        }
                        aria-label='next page'>
                        {theme.direction == "rtl" ? (
                          <KeyboardArrowLeft />
                        ) : (
                          <KeyboardArrowRight />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={handleLastPageButtonClick}
                        disabled={
                          page >=
                          Math.ceil(filteredRows.length / rowsPerPage) - 1
                        }
                        aria-label='last page'>
                        {theme.direction == "rtl" ? (
                          <FirstPageIcon />
                        ) : (
                          <LastPageIcon />
                        )}
                      </IconButton>
                    </Box>
                  )}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </>
      )}
    </Box>
  );
};

export default PastOrders;
