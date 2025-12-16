import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import useAuth from "../Hooks/useAuth";
import { toast } from "react-toastify";
import { LogOut } from "lucide-react";
import Footer from "../Components/Footer";
import { CgProfile } from "react-icons/cg";
import {
  MdEvent,
  MdEventAvailable,
  MdEventNote,
  MdOutlineDashboard,
  MdOutlineManageAccounts,
  MdOutlinePayments,
} from "react-icons/md";
import { FaUserGroup, FaUsers, FaUsersGear } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import useAxios from "../Hooks/useAxios";
import { RiTeamLine } from "react-icons/ri";

const Dashboard = () => {
  const { signOutFunc, setUser, user } = useAuth();
  const [userRole, setUserRole] = useState();
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user?.email) return;

    axiosSecure(`/users/${user.email}`).then((res) => {
      setUserRole(res.data.role);
    });
  }, [user, axiosSecure]);
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
    { name: "HOME", path: "/", icon: <FaHome /> },
    { name: "CLUBS", path: "/clubs", icon: <FaUserGroup /> },
    { name: "EVENTS", path: "/events", icon: <MdEvent /> },
    ...(user
      ? [{ name: "PROFILE", path: "/profile", icon: <CgProfile /> }]
      : []),
  ];
  const dashboardNavItems = useMemo(() => {
    const items = [
      {
        name: "Overview",
        path: `/dashboard/${userRole}`,
        icon: <MdOutlineDashboard />,
      },
    ];

    if (userRole === "admin") {
      items.push(
        {
          name: "Manage Users",
          path: "admin/manage-users",
          icon: <FaUsersGear />,
        },
        {
          name: "Manage Clubs",
          path: "admin/manage-clubs",
          icon: <MdOutlineManageAccounts />,
        },
        {
          name: "View Payments",
          path: "admin/view-payments",
          icon: <MdOutlinePayments />,
        }
      );
    } else if (userRole === "manager") {
      items.push(
        {
          name: "My Clubs",
          path: "/dashboard/manager/my-clubs",
          icon: <MdOutlineManageAccounts />,
        },
        {
          name: "Club Members",
          path: "/dashboard/manager/club-members",
          icon: <RiTeamLine />,
        },
        {
          name: "Events Management",
          path: "/dashboard/manager/events-management",
          icon: <MdEventNote />,
        },
        {
          name: "Event Registrations",
          path: "/dashboard/manager/event-registrations",
          icon: <MdEventAvailable />,
        }
      );
    } else if (userRole === "member") {
      items.push(
        {
          name: "My Clubs",
          path: "/dashboard/member/my-clubs",
          icon: <FaUsers />,
        },
        {
          name: "My Events",
          path: "/dashboard/member/my-events",
          icon: <MdEvent />,
        },
        {
          name: "Payment History",
          path: "/dashboard/member/payment-history",
          icon: <MdOutlinePayments />,
        }
      );
    }
    return items;
  }, [userRole]);

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
                className={`
            absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}></span>
            </div>
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
    <div className="drawer lg:drawer-open mx-auto">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col  min-h-screen">
        {/* Navbar */}
        <nav className="navbar w-full px-5 flex justify-between z-1 fixed top-0 bg-white">
          
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
          <div className="md:mr-8 lg:pr-15">
            {user && (
              <div className=" ml-4 dropdown dropdown-end">
                <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="User avatar"
                      src={
                        user?.photoURL ||
                        "https://i.ibb.co/0Qp1W33/default-avatar.png"
                      }
                    />
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-4 backdrop-blur rounded-lg text-black w-56 bg-white/50">
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
                              className={`
            absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}></span>
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
                              className={`
            absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300
            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
          `}></span>
                          </div>
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
        <div className="flex-1 mx-10 my-10 mt-25 bg-white shadow-xl rounded-lg p-5">
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
            <div className="w-full px-3 py-3 border-b border-gray-200 mb-2">
              <div className="is-drawer-close:tooltip is-drawer-close:tooltip-right">
                <div className="flex items-center gap-2 ">
                  <img src={logo} className=" my-1.5 inline-block size-4" />
                  <h1 className="text-primary  text-xl font-bold neon-text is-drawer-close:hidden">
                    Club
                    <span className="text-secondary">Sphere</span>
                  </h1>
                </div>
              </div>
            </div>
            {dashboardNavItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `is-drawer-close:tooltip is-drawer-close:tooltip-right
         flex items-center gap-1 my-1 px-3 py-2 rounded transition
         ${isActive ? "bg-primary text-white" : "hover:bg-primary/10"}`
                  }
                  data-tip={item.name}>
                  <div className="inline-block size-4">{item.icon}</div>
                  <span className="is-drawer-close:hidden">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
