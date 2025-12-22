import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";
import useAuth from "../Hooks/useAuth";
import { FaHome } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { MdEvent, MdOutlineDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import useAxios from "../Hooks/useAxios";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { signOutFunc, setUser, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    signOutFunc()
      .then(() => {
        toast.success("Sign out successfully");
        setUser(null);
        navigate("/");
      })
      .catch((error) => console.error("SignOut error:", error.message));
  };

  const navItems = [
    { name: "HOME", path: "/", icon: <FaHome /> },
    { name: "CLUBS", path: "/clubs", icon: <FaUserGroup /> },
    { name: "EVENTS", path: "/events", icon: <MdEvent /> },
    ...(user
      ? [{ name: "PROFILE", path: "/profile", icon: <CgProfile /> }]
      : []),
  ];

  axiosSecure(`/users/${user?.email}`).then((res) => {
    setUserRole(res.data.role);
  });

  const navItem = (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `relative transition-all duration-300 group px-3 py-2 rounded font-bold ${
              isActive ? "text-primary" : "hover:text-primary"
            }`
          }>
          {({ isActive }) => (
            <div className="flex items-center gap-1">
              <div>{item.icon}</div>
              {item.name}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
            </div>
          )}
        </NavLink>
      ))}

      {!user && (
        <>
          <NavLink
            state={location.state}
            to="/login"
            className="px-4 py-2 rounded border border-primary bg-primary text-white transition btn">
            Log in
          </NavLink>

          <NavLink
            state={location.state}
            to="/sign-up"
            className="px-4 py-2 bg-transparent rounded text-primary border border-primary hover:bg-primary hover:text-white transition btn">
            Sign Up
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 w-full z-50">
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isScrolled ? "backdrop-blur bg-white/70 shadow-md" : "bg-transparent"
        }`}></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-0">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} className="w-10" alt="logo" />
            <h1 className="text-primary text-xl font-bold neon-text">
              Club
              <span className="text-secondary hover:text-primary">Sphere</span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-secondary">
            {navItem}
          </div>

          {/* Mobile Menu Toggle */}
          {!user && (
            <button
              className="md:hidden text-3xl text-primary"
              onClick={() => setOpen(!open)}>
              {open ? "✕" : "≡"}
            </button>
          )}

          {/* User Avatar */}
          {user && (
            <div className="ml-4 dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    src={
                      user?.photoURL ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                  />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-4 backdrop-blur rounded-lg text-black w-56 bg-white/50">
                <h3 className="font-bold">{user?.displayName}</h3>
                <p className="text-xs mb-2 text-gray-600">{user?.email}</p>

                <div className="flex flex-col space-y-4 mt-4">
                  {/* Mobile Dropdown */}
                  {!open && user && (
                    <div className="md:hidden flex justify-end flex-col space-y-4">
                      {navItem}
                    </div>
                  )}
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `relative transition-all duration-300 group px-3 py-2 rounded font-bold hidden md:block ${
                        isActive ? "text-primary" : "hover:text-primary"
                      }`
                    }>
                    {({ isActive }) => (
                      <div className="flex items-center gap-1">
                        <div>
                          <CgProfile />
                        </div>
                        PROFILE
                        <span
                          className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                            isActive ? "w-full" : "w-0 group-hover:w-full"
                          }`}></span>
                      </div>
                    )}
                  </NavLink>

                  <NavLink
                    to={`/dashboard/${userRole}`}
                    className={({ isActive }) =>
                      `relative transition-all duration-300 group px-3 py-2 rounded font-bold ${
                        isActive ? "text-primary" : "hover:text-primary"
                      }`
                    }>
                    {({ isActive }) => (
                      <div className="flex items-center gap-1">
                        <div>
                          <MdOutlineDashboard />
                        </div>
                        DASHBOARD
                        <span
                          className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                            isActive ? "w-full" : "w-0 group-hover:w-full"
                          }`}></span>
                      </div>
                    )}
                  </NavLink>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 justify-center bg-primary text-white p-2 rounded">
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Dropdown */}
        {open && !user && (
          <div className="md:hidden flex justify-end">
            <div className="w-56 px-6 py-4 space-y-4 flex flex-col bg-white/50 backdrop-blur">
              {navItem}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
