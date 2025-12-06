import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";
import useAuth from "../Hooks/useAuth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { signOutFunc, setUser, user, setLoading } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return setLoading(true);
  }

  const handelSignOut = () => {
    signOutFunc()
      .then(() => {
        toast.success("Sign out successfully");
        setUser(null);
        navigate("/");
      })
      .catch((error) => console.error("SignOut error:", error.message));
  };
  const navItems = [
    { name: "HOME", path: "/" },
    { name: "CLUBS", path: "/clubs" },
    { name: "EVENTS", path: "/events" },
    ...(user ? [{ name: "PROFILE", path: "/profile" }] : []),
  ];

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
            <>
              {item.name}
              <span
                className={`
            absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}></span>
            </>
          )}
        </NavLink>
      ))}

      {!user && (
        <>
          <NavLink
            to="/login"
            className="px-4 py-2 rounded  border border-primary bg-primary text-white  transition btn">
            Log in
          </NavLink>

          <NavLink
            to="/sign-up"
            className="px-4 py-2 rounded text-primary border border-primary hover:bg-primary hover:text-white transition btn">
            Sign Up
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 w-full z-50 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-0">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} className="w-10" />
            <h1 className="text-primary  text-xl font-bold neon-text ">
              Club
              <span className="text-secondary hover:text-primary">Sphere</span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-secondary">
            {navItem}
          </div>

          {/* Mobile Menu */}
          {!user && (
            <button
              className="md:hidden text-3xl text-primary"
              onClick={() => setOpen(!open)}>
              {open ? "✕" : "≡"}
            </button>
          )}

          {/* User Avatar */}
          {user && (
            <div className=" ml-4 dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    src={
                      user?.photoURL ||
                      user?.reloadUserInfo?.photoUrl ||
                      "https://i.ibb.co/0Qp1W33/default-avatar.png"
                    }
                  />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-4 backdrop-blur rounded-lg text-white w-56 bg-secondary/20">
                <h3 className="font-bold text-black">{user?.displayName}</h3>
                <p className="text-xs mb-2 text-gray-600">{user?.email}</p>

                <div className=" hologram    flex flex-col items-left text-black">
                  <div className="flex flex-col md:hidden space-y-4">
                    {navItem}
                  </div>
                  <div className="flex flex-col space-y-4 mt-4">
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `relative transition-all duration-300 group px-3 py-2 rounded font-bold ${
                          isActive ? "text-primary" : "hover:text-primary"
                        }`
                      }>
                      {({ isActive }) => (
                        <>
                          PROFILE
                          <span
                            className={`
            absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}></span>
                        </>
                      )}
                    </NavLink>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        `relative transition-all duration-300 group px-3 py-2 rounded font-bold ${
                          isActive ? "text-primary" : "hover:text-primary"
                        }`
                      }>
                      {({ isActive }) => (
                        <>
                          DASHBOARD
                          <span
                            className={`
            absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}></span>
                        </>
                      )}
                    </NavLink>
                  </div>
                  {user && (
                    <button
                      onClick={handelSignOut}
                      className="mt-4 w-full flex items-center gap-2 justify-center bg-primary text-white bg-hover p-2 rounded ">
                      <LogOut size={18} />
                      Logout
                    </button>
                  )}
                </div>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="flex justify-end">
            <div className="md:hidden  w-56  px-6 py-4 space-y-4 flex flex-col bg-secondary/20 backdrop-blur ">
              {navItem}
              {user && (
                <button
                  onClick={handelSignOut}
                  className="block w-full bg-primary text-white bg-hover p-2 rounded ">
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
