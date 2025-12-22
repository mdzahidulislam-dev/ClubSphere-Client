import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import useAuth from "../../../../Hooks/useAuth";
import Loader from "../../../../Components/Loader";

const ManagerOverview = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();

  // Fetch manager's clubs
  const { data: clubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ["manager-clubs", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${user.email}`);
      return res.data;
    },
  });

  // Fetch manager's events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["manager-events", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${user.email}`);
      return res.data;
    },
  });

  // Fetch all members from manager's clubs
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ["club-members", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/manager/club-members/${user.email}`);
      return res.data;
    },
  });

  // Fetch payments for manager's clubs
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["manager-payments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments`);
      // Filter payments for manager's clubs
      const managerClubIds = clubs.map((club) => club._id);
      return res.data.filter((payment) =>
        managerClubIds.includes(payment.clubId)
      );
    },
  });

  if (clubsLoading || eventsLoading || membersLoading || paymentsLoading) {
    return <Loader />;
  }

  // Calculate statistics
  const totalClubs = clubs.length;
  const totalMembers = members.filter(
    (m) => m.membershipStatus === "active"
  ).length;
  const totalEvents = events.length;
  const totalRevenue = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const clubGrowth = 12;
  const memberGrowth = 8;
  const eventGrowth = 15;
  const revenueGrowth = 20;

  const stats = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Total Clubs",
      value: totalClubs,
      growth: clubGrowth,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      title: "Total Members",
      value: totalMembers,
      growth: memberGrowth,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Total Events",
      value: totalEvents,
      growth: eventGrowth,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      growth: revenueGrowth,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary">Manager Overview</h1>
        <p className="text-secondary mt-2">
          Here's what's happening with your clubs today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className=" rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-primary/70 broder ">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
              <div className="flex items-center text-sm font-semibold text-green-600">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
               <p className="text-3xl text-green-500">
                 +{stat.growth}%
               </p>
              </div>
            </div>

            <h3 className="text-white text-xl font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Additional Info Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Club Status Breakdown */}
        <div className="border border-primary/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-black mb-4">Club Status</h2>
          <div className="space-y-3">
            {[
              {
                label: "Approved",
                count: clubs.filter((c) => c.status === "approved").length,
                color: "bg-green-500",
              },
              {
                label: "Pending",
                count: clubs.filter((c) => c.status === "pending").length,
                color: "bg-yellow-500",
              },
              {
                label: "Rejected",
                count: clubs.filter((c) => c.status === "rejected").length,
                color: "bg-red-500",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <span className="font-semibold text-black">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Membership Status Breakdown */}
        <div className="border border-primary/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-black mb-4">
            Membership Status
          </h2>
          <div className="space-y-3">
            {[
              {
                label: "Active",
                count: members.filter((m) => m.membershipStatus === "active")
                  .length,
                color: "bg-green-500",
              },
              {
                label: "Pending",
                count: members.filter((m) => m.membershipStatus === "pending")
                  .length,
                color: "bg-yellow-500",
              },
              {
                label: "Expired",
                count: members.filter((m) => m.membershipStatus === "expired")
                  .length,
                color: "bg-gray-500",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <span className="font-semibold text-black">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;
