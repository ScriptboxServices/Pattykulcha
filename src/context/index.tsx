"use client";

import { auth } from "@/firebase";
import { ConfirmationResult } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  collection,
  query,
  getDocs,
  where,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";
import { menuItems } from "@/constants/MenuOptions";

export interface IncludedItem {
  id: string;
  items: Array<{
    name: string;
    price: number;
  }>;
}

export interface Kulcha {
  name: string;
  desc: string;
  image: string;
  price: number;
  quantity: number;
}

export const FIXED_INCLUDE_ITEMS = [
  {
    id: "chana",
    items: [{ name: "Chana", price: 1.5 }],
  },
  {
    id: "imli-pyaz-chutney",
    items: [{ name: "Imli Pyaz Chutney", price: 1.5 }],
  },
  {
    id: "amul-butter",
    items: [{ name: "Butter", price: 1.5 }],
  },
];

interface MenuContextType {
  price: number;
  setPrice: (price: number) => void;
  cal: number;
  setCal: (cal: number) => void;
  selectedkulchas: Kulcha[];
  setSelectedKulchas: any;
  includedItems1: any[];
  setIncludedItems1: (items: any[]) => void;
  includedItems2: any[];
  setIncludedItems2: (items: any[]) => void;
  quantities: { [key: string]: number };
  setQuantityForItem: (itemName: string, quantity: number) => void;
  extraItems: string[];
  setExtraItems: (items: string[]) => void;
  plasticware: string;
  setPlasticware: (plasticware: string) => void;
  instructions: string;
  setInstructions: (instructions: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  selectedDrinks: string[];
  setSelectedDrinks: (drinks: string[]) => void;
  selectedLassis: string[];
  setSelectedLassis: (lassis: string[]) => void;
  total: number;
  setTotal: (total: number) => void;
  count: number; // New property
  setCount: (count: number) => void; // New setter
  confirmationResult: ConfirmationResult | null;
  setConfirmationResult: any;
  kulcha: any;
  setKulcha: any;
  setCarts: any;
  carts: any[];
  grandTotal: string | number;
  setGrandTotal: React.Dispatch<React.SetStateAction<string | number>>;
  isAddressReachable: boolean;
  setIsAddressReachable: React.Dispatch<React.SetStateAction<boolean>>;
  setOtherKulchas : any;
  otherKulchas : any;
}

interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  metaData: any;
  setMetaData: any;
  kitchenMetaData: any;
  driverMetaData : any
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);
const AuthContext = createContext<AuthContextType | null>(null);

export const KITCHEN_ID: string = "0bXJJJIHMgu5MNGSArY2";
export const DRIVER_ID: string = "Lh5ZrEoZo2kDG0rViY0Y";

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }
  return context;
};

