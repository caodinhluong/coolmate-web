import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/index.css'
import Login from './pages/LoginPage.jsx'
import Home from './pages/HomePage.jsx'
import Register from './pages/RegisterPage.jsx'
import NamNavBar from './pages/NamNavBarPage.jsx'
import NuNavBar from './pages/NuNavBarPage.jsx'
import AllProductPage from './pages/AllProductPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import PayMentPage from './pages/PayMentPage';
import TrackOrderPage from './pages/TrackOrderPage.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import ProfilePage from './pages/ProfilePage';
import SportswearPage from './pages/SportswearPage.jsx';
import UnderwearPage from './pages/UnderwearPage.jsx';
import DailywearPage from './pages/DailywearPage.jsx';
import NuSportswearPage from './pages/NuSportswearPage.jsx';
import YogaPage from './pages/YogaPage.jsx';
import NuRunningPage from './pages/NuRunningPage.jsx';




function App() {
  console.log('App is rendering');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/nam-navbar" element={<NamNavBar />} />
        <Route path="/nu-navbar" element={<NuNavBar />} />
        <Route path="/payment" element={<PayMentPage />} />
        <Route path="/all-product" element={<AllProductPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/underwear" element={<UnderwearPage />} />
        <Route path="/dailywear" element={<DailywearPage />} /> 
        <Route path="/sportwear" element={<SportswearPage />} />
        <Route path="/nusportwear" element={<NuSportswearPage />} />
        <Route path="/yoga" element={<YogaPage />} />
        <Route path="/nurunningwear" element={<NuRunningPage />} />

        <Route path="/track-order" element={<TrackOrderPage />} /> 
        <Route path="/product-detail/:id" element={<ProductDetailPage />} />       
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;