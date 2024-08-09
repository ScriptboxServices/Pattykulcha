"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface IncludedItem {
  id: string;
  items: Array<{
    name: string;
    price: number;
  }>;
}

interface MenuContextType {
  size: string;
  setSize: (size: string) => void;
  price: number;
  setPrice: (price: number) => void;
  cal: number;
  setCal: (cal: number) => void;
  includedItems: IncludedItem[];
  setIncludedItems: (items: IncludedItem[]) => void;
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
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }
  return context;
};

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [size, setSize] = useState("regular");
  const [price, setPrice] = useState(0);
  const [cal, setCal] = useState(640);
  const [includedItems, setIncludedItems] = useState<IncludedItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [extraItems, setExtraItems] = useState<string[]>([
    "Chana",
    "Impli Pyaz Chutney",
    "Amul Butter",
    "Normal Butter",
    "Pickle"
  ]);
  const [plasticware, setPlasticware] = useState("no");
  const [instructions, setInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [selectedLassis, setSelectedLassis] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getStoredData = (key: string, defaultValue: any) => {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    };

    setSize(getStoredData("size", "regular"));
    setPrice(getStoredData("price", 0));
    setCal(getStoredData("cal", 640));
    setIncludedItems(getStoredData("includedItems", []));
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
  }, []);

  useEffect(() => {
    localStorage.setItem("size", JSON.stringify(size));
    localStorage.setItem("price", JSON.stringify(price));
    localStorage.setItem("cal", JSON.stringify(cal));
    localStorage.setItem("includedItems", JSON.stringify(includedItems));
    localStorage.setItem("quantities", JSON.stringify(quantities));
    localStorage.setItem("extraItems", JSON.stringify(extraItems));
    localStorage.setItem("plasticware", JSON.stringify(plasticware));
    localStorage.setItem("instructions", JSON.stringify(instructions));
    localStorage.setItem("quantity", JSON.stringify(quantity));
    localStorage.setItem("selectedDrinks", JSON.stringify(selectedDrinks));
    localStorage.setItem("selectedLassis", JSON.stringify(selectedLassis));
    localStorage.setItem("total", JSON.stringify(total));
  }, [
    size,
    price,
    cal,
    includedItems,
    quantities,
    extraItems,
    plasticware,
    instructions,
    quantity,
    selectedDrinks,
    selectedLassis,
    total,
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
    includedItems,
    setIncludedItems,
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
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
