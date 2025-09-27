import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [netBankingOption, setNetBankingOption] = useState('');
  const [productsPrice, setProductsPrice] = useState([])

  const location = useLocation();
  const productIds = location.state?.productIds || [];

  // console.log("Received Product IDs:", productIds);

  const fatchProduct = async () => {
    try {
      console.log("productIds=", productIds);

      const res = await axios.get(`http://localhost:8000/product/getProduct/${productIds}`);

      console.log(res.data.data);
      setProductsPrice(res.data.data);

    } catch (error) {

      console.error("error", error);

    }
  }

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await fatchProduct();
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full text-sm text-gray-800 flex justify-center items-start p-6 space-x-4 bg-gray-100">
      {/* Payment Method Section */}
      <div className="w-3/4 bg-white shadow rounded p-6 space-y-4">
        {/* Delivery Info */}
        <div>
          <h3 className="text-lg font-semibold">Delivering to Kris Heruwala</h3>
          <p>Sastrinagar sosity near axis bank Deesa, Deesa, DEESA, GUJARAT, 385535, India</p>
          <a href="#" className="text-blue-600 text-sm underline">Add delivery instructions</a>
        </div>

        <div className='px-20'>
          <h3 className="text-lg font-semibold">Payment method</h3>

          {/* Amazon Pay Balance */}
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" onChange={() => setPaymentMethod('amazonPay')} />
            <span>Use your ₹20.00 Amazon Pay Balance</span>
          </label>
          <p className="text-xs text-gray-500 pl-6">
            Insufficient balance. <a href="#" className="text-blue-600 underline">Add money & get rewarded</a>
          </p>
        </div>

        {/* Credit & Debit Cards */}
        <div>
          <h4 className="font-medium">CREDIT & DEBIT CARDS</h4>
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" onChange={() => setPaymentMethod('card')} />
            <span>Canara Bank Debit card ending in 3374 (Kris Heruwala)</span>
          </label>
        </div>

        {/* UPI */}
        <div>
          <h4 className="font-medium">UPI</h4>
          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" onChange={() => setPaymentMethod('upi')} />
            <span>Amazon Pay L***P (Canara Bank ••••5880)</span>
          </label>
        </div>

        {/* Other Payment Methods */}
        <div>
          <h4 className="font-medium">Another payment method</h4>

          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" onChange={() => setPaymentMethod('newCard')} />
            <span>Credit or debit card</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" onChange={() => setPaymentMethod('netBanking')} />
            <span>Net Banking</span>
          </label>

          {paymentMethod === 'netBanking' && (
            <select
              onChange={(e) => setNetBankingOption(e.target.value)}
              className="ml-6 mt-2 border border-gray-300 rounded p-1"
            >
              <option>Choose an Option</option>
              <option value="sbi">SBI</option>
              <option value="hdfc">HDFC</option>
              <option value="icici">ICICI</option>
            </select>
          )}

          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" onChange={() => setPaymentMethod('otherUpi')} />
            <span>Other UPI Apps</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="radio" name="payment" onChange={() => setPaymentMethod('cod')} />
            <span>Cash on Delivery/Pay on Delivery</span>
          </label>
        </div>

        <button className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded">
          Use this payment method
        </button>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow rounded p-6">
        <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
        <div className="space-y-1">
          <p>Items: ₹{productsPrice}</p>
          <p>Delivery: ₹40.00</p>
          <p>Total: ₹{productsPrice + 40}</p>
          <p>
            Promotion Applied:{" "}
            {productsPrice > 500 ? "₹50 OFF applied" : "No promotions applied"}
          </p>
          <h3 className="text-xl font-bold mt-2">
            Order Total: ₹{productsPrice + 40}
          </h3>
        </div>
      </div>

    </div>
  );
};

export default PaymentPage;
