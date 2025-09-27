import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DirectOrder = () => {
  const [product, setProduct] = useState();
  const { productId } = useParams(); // Get the param from URL
 const fatchProduct=async (productId)=>{
    console.log("Product ID from params:", productId);

    const res= await axios.get(`http://localhost:8000/product/${productId}`, {
      withCredentials: true,
    })
    console.log("res=",res.data.data);
    

    setProduct(res.data.data);
  }
  useEffect(() => {
    // You could fetch data from server here using productId
    fatchProduct(productId)
  }, [productId]);

 

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {product ? (
        product._id
      ):"Loading...."}

    </div>
  );
};

export default DirectOrder;
