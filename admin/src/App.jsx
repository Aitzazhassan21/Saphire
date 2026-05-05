import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import UsersPage from "./pages/Users";
import Leads from "./pages/Leads";
import Reviews from "./pages/Reviews";
import Contacts from "./pages/Contacts";
import Newsletter from "./pages/Newsletter";
import Settings from "./pages/Settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl =
  import.meta.env.VITE_BACKEND_URL?.trim() || "http://localhost:4000";

export const currency = (price) => {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price);
};

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-100">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <AdminSidebar setToken={setToken} />
          <div className="ml-64">
            <AdminHeader />
            <main className="p-8 pt-24">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard token={token} />} />
                <Route path="/products" element={<List token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/users" element={<UsersPage token={token} />} />
                <Route path="/leads" element={<Leads token={token} />} />
                <Route path="/reviews" element={<Reviews token={token} />} />
                <Route path="/contacts" element={<Contacts token={token} />} />
                <Route path="/newsletter" element={<Newsletter token={token} />} />
                <Route path="/settings" element={<Settings token={token} />} />
              </Routes>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
