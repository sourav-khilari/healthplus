import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <button
        className={`${
          isMenuOpen ? "top-2 right-2" : "top-5 right-7"
        } bg-white p-2 fixed rounded-lg shadow-lg border border-blue-200`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes color="#000080" />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-blue-800 my-1"></div>
            <div className="w-6 h-0.5 bg-blue-800 my-1"></div>
            <div className="w-6 h-0.5 bg-blue-800 my-1"></div>
          </>
        )}
      </button>

      {isMenuOpen && (
        <section className="bg-white p-4 fixed right-7 top-5 shadow-lg border border-blue-200 rounded-lg">
          <ul className="list-none mt-2">
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-[#E0F0FF] rounded-sm"
                to="/medstore/admin/dashboard"
                style={({ isActive }) => ({
                  color: isActive ? "#1E90FF" : "#000080",
                })}
              >
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-[#E0F0FF] rounded-sm"
                to="/medstore/admin/categorylist"
                style={({ isActive }) => ({
                  color: isActive ? "#1E90FF" : "#000080",
                })}
              >
                Create Category
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-[#E0F0FF] rounded-sm"
                to="/medstore/admin/productlist"
                style={({ isActive }) => ({
                  color: isActive ? "#1E90FF" : "#000080",
                })}
              >
                Create Product
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-[#E0F0FF] rounded-sm"
                to="/medstore/admin/allproducts"
                style={({ isActive }) => ({
                  color: isActive ? "#1E90FF" : "#000080",
                })}
              >
                All Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-[#E0F0FF] rounded-sm"
                to="/medstore/admin/userlist"
                style={({ isActive }) => ({
                  color: isActive ? "#1E90FF" : "#000080",
                })}
              >
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 block mb-5 hover:bg-[#E0F0FF] rounded-sm"
                to="/medstore/admin/getAllOrders"
                style={({ isActive }) => ({
                  color: isActive ? "#1E90FF" : "#000080",
                })}
              >
                Manage Orders
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;
