import axios from "axios";
import React from "react";
const axiosSecure = axios.create({
  baseURL: "https://club-sphere-server-ashy.vercel.app",
});
const useAxios = () => {
  return axiosSecure;
};

export default useAxios;
