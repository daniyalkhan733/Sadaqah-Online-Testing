import React, { useState } from "react";
import "../../index.css";
import  ProgramsList from "./ProgramsList.jsx";
import  CartData  from "./CartData.jsx";

const  Test = () => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      <ProgramsList  count={cartCount} updateCartCount={setCartCount} />
      <CartData cartCount={cartCount} />
    </>
  );
};
export default Test;

