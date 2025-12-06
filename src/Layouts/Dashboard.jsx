import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import useAuth from "../Hooks/useAuth";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";
import Footer from "../Components/Footer";

const Dashboard = () => {
  const { signOutFunc, setUser, user } = useAuth();
  const navigate = useNavigate();
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
    <div className="drawer lg:drawer-open max-w-7xl mx-auto">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <nav className="navbar w-full px-5 flex justify-between ">
          <div className="flex items-center">
            <label
              htmlFor="my-drawer-4"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost">
              {/* Sidebar toggle icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="my-1.5 inline-block size-6 ">
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 4v16"></path>
                <path d="M14 10l2 2l-2 2"></path>
              </svg>
            </label>
            <div className="flex justify-between">
              <Link to="/" className="flex items-center gap-2 ml-2">
                <img src={logo} className="w-10" />
                <h1 className="text-primary  text-xl font-bold neon-text ">
                  Club
                  <span className="text-secondary hover:text-primary">
                    Sphere
                  </span>
                </h1>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-secondary">
            {navItem}
          </div>
          <div className="md:mr-8">
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
        </nav>
        {/* Page content here */}
        <div className="flex-1 mx-10 my-10 bg-white shadow-xl rounded-lg p-5">
          <Outlet></Outlet>
        </div>
        <div className="md:px-10">
            <Footer></Footer>
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"></label>
        <div className="flex min-h-full flex-col items-start bg-white is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage">
                {/* Home icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4">
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span className="is-drawer-close:hidden">Home</span>
              </button>
            </li>

            {/* List item */}
            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Settings">
                {/* Settings icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4">
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
                <span className="is-drawer-close:hidden">Settings</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
