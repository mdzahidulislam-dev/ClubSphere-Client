import { createBrowserRouter } from "react-router-dom";
import Root from "../Layouts/Root";
import Loader from "../Components/Loader";
import PageNotFound from "../Components/PageNotFound";
import Home from "../Page/Home/Home";
import Login from "../Page/auth/Login";
import SignUp from "../Page/auth/SignUp";
import ForgotPass from "../Page/auth/ForgotPass";
import Clubs from "../Page/Clubs/Clubs";
import Events from "../Page/Events/Events";
import Dashboard from "../Layouts/Dashboard";
import Overview from "../Page/Dashboard/Admin/Overview";
import PrivateRoute from "./PrivateRoute";
import ManageUsers from "../Page/Dashboard/ManageUsers/ManageUsers";
import Profile from "../Page/Profile/Profile";
import ManageClubs from "../Page/Dashboard/ManageClubs/ManageClubs";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    hydrateFallbackElement: <Loader></Loader>,
    errorElement: <PageNotFound></PageNotFound>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "sign-up",
        element: <SignUp></SignUp>
      },
      {
        path: "forgot-password",
        element: <ForgotPass></ForgotPass>
      },
      {
        path: "Clubs",
        element: <Clubs></Clubs>
      },
      {
        path: "events",
        element: <Events></Events>
      },
      {
        path: "profile",
        element: <PrivateRoute><Profile></Profile></PrivateRoute>
      },
    ],
  },
  {
    path:"/dashboard",
    element:<PrivateRoute><Dashboard></Dashboard></PrivateRoute>,
    hydrateFallbackElement:<Loader></Loader>,
    errorElement: <PageNotFound></PageNotFound>,
    children:[
      {
        path:"/dashboard/admin",
        element:<Overview></Overview>
      },
      {
        path:"/dashboard/member",
        element:<Overview></Overview>
      },
      {
        path:"/dashboard/manager",
        element:<Overview></Overview>
      },
      {
        path:"/dashboard/admin/manage-users",
        element:<ManageUsers></ManageUsers>
      },
      {
        path:"/dashboard/admin/manage-clubs",
        element:<ManageClubs></ManageClubs>
      },
    ]
  }
]);
