import React from "react";
import useAuth from "../../../../Hooks/useAuth";
import useAxios from "../../../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaPlus, FaRegCalendar, FaRegClock } from "react-icons/fa";
import { MapPin, MoreVertical } from "lucide-react";
import { FaMoneyBills } from "react-icons/fa6";
import { MdOutlinePageview } from "react-icons/md";
import Loader from "../../../../Components/Loader";

const MyJoinedEvents = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  // ✅ Get user's event registrations
  const { data: myJoinedEvents = [], isLoading } = useQuery({
    queryKey: ["my-event-registrations", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/event-registrations/user/${user.email}`
      );
      return res.data;
    },
  });

  if (isLoading) return <Loader />;



  return (
    <div>
      <div className="relative justify-center">
        <div className="flex flex-col gap-2 text-center mt-5">
          <h1 className="text-4xl md:text-4xl font-semibold text-primary">
            My Registered Events
          </h1>
          <p className="text-secondary">
            Manage and track all events you've registered for
          </p>
        </div>
        <Link
          to="/events"
          className="md:absolute right-5 md:right-0 lg:right-5 top-5 flex items-center w-full md:w-fit md:-mt-5 lg:mt-0 mt-5 gap-2 rounded-xl btn p-6 bg-primary hover:bg-hover text-sm font-bold shadow-lg shadow-primary/20 transition-all text-white transform hover:scale-[1.02] active:scale-[0.98]">
          <FaPlus />
          <span>Register New Event</span>
        </Link>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:px-10 md:px-5 mb-10">
        {myJoinedEvents.length > 0 ? (
          myJoinedEvents.map((registration) => {
            return (
              <div
                key={registration._id}
                className="mt-8 event-card group transition-transform duration-500 ease-in-out hover:scale-102">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl flex flex-col h-full">
                  {/* Background Image */}
                  <div className="relative h-48 bg-linear-to-br from-orange-200 to-fuchsia-600-800">
                    <img
                      src={registration.bannerImage}
                      alt={registration.eventName}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg bg-green-500">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      {registration.status}
                    </div>

                    <div className="-mb-1 absolute inset-0 bg-linear-to-t from-[#da4848] via-[#da4848]/10 to-transparent"></div>
                  </div>

                  {/* Content Section */}
                  <div className="relative bg-third px-6 py-5 flex flex-col grow">
                    <div className="flex flex-col grow gap-2">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-2xl font-bold text-white">
                          {registration.eventName?.length > 35
                            ? registration.eventName.slice(0, 35) + "..."
                            : registration.eventName}
                        </h2>
                        <button className="text-white hover:text-white transition-colors p-1">
                          <MoreVertical size={20} />
                        </button>
                      </div>

                      {/* Club Name */}
                      <p className="text-gray-400 text-sm mb-2">
                        By:{" "}
                        <span className="text-white font-semibold">
                          {registration.clubName}
                        </span>
                      </p>

                      {/* Event Date */}
                      <div className="flex items-center gap-1.5 text-gray-300 mb-2">
                        <FaRegCalendar size={16} />
                        <span className="font-medium">
                          {registration.eventDate || "TBD"}
                        </span>
                      </div>

                      {/* Event Time */}
                      <div className="flex items-center gap-1.5 text-gray-300 mb-2">
                        <FaRegClock size={16} />
                        <span className="font-medium">
                          {registration.eventTime || "TBD"}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-gray-300 mb-4">
                        <MapPin size={16} />
                        <span className="font-medium">
                          {registration.location?.length > 25
                            ? registration.location.slice(0, 25) + "..."
                            : registration.location || "TBD"}
                        </span>
                      </div>

                      {/* Registration Info */}
                      <div className="flex items-center gap-1.5 text-gray-300 mb-2">
                        <span className="text-xs">
                          Registered:{" "}
                          {new Date(
                            registration.registeredAt
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <span className="font-medium">
                          <span className="text-green-500 font-bold text-lg">
                            Free
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto pt-4">
                      <Link
                        to={`/event-details/${registration.eventId}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-forth text-white py-2.5 rounded-lg font-medium hover:bg-forth/80 transition-colors">
                        <MdOutlinePageview size={18} />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center text-primary/20 text-3xl py-20 font-bold">
            No Registered Events Found
            <p className="text-base text-gray-300 mt-4">
              You haven't registered for any events yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJoinedEvents;
