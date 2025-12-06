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
import AdminOverview from "../Page/Dashboard/Admin/AdminOverview";
import Profile from "../Page/Profile/profile";

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
        element: <Profile></Profile>
      },
    ],
  },
  {
    path:"/dashboard",
    element:<Dashboard></Dashboard>,
    hydrateFallbackElement:<Loader></Loader>,
    errorElement: <PageNotFound></PageNotFound>,
    children:[
      {
        path:"/dashboard",
        element:<AdminOverview></AdminOverview>
      }
    ]
  }
]);
