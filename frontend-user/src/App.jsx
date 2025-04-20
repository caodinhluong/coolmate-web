import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/index.css'
import Login from './pages/LoginPage.jsx'
import Home from './pages/HomePage.jsx'
import Register from './pages/RegisterPage.jsx'
import Profile from './pages/ProfilePage.jsx'
import NamNavBar from './pages/NamNavBarPage.jsx'
import NuNavBar from './pages/NuNavBarPage.jsx'
import AllProductPage from './pages/AllProductPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import PayMentPage from './pages/PayMentPage';

function App() {
  console.log('App is rendering');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nam-navbar" element={<NamNavBar />} />
        <Route path="/nu-navbar" element={<NuNavBar />} />
        <Route path="/cart" element={<PayMentPage />} />
        <Route path="/all-product" element={<AllProductPage />} />
        <Route path="/product-detail/:id" element={<ProductDetailPage />} />        {/* Optional: Thêm route mặc định */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;