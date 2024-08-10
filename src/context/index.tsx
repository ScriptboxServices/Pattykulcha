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
}

interface MenuContextType {
  size: string;
  setSize: (size: string) => void;
  price: number;
  setPrice: (price: number) => void;
  cal: number;
  setCal: (cal: number) => void;
  selectedkulchas: Kulcha[];
  setSelectedKulchas: (kulchas: Kulcha[]) => void;
  includedItems1: IncludedItem[];
  setIncludedItems1: (items: IncludedItem[]) => void;
  includedItems2: IncludedItem[];
  setIncludedItems2: (items: IncludedItem[]) => void;
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
  confirmationResult : ConfirmationResult | null,
  setConfirmationResult :any
}

interface AuthContextType {
  user : any,
  isLoggedIn : boolean
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);
const AuthContext = createContext<AuthContextType | null>(null);

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }
  return context;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth must be used within a MenuProvider");
  }
  return context;
};

export const AuthProvider = ({children} : {children : ReactNode}) => {
  const router  = useRouter()
  const pathname = usePathname()
  const [user,setUser] = useState<object | null>(null)
  const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser((prev) => user);
        setIsLoggedIn((prev) => true);
        router.push(pathname)
      } else {
        setUser(null);
        setIsLoggedIn(false);
        router.push('/login')
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{user,isLoggedIn}}>{children}</AuthContext.Provider>;
}



export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [confirmationResult,setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [size, setSize] = useState("regular");
  const [price, setPrice] = useState(0);
  const [cal, setCal] = useState(640);
  const [selectedkulchas, setSelectedKulchas] = useState<Kulcha[]>([]);
  const [includedItems1, setIncludedItems1] = useState<IncludedItem[]>([
    {
      id: "chana",
      items: [{ name: "Chana", price: 50 }],
    },
    {
      id: "impli-pyaz-chutney",
      items: [{ name: "Impli Pyaz Chutney", price: 60 }],
    },
    {
      id: "amul-butter",
      items: [{ name: "Amul Butter", price: 70 }],
    },
  ]);
  const [includedItems2, setIncludedItems2] = useState<IncludedItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [extraItems, setExtraItems] = useState<string[]>([
    "Chana",
    "Impli Pyaz Chutney",
    "Amul Butter",
    "Normal Butter",
    "Pickle",
  ]);
  const [plasticware, setPlasticware] = useState("no");
  const [instructions, setInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [selectedLassis, setSelectedLassis] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0); // New state

  useEffect(() => {
    const getStoredData = (key: string, defaultValue: any) => {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    };

    setSize(getStoredData("size", "regular"));
    setPrice(getStoredData("price", 0));
    setCal(getStoredData("cal", 640));
    setSelectedKulchas(getStoredData("selectedkulchas", []));
    setIncludedItems1(getStoredData("includedItems1", []));
    setIncludedItems2(getStoredData("includedItems2", []));
    setQuantities(getStoredData("quantities", {}));
    setExtraItems(getStoredData("extraItems", [
      "Chana",
      "Impli Pyaz Chutney",
      "Amul Butter",
      "Normal Butter",
    ]));
    setPlasticware(getStoredData("plasticware", "no"));
    setInstructions(getStoredData("instructions", ""));
    setQuantity(getStoredData("quantity", 1));
    setSelectedDrinks(getStoredData("selectedDrinks", []));
    setSelectedLassis(getStoredData("selectedLassis", []));
    setTotal(getStoredData("total", 0));
    setCount(getStoredData("count", 0)); // New state
  }, []);

  useEffect(() => {
    localStorage.setItem("size", JSON.stringify(size));
    localStorage.setItem("price", JSON.stringify(price));
    localStorage.setItem("cal", JSON.stringify(cal));
    localStorage.setItem("selectedkulchas", JSON.stringify(selectedkulchas));
    localStorage.setItem("includedItems1", JSON.stringify(includedItems1));
    localStorage.setItem("includedItems2", JSON.stringify(includedItems2));
    localStorage.setItem("quantities", JSON.stringify(quantities));
    localStorage.setItem("extraItems", JSON.stringify(extraItems));
    localStorage.setItem("plasticware", JSON.stringify(plasticware));
    localStorage.setItem("instructions", JSON.stringify(instructions));
    localStorage.setItem("quantity", JSON.stringify(quantity));
    localStorage.setItem("selectedDrinks", JSON.stringify(selectedDrinks));
    localStorage.setItem("selectedLassis", JSON.stringify(selectedLassis));
    localStorage.setItem("total", JSON.stringify(total));
    localStorage.setItem("count", JSON.stringify(count)); // New state
  }, [
    size,
    price,
    cal,
    selectedkulchas,
    includedItems1,
    includedItems2,
    quantities,
    extraItems,
    plasticware,
    instructions,
    quantity,
    selectedDrinks,
    selectedLassis,
    total,
    count, // New state
  ]);

  const setQuantityForItem = (itemName: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemName]: quantity,
    }));
  };

  const value = {
    size,
    setSize,
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
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};