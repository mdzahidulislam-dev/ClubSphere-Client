import React from 'react';
import { Link } from 'react-router-dom';
import error from "../assets/404.png"

const PageNotFound = () => {
    return (
       <div className="w-screen h-screen ">
        <title>Page Not Found</title>
      <div className="w-8/12 mx-auto pt-20 items-center flex flex-col justify-center  text-center font-sans text-gray-900 ">
        <img
          src={error}
          alt="Magnifying glass on map"
          className="w-10/12 lg:w-8/12 rounded-lg mb-6"
        />
        <h2 className="text-4xl mb-4 font-black text-[#FFA239]">Page Not Found</h2>
        <p className="text-sm text-gray-500 mb-8 px-4 w-80%">
          Oops! The page you're looking for seems to have been misplaced. It
          might have been moved, renamed, or is taking a short break. Let's get
          you back to a clean slate.
        </p>
        <Link
          to="/"
          className="bg-[#FF5656] text-white font-semibold text-sm px-6 py-6 rounded-md hover:bg-[#ec3a3a] transition-colors btn ">
          Return to Homepage
        </Link>
      </div>
    </div>
    );
};

export default PageNotFound;