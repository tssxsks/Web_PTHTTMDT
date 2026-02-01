import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './components/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Add from './pages/Add';
import EditProduct from './pages/EditProduct';
import List from './pages/List';
import Orders from './pages/Orders';
import MainType from './pages/MainType';
import ProductType from './pages/ProductType';
import Brand from './pages/Brand';
import Size from './pages/Size';
import ProductDetail from './pages/ProductDetail';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <LoginComponent
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    );
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar onLogout={handleLogout} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<List />} />
              <Route path="/add-product" element={<Add />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/main-types" element={<MainType />} />
              <Route path="/product-types" element={<ProductType />} />
              <Route path="/brands" element={<Brand />} />
              <Route path="/sizes" element={<Size />} />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/add-product" element={<Add />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
