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

export interface AvailabilityState {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
}

export interface FormValues {
  permitType: string;
  licenseType: string;
  drivingLicense: File | null;
  carInsurance: File | null;
  availability:  {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  acceptedTerms: boolean;
}