export const calculateDeliveryCharges = (distance : number) => {
  const delivery_charges = distance > 3000 ? ((distance / 1000 ) * 0.70) > 6 ? 6 : ((distance / 1000 ) * 0.70) : 0  
  return Number(delivery_charges)
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth must be used within a MenuProvider");
  }
  return context;
};
export const getCartData = async (_id: string) => {
  try {
    let raw: any = [];
    const colRef = collection(db, "carts");
    const q = query(colRef, where("userId", "==", _id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc: any) => {
      let obj: any = {};
      console.log(doc.id, " => ", doc.data());
      obj = {
        id: doc.id,
        ...doc.data(),
      };
      raw.push(obj);
    });
    return raw;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getUserMetaData = async (_id: string) => {
  try {
    const metaData = await getDoc(doc(db, "users", _id));
    return {
      id: metaData.id,
      ...metaData.data(),
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const calculateGrandTotal = (carts: any[]) => {
  const grandTotal = carts?.reduce((acc, item) => {
    const { order } = item;
    const { kulcha, additional } = order;
    const total = additional?.reduce((acc: any, value: any) => {
      return (acc =
        acc +
        Number(value?.items?.[0]?.price) * Number(value?.items?.[0]?.quantity));
    }, Number(kulcha?.price) * Number(kulcha?.quantity));
    let tax = Number(total) * 0.13;
    return (acc = acc + (Number(total) + Number(tax)));
  }, 0);

  return Number(grandTotal).toFixed(2);
};

interface AuthProps {
  children: ReactNode;
}

export const calculateDistance = (source : string , destinations : string,_distance : number) => {
  return new Promise((resolve,reject) => {
    try{
      const service = new google.maps.DistanceMatrixService();
      const request: any = {
        origins: [source],
        destinations: [destinations],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };
      service.getDistanceMatrix(request, (response : any, status: any) => {
        if (status === "OK") {
          const distance = response.rows[0].elements[0].distance;
          if (distance.value > ( _distance * 1000)) {
            resolve({distance,flag : false})
          } else {
            resolve({distance,flag : true})
          }
        } else {
          console.error("Distance failed due to: " + status);
        }
      });
    }catch(err) {
      reject(err)
    }
  })
}

export const AuthProvider: React.FC<AuthProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<object | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<object | null | any>(null);
  const [kitchenMetaData, setKitchenMetaData] = useState<object | null>(null);
  const [driverMetaData, setDriverMetaData] = useState<object | null>(null);

  // console.log = () => {}

  useEffect(() => {
    if(user){
      let unsubscribeKitchen : any;
      let unsubscribeDriver :any;
      if(metaData?.isKitchen){
        const kitchenRef = doc(db, "foodtrucks",metaData?.foodTruckId);
        unsubscribeKitchen = onSnapshot(kitchenRef, (snapshot) => {
          if (snapshot.exists()) {
            setKitchenMetaData({
              id: snapshot.id,
              ...snapshot.data(),
            });
          } else {
            setKitchenMetaData(null);
          }
        }); 
      }

      if(metaData?.isDriver){
        console.log("Call");
        const driverRef = doc(db, "drivers", metaData?.driverId);
        unsubscribeDriver = onSnapshot(driverRef, (snapshot) => {
          if (snapshot.exists()) {
            console.log({
              id: snapshot.id,
              ...snapshot.data(),
            });
            setDriverMetaData({
              id: snapshot.id,
              ...snapshot.data(),
            });

          } else {
        console.log("Not Exist");

            setDriverMetaData(null);
          }
        });
      }
      return () => {
        unsubscribeKitchen();
        unsubscribeDriver()
      };
    }

  }, [user,metaData]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const metaData: any = await getUserMetaData(user.uid);
        setMetaData({
          ...metaData,
        });
        setUser((prev) => user);
        setIsLoggedIn((prev) => true);
        router.push(pathname);
      } else {
        setMetaData(null);
        setUser(null);
        setIsLoggedIn(false);
        router.push("/home");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, metaData, setMetaData, kitchenMetaData,driverMetaData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [price, setPrice] = useState(0);
  const [cal, setCal] = useState(640);
  const [selectedkulchas, setSelectedKulchas] = useState<Kulcha[]>([]);
  const [kulcha, setKulcha] = useState({});
  const [carts, setCarts] = useState<any[]>([]);
  const [isAddressReachable, setIsAddressReachable] = useState<boolean>(false);
  const [includedItems1, setIncludedItems1] = useState<any[]>([
    {
      id: "chana",
      items: [{ name: "Chana", price: 1.5 }],
    },
    {
      id: "imli-pyaz-chutney",
      items: [{ name: "Imli Pyaz Chutney", price: 1.5 }],
    },
    {
      id: "amul-butter",
      items: [{ name: "Butter", price: 1.5 }],
    },
  ]);
  const [includedItems2, setIncludedItems2] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [extraItems, setExtraItems] = useState<string[]>([
    "Chana",
    "Imli Pyaz Chutney",
    "Amul Butter",
    "Normal Butter",
  ]);
  const [plasticware, setPlasticware] = useState("no");
  const [quantity, setQuantity] = useState(1);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [selectedLassis, setSelectedLassis] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [count, setCount] = useState(0);
  const [grandTotal, setGrandTotal] = useState<string | number>(0);
  const [otherKulchas, setOtherKulchas] = useState<any[]>([...menuItems]);

  const getData = async (_id: string) => {
    if (_id) {
      const result = await getCartData(_id);
      if (result) {
        setGrandTotal(calculateGrandTotal(result || []));
        setCarts([...result] || []);
        setCount(result.length);
      }
    }
  };

  useEffect(() => {
    const getStoredData = (key: string, defaultValue: any) => {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    };
    getData(user?.uid);
    setKulcha(getStoredData("kulcha", {}));
    setIncludedItems2(getStoredData("includedItems2", []));
    setOtherKulchas(getStoredData("otherKulchas", [...menuItems]));
    setInstructions(localStorage.getItem("instructions") || "");
  }, [user]);

  const setQuantityForItem = (itemName: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemName]: quantity,
    }));
  };

  const value = {
    price,
    setPrice,
    cal,
    setCal,
    selectedkulchas,
    setSelectedKulchas,
    includedItems1,
    setIncludedItems1,
    includedItems2,
    setIncludedItems2,
    quantities,
    setQuantityForItem,
    extraItems,
    setExtraItems,
    plasticware,
    setPlasticware,
    instructions,
    setInstructions,
    quantity,
    setQuantity,
    selectedDrinks,
    setSelectedDrinks,
    selectedLassis,
    setSelectedLassis,
    total,
    setTotal,
    count, // New property
    setCount, // New setter
    setConfirmationResult,
    confirmationResult,
    kulcha,
    setKulcha,
    setCarts,
    carts,
    grandTotal,
    setGrandTotal,
    setIsAddressReachable,
    isAddressReachable,
    setOtherKulchas,
    otherKulchas
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
