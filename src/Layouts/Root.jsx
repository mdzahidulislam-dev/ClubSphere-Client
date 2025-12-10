import React, { useEffect } from "react";
import Navbar from "../Components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import Loader from "../Components/Loader";
import useAuth from "../Hooks/useAuth";

const Root = () => {
  const { loading, setLoading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    if (user) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [location, setLoading, user]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="pt-15 flex-1">
            <Outlet />
          </div>
          <div className="shadow-2xl">
            <Footer />
          </div>
        </div>
      )}
    </>
  );
};

export default Root;
