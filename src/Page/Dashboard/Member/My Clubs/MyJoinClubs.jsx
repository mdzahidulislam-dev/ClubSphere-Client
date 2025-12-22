import React from "react";
import useAuth from "../../../../Hooks/useAuth";
import useAxios from "../../../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { MapPin, MoreVertical } from "lucide-react";
import { FaMoneyBills } from "react-icons/fa6";
import { MdOutlinePageview } from "react-icons/md";
import Loader from "../../../../Components/Loader";

const MyJoinClubs = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const { data: myJoinedClub = [] } = useQuery({
    queryKey: ["membership", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-memberships/${user.email}`);
      return res.data;
    },
  });

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["myClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${user.email}`);
      return res.data;
    },
  });
  const joinedClubIds = myJoinedClub.map((m) => m.clubId);

  // filter clubs
  const filteredClubs = clubs.filter((club) =>
    joinedClubIds.includes(club._id)
  );

  if (isLoading) return <Loader></Loader>;


  return (
    <div>
      <div className=" relative justify-center ">
        <div className="flex flex-col gap-2 text-center mt-5">
          <h1 className="text-4xl md:text-4xl font-semibold text-primary">
            My Joined Clubs
          </h1>
          <p className=" text-secondary">
            Manage and track all clubs you've Joined
          </p>
        </div>
        <Link
          to="/clubs"
          className="md:absolute right-5 top-5 flex items-center w-full md:w-fit md:-mt-5 lg:mt-0 mt-5 gap-2 rounded-xl btn p-6  bg-primary hover:bg-hover text-sm font-bold shadow-lg shadow-primary/20 transition-all text-white transform hover:scale-[1.02] active:scale-[0.98]">
          <FaPlus />
          <span>Join New Club</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mt-5 text-center lg:px-10 md:px-5">
        {/* Total Clubs */}
        <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ">
          <h2 className="text-4xl font-bold text-primary group-hover:text-red-500 transition">
            {myJoinedClub.length}
          </h2>
          <p className="mt-2 text-gray-600 font-medium">Total Clubs</p>
        </div>

        {/* Active */}
        <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ">
          <h2 className="text-4xl font-bold text-green-600 group-hover:text-green-700 transition">
            {myJoinedClub.length}
          </h2>
          <p className="mt-2 text-gray-600 font-medium">Active</p>
        </div>

        {/* Expired */}
        <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ">
          <h2 className="text-4xl font-bold text-gray-400 group-hover:text-gray-600 transition">
            0
          </h2>
          <p className="mt-2 text-gray-600 font-medium">Expired</p>
        </div>

        {/* Pending Payment */}
        <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ">
          <h2 className="text-4xl font-bold text-yellow-500 group-hover:text-yellow-600 transition">
            0
          </h2>
          <p className="mt-2 text-gray-600 font-medium">Pending Payment</p>
        </div>
      </div>
      {/* Club Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:px-10 md:px-5 mb-10">
        {filteredClubs.length > 0 ? (
          filteredClubs.map((club) => {
            return (
              <div
                key={club._id}
                className="  mt-8 club-card group transition-transform duration-500 ease-in-out hover:scale-102">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl flex flex-col h-full">
                  {/* Background Image */}
                  <div className="relative h-48 bg-linear-to-br from-orange-200 to-fuchsia-600-800">
                    <img
                      src={club.bannerImage}
                      alt={club.clubName}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />

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
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-primary/20 text-3xl py-20 font-bold">
            No Club Found
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJoinClubs;
