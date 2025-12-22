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
import PrivateRoute from "./PrivateRoute";
import Profile from "../Page/Profile/Profile";
import AdminOverview from "../Page/Dashboard/Admin/Admin Overview/AdminOverview";
import ManageUsers from "../Page/Dashboard/Admin/ManageUsers/ManageUsers";
import ManageClubs from "../Page/Dashboard/Admin/ManageClubs/ManageClubs";
import ViewPayments from "../Page/Dashboard/Admin/View Payments/ViewPayments";
import ManagerOverview from "../Page/Dashboard/Club Manager/Manager Overview/ManagerOverview";
import MyClubs from "../Page/Dashboard/Club Manager/My Clubs/MyClubs";
import ClubMembers from "../Page/Dashboard/Club Manager/Club Members/ClubMembers";
import EventsManagement from "../Page/Dashboard/Club Manager/Events Management/EventsManagement";
import EventRegistrations from "../Page/Dashboard/Club Manager/Event Registrations/EventRegistrations";
import MemberOverview from "../Page/Dashboard/Member/Member Overview/MemberOverview";
import PaymentHistory from "../Page/Dashboard/Member/Payment History/PaymentHistory";
import ClubDetails from "../Page/Clubs/ClubDetails";
import Payment from "../Page/Payment/Payment";
import PaymentSuccess from "../Page/Payment/PaymentSuccess";
import MyJoinClubs from "../Page/Dashboard/Member/My Clubs/MyJoinClubs";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";
import EventsDetails from "../Page/Events/EventsDetails";
import MyJoinEvents from "../Page/Dashboard/Member/My Events/MyJoinEvents";

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
        element: <SignUp></SignUp>,
      },
      {
        path: "forgot-password",
        element: <ForgotPass></ForgotPass>,
      },
      {
        path: "Clubs",
        element: <Clubs></Clubs>,
      },
      {
        path: "payment-success",
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "club-details/:id",
        element: <ClubDetails></ClubDetails>,
      },
      {
        path: "event-details/:id",
        element: <EventsDetails></EventsDetails>,
      },
      {
        path: "payment/:id",
        element: <Payment></Payment>,
      },
      {
        path: "events",
        element: <Events></Events>,
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    hydrateFallbackElement: <Loader></Loader>,
    errorElement: <PageNotFound></PageNotFound>,
    children: [
      //admin routes
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminOverview></AdminOverview>
          </AdminRoute>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: "admin/manage-clubs",
        element: (
          <AdminRoute>
            <ManageClubs></ManageClubs>
          </AdminRoute>
        ),
      },
      {
        path: "admin/view-payments",
        element: (
          <AdminRoute>
            <ViewPayments></ViewPayments>
          </AdminRoute>
        ),
      },

      //Manager routes
      {
        path: "/dashboard/manager",
        element: (
          <ManagerRoute>
            <ManagerOverview></ManagerOverview>
          </ManagerRoute>
        ),
      },
      {
        path: "/dashboard/manager/my-clubs",
        element: (
          <ManagerRoute>
            <MyClubs></MyClubs>
          </ManagerRoute>
        ),
      },
      {
        path: "/dashboard/manager/club-details/:id",
        element: (
          <ManagerRoute>
            <ClubDetails></ClubDetails>
          </ManagerRoute>
        ),
      },
      {
        path: "/dashboard/manager/club-members",
        element: (
          <ManagerRoute>
            <ClubMembers></ClubMembers>
          </ManagerRoute>
        ),
      },
      {
        path: "/dashboard/manager/events-management",
        element: (
          <ManagerRoute>
            <EventsManagement></EventsManagement>
          </ManagerRoute>
        ),
      },
      {
        path: "/dashboard/manager/event-registrations",
        element: (
          <ManagerRoute>
            <EventRegistrations></EventRegistrations>
          </ManagerRoute>
        ),
      },

      //member routes
      {
        path: "/dashboard/member",
        element: <MemberOverview></MemberOverview>,
      },

      {
        path: "/dashboard/member/my-clubs",
        element: <MyJoinClubs></MyJoinClubs>,
      },
      {
        path: "/dashboard/member/my-events",
        element: <MyJoinEvents></MyJoinEvents>,
      },
      {
        path: "/dashboard/member/payment-history",
        element: <PaymentHistory></PaymentHistory>,
      },
    ],
  },
]);
