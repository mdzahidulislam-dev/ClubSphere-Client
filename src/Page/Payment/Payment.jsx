import React from "react";
import { useParams } from "react-router-dom";
import useAxios from "../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/Loader";

const Payment = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();

  const { data: club, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/club/${id}`);
      return res.data;
    },
  });
  
  if (isLoading) return <Loader></Loader>;
  return <div>payment : {club.clubName}</div>;
};

export default Payment;
