export type MenuCategoryKey = "Kulcha" | "Lassi" | "Tea" | "Coffee" | "Soft Drinks";

export interface MenuCategory {
  icon: string;
  label: MenuCategoryKey;
}

export interface MenuItem {
  name: string;
  desc: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}