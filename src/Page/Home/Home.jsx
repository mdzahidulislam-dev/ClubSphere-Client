import React from "react";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import WhyJoin from "./WhyJoin";
import PopularCategories from "./PopularCategories";
import Testimonials from "./Testimonials";
import useAxios from "../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../Components/Loader";
import { MapPin, MoreVertical } from "lucide-react";
import { FaMoneyBills } from "react-icons/fa6";
import { MdOutlinePageview } from "react-icons/md";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const axiosSecure = useAxios();

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["recent-Clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/recent-clubs");
      return res.data;
    },
  });
 

  if (isLoading) return <Loader></Loader>;

  return (
    <div className="-mt-15 mb-10">
      <Hero></Hero>
      <div className="lg:w-7xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20">
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight"
            style={{ color: "#FF5656" }}>
            Recent Clubs
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto font-medium px-5">
            Check out the newest clubs added by our community and find your next
            favorite place to belong.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-5 lg:px-0">
          {clubs.map((club, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="  mt-4 club-card group transition-transform duration-500 ease-in-out hover:scale-102">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl flex flex-col h-full">
                  {/* Background Image */}
                  <div className="relative h-48 bg-linear-to-br from-orange-200 to-fuchsia-600-800">
                    <img
                      src={club.bannerImage}
                      alt={club.clubName}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />

                    {/* status Badge */}
                    <div
                      className={`absolute top-4 right-4 flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${
                        club.status === "pending"
                          ? "bg-yellow-500"
                          : club.status === "approved"
                          ? "bg-emerald-500"
                          : club.status === "rejected"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      {club.status}
                    </div>

                    <div className="-mb-1 absolute inset-0 bg-linear-to-t from-[#da4848] via-[#da4848]/10 to-transparent"></div>
                  </div>

                  {/* Content Section */}
                  <div className="relative bg-third px-6 py-5 flex flex-col grow">
                    <div className="flex flex-col grow">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-2xl font-bold text-white">
                          {club.clubName?.length > 35
                            ? club.clubName.slice(0, 35) + "..."
                            : club.clubName}
                        </h2>
                        <button className="text-white hover:text-white transition-colors p-1">
                          <MoreVertical size={20} />
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed grow">
                        {club.description?.length > 80
                          ? club.description.slice(0, 80) + "..."
                          : club.description}
                      </p>

                      {/* Info Row */}
                      <div className="flex items-center gap-4 text-sm mb-5">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <MapPin size={16} />
                          <span className="font-medium">
                            {club.location?.length > 25
                              ? club.location.slice(0, 25) + "..."
                              : club.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <span className="font-medium">
                            {club.membershipFee === "0" ? (
                              <span className="text-green-500 font-bold text-lg">
                                Free
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <FaMoneyBills size={16} />${club.membershipFee}
                                /mo
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons at Bottom */}
                    <div className="flex gap-3 mt-auto">
                      <Link
                        to={`/club-details/${club._id}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-forth text-white py-2.5 rounded-lg font-medium">
                        <MdOutlinePageview size={18} />
                        view Details
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <HowItWorks></HowItWorks>
      <WhyJoin></WhyJoin>
      <PopularCategories></PopularCategories>
      <Testimonials></Testimonials>
    </div>
  );
};

export default Home;
