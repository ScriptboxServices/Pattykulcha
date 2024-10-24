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
  onSnapshot
} from "firebase/firestore";
import { db } from "@/firebase";
import { drinkOptions, extraItemsOptions, menuItems } from "@/constants/MenuOptions";

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
  quantities: { [key: string]: number };
  setQuantityForItem: (itemName: string, quantity: number) => void;
  extraItems: any[];
  setExtraItems: any;
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
  totalTax: string | number;
  setTotalTax: React.Dispatch<React.SetStateAction<string | number>>;
  isAddressReachable: boolean;
  setIsAddressReachable: React.Dispatch<React.SetStateAction<boolean>>;
  otherKulchas : any[];
  setOtherKulchas : any;
  allDrinks : any[];
  setAllDrinks : any;
}

interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  metaData: any;
  setMetaData: any;
  setKitchenMetaData: any;
  kitchenMetaData: any;
  driverMetaData : any;
  allKitchens : any,
  kitchenProfile : any
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
  const delivery_charges = distance > 3000 ? ((distance / 1000 ) * 0.90) > 8 ? 8 : ((distance / 1000 ) * 0.90) : 3.99
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
  let taxSum = 0
  const grandTotal = carts?.reduce((acc, item) => {
    const { order } = item;
    const { kulcha, additional } = order;
    const total = additional?.reduce((acc: any, value: any) => {
      return (acc =
        acc +
        Number(value?.items?.[0]?.price) * Number(value?.items?.[0]?.quantity));
    }, Number(kulcha?.price) * Number(kulcha?.quantity));
    let tax = Number(total) * 0.13;
    taxSum = taxSum + Number(total) * 0.13
    return (acc = acc + (Number(total) + Number(tax)));
  }, 0);

  return {total :  Number(grandTotal).toFixed(2),tax : Number(taxSum).toFixed(2)};
};
interface AuthProps {
  children: ReactNode;
}

export const getNearestKitchen = async (addr : any,allKitchens : any) => {
  return new Promise(async(resolve,reject) => {
    try{
      let sortedKitchen = [] 
      for(let addr_ of allKitchens){
        const kitchen = await calculateDistance(addr?.raw, addr_?.address?.raw, Number(addr_?.orderRange))
        sortedKitchen.push({
          kitchen : addr_,
          data : kitchen
        })
      }
      sortedKitchen?.sort((a : any,b : any) => a.data.distance.value - b.data.distance.value)
      resolve(sortedKitchen[0])
    }catch(err) {
      reject(err)
    }
  })
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
  const [kitchenProfile, setKitchenProfile] = useState<object | null>(null);
  const [allKitchens, setAllKitchens] = useState<any[] | null>(null);
  const [driverMetaData, setDriverMetaData] = useState<object | null>(null);

  // console.log = () => {}

  useEffect(() => {
    if(user){
      let unsubscribeKitchen : any = undefined;
      let unsubscribeDriver : any = undefined;
      let unsubscribeAllKitchen : any = undefined;

      unsubscribeAllKitchen = onSnapshot(collection(db,'foodtrucks'),(snapshot_) => {
        let arr : any[] = []
        snapshot_.forEach((doc) => {
          arr.push({
            id: doc.id,
            ...doc.data(),
          });
        })
        setAllKitchens([...arr])
      })

      if(metaData?.isKitchen){
        const kitchenRef = doc(db, "foodtrucks",metaData?.foodTruckId);
        unsubscribeKitchen = onSnapshot(kitchenRef, (snapshot) => {
          if (snapshot.exists()) {
            setKitchenProfile({
              id: snapshot.id,
              ...snapshot.data(),
            });
          } else {
            setKitchenProfile(null);
          }
        }); 
      }

      if(metaData?.isDriver){
        const driverRef = doc(db, "drivers", metaData?.driverId);
        unsubscribeDriver = onSnapshot(driverRef, (snapshot) => {
          if (snapshot.exists()) {
            setDriverMetaData({
              id: snapshot.id,
              ...snapshot.data(),
            });

          } else {
            setDriverMetaData(null);
          }
        });
      }
      return () => {
        if(unsubscribeKitchen){
          unsubscribeKitchen();
        }  

        if(unsubscribeDriver){
          unsubscribeDriver()
        }

        if(unsubscribeAllKitchen){
          unsubscribeAllKitchen()
        }
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
      value={{ user, isLoggedIn, metaData, setMetaData, kitchenMetaData,driverMetaData,allKitchens,setKitchenMetaData, kitchenProfile }}>
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
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [extraItems, setExtraItems] = useState<any[]>([...extraItemsOptions]);
  const [plasticware, setPlasticware] = useState("no");
  const [quantity, setQuantity] = useState(1);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [selectedLassis, setSelectedLassis] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [instructions, setInstructions] = useState("");
  const [count, setCount] = useState(0);
  const [grandTotal, setGrandTotal] = useState<string | number>(0);
  const [totalTax, setTotalTax] = useState<string | number>(0);
  const [otherKulchas, setOtherKulchas] = useState<any[]>([...menuItems]);
  const [allDrinks, setAllDrinks] = useState<any[]>([...drinkOptions]);

  const getData = async (_id: string) => {
    if (_id) {
      const result = await getCartData(_id);
      if (result) {
        const {total,tax} = calculateGrandTotal(result || [])
        setGrandTotal(total);
        setTotalTax(tax)
        setCarts([...result])
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
    setOtherKulchas(getStoredData("otherKulchas", [...menuItems]));
    setAllDrinks(getStoredData("drinks", [...drinkOptions]));
    setExtraItems(getStoredData("extra", [...extraItemsOptions]));
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
    totalTax,
    setTotalTax,
    setIsAddressReachable,
    isAddressReachable,
    setOtherKulchas,
    otherKulchas,
    allDrinks,
    setAllDrinks
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};