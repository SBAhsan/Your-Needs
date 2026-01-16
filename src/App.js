import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import MyOrders from "./pages/MyOrders";
import AdminPanel from "./pages/AdminPanel";
import Web3Provider from "./contexts/Web3Context";

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="App">
          <NavBar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
