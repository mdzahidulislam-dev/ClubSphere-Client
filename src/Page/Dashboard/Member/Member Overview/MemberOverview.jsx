import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaUsers, FaCalendarAlt, FaCreditCard } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import useAuth from "../../../../Hooks/useAuth";
import useAxios from "../../../../Hooks/useAxios";
import Loader from "../../../../Components/Loader";

const MemberOverview = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();

  // Get user's club memberships
  const { data: myClubs = [], isLoading: loadingClubs } = useQuery({
    queryKey: ["my-memberships", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-memberships/${user.email}`);
      return res.data;
    },
  });

  // Get user's event registrations
  const { data: myEvents = [], isLoading: loadingEvents } = useQuery({
    queryKey: ["my-event-registrations", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/event-registrations/user/${user.email}`
      );
      return res.data;
    },
  });
  if (loadingClubs || loadingEvents) return <Loader />;

  // Filter upcoming events (status: ongoing or upcoming)
  const upcomingEvents = myEvents
    .filter((event) => {
      if (!event.eventDateTime) {
        console.warn("Event missing eventDateTime:", event);
        return false;
      }

      const eventDate = new Date(event.eventDateTime);
      const now = new Date();

      // Only show future events
      return eventDate >= now;
    })
    .sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime))
    .slice(0, 3);

  return (
    <div className="min-h-screen p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-primary">
          Welcome back, {user?.displayName?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-secondary">
          Here's a summary of your club activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Total Membership Card */}
        <div className="bg-primary backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white mb-2">TOTAL MEMBERSHIP</p>
              <h2 className="text-5xl font-bold mb-2 ml-8 text-white">
                {myClubs.length}
              </h2>
              <p className="text-white">Clubs Joined</p>
            </div>
            <div className="relative">
              {/* Circular Progress */}
              <div className="w-32 h-32">
                <svg className="transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="8"
                    strokeDasharray={`${(myClubs.length / 10) * 339} 339`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaUsers className="text-4xl text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Status Card */}
        <div className="bg-primary backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white mb-2">ACTIVITY STATUS</p>
              <h2 className="text-5xl font-bold mb-2 ml-8 text-white">
                {myEvents.length}
              </h2>
              <p className="text-white">Events Registered</p>
            </div>
            {/* Bar Chart Visualization */}
            <div className="flex items-end gap-2 h-24">
              {[40, 60, 55, 75, 85, 70, 100].map((height, index) => (
                <div
                  key={index}
                  className="w-3 bg-linear-to-t from-primary/10 to-white rounded-t transition-all"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-primary">
          Your Upcoming Events
        </h2>

        {upcomingEvents.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event._id}
                className="bg-primary/50 backdrop-blur-sm rounded-2xl overflow-hidden  hover:border-cyan-400/50 transition-all hover:shadow-xl ">
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Event Image */}
                  <div className="md:w-72 h-48 shrink-0">
                    <img
                      src={
                        event.bannerImage ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={event.eventName}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-white text-sm font-semibold mb-2">
                        {new Date(event.eventDateTime)
                          .toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })
                          .toUpperCase()}{" "}
                        -{" "}
                        {new Date(event.eventDateTime).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      <h3 className="text-2xl font-bold mb-2 text-white">
                        {event.eventName}
                      </h3>
                      <p className="text-primary">
                        Host By:{" "}
                        <span className="text-white">{event.clubName}</span>
                      </p>
                    </div>

                    <Link
                      to={`/event-details/${event.eventId}`}
                      className="mt-4   bg-primary  px-6 py-2 rounded-lg font-semibold  w-fit text-white">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center border border-white/20">
            <MdEventAvailable className="text-6xl text-primary  mx-auto mb-4" />
            <p className="text-4xl text-primary/20 mb-4">No upcoming events</p>
            <Link
              to="/events"
              className=" btn bg-primary text-white  px-6 py-3 rounded-lg font-semibold transition-all ">
              Explore Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberOverview;
