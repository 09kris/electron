import './App.css';
import Header from './assets/Components/Header';
import { Route, Routes } from 'react-router-dom';
import Register from '../public/USER/Register';
import { UserProvider } from './context/UserContext';
import AddCategory from '../public/Admin/AddCateogory';
import Login from '../public/USER/Login';
import Home from '../public/USER/Home';
import AdminLogin from '../public/Admin/Login';
import SellerRegister from '../public/Seller/SellerRegister';
import SellerLogin from '../public/Seller/SellerLogin';
import SellerAllOrders from '../public/Seller/SellerAllOrders';
import AddProduct from '../public/Seller/AddProduct';
import DirectOrder from '../public/Orders/DirectOrder';
import CartPage from '../public/USER/CartPage';
import PaymentPage from '../public/USER/CheckOut';
function App() {
  return (
    <>
    <UserProvider>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/addCategory" element={<AddCategory />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/seller/register" element={<SellerRegister />} />
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path='/seller/orders' element={<SellerAllOrders/>}/>
        <Route path='/seller/addProduct' element={<AddProduct/>}/>
        <Route path='/order/:productId' element={<DirectOrder/>}/>
        <Route path='/checkout' element={<PaymentPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Add more routes as needed */}
      </Routes>
      </UserProvider>
    </>
  );
}

export default App;
