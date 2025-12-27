import React from "react";
import Header from "./components/Header.jsx";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import About from "./pages/About.jsx";
import Categories from "./pages/Categories.jsx";
import Contact from "./pages/Contact.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import Faqs from "./pages/Faqs.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx"
import RefundPolicy from "./pages/RefundPolicy.jsx"
import TermsofServices from "./pages/TermsofServices.jsx"
import Footer from "./components/Footer";
import Signin from "./pages/SignIn.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import OTPVerification from "./components/OTPVerification.jsx";
import Cart from "./components/cart.jsx";
import Shipping from "./components/shippingDetails.jsx"
import PaymentMethod from "./components/paymentMethod.jsx"
import MyOrders from "./pages/MyOrders.jsx"
import MyProfile from "./components/MyProfile.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import NotFound from "./components/NotFound.jsx";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "Rs. ";


function App() {
  return (
    <>
      <div>
        <AuthProvider>
        <CartProvider>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/trackorder/:orderId" element={<TrackOrder />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/refundpolicy" element={<RefundPolicy />} />
          <Route path="/termsofservices" element={<TermsofServices />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/verify" element={<OTPVerification />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<PaymentMethod />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <Footer />
        </CartProvider>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
