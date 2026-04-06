import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./Index";
import CarDetail from "./components/CarDetail";
import Parts from "./components/Parts";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import CustomerService from "./components/CustomerService";

import Booking from "./components/Booking";
import Auth from "./components/Auth";
import SellerDashboard from "./components/SellerDashboard";
import AddCar from "./components/AddCar";
import AddPart from "./components/AddPart";
import Cars from "./components/Cars";
import CarDetailPage from "./components/CarDetailPage";
import RequestPart from "./components/RequestPart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/car-detail/:id" element={<CarDetailPage />} />
        <Route path="/parts" element={<Parts />} />
        <Route path="/request-part" element={<RequestPart />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/support" element={<CustomerService />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/add-car" element={<AddCar />} />
        <Route path="/add-part" element={<AddPart />} />

      </Routes>
    </Router>
  );
}

export default App;