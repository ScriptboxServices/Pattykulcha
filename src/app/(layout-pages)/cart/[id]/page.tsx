
import MenuPage from "@/views/cart";
import React from "react";
import { decrypt } from '@/utils/commonFunctions';
import { menuItems } from "@/constants/MenuOptions";

const CartPage = ({params} : {params : any}) => {

  const { id } = params
  const {kulcha_name} = decrypt(decodeURIComponent(id))

  const filterKulcha =  menuItems.filter((kulcha) => kulcha.name?.toLocaleLowerCase() === kulcha_name?.toLocaleLowerCase())[0]

  return (
    <>
      <MenuPage _kulcha= {filterKulcha} />
    </>
  );
};

export default CartPage;
