import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxios from "../../../../Hooks/useAxios";
import { FaUsers, FaBuilding, FaUserCheck, FaDollarSign } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminOverview = () => {
  const axiosSecure = useAxios();

  // Fetch summary stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  // Fetch payment chart data
  const { data: chartData = [], isLoading: chartLoading } = useQuery({
    queryKey: ["payments-chart"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments-chart");
      return res.data;
    },
  });

  // Fetch recent memberships
  const { data: recentMemberships = [], isLoading: membershipsLoading } =
    useQuery({
      queryKey: ["recent-memberships"],
      queryFn: async () => {
        const res = await axiosSecure.get("/admin/recent-memberships");
        return res.data;
      },
    });

  const isLoading = statsLoading || chartLoading || membershipsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      growth: stats?.userGrowth || 0,
      Icon: FaUsers,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Clubs",
      value: stats?.totalClubs || 0,
      growth: stats?.clubGrowth || 0,
      Icon: FaBuilding,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Active Memberships",
      value: stats?.activeMemberships || 0,
      growth: stats?.membershipGrowth || 0,
      Icon: FaUserCheck,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
      growth: stats?.revenueGrowth || 0,
      Icon: FaDollarSign,
      color: "from-orange-500 to-red-500",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "paid":
      case "active":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen  p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Admin Overview</h1>
        <p className="text-secondary">
          Monitor your platform's performance and activities
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.Icon;
          return (
            <div
              key={index}
              className="bg-primary backdrop-blur-sm rounded-2xl p-6   transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-linear-to-br ${card.color}`}>
                  <Icon className="text-2xl text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xl text-white mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400 text-xl font-semibold">
                  +{card.growth}%
                </span>
                <span className="text-white text-sm">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payments Chart */}
      <div className="bg-primary/50 backdrop-blur-sm rounded-2xl p-6  mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">
            Payments This Year
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-white">
              ${stats?.totalRevenue?.toLocaleString() || 0}
            </p>
            <span className="text-green-400 text-xl font-semibold">
              +{stats?.revenueGrowth || 0}%
            </span>
          </div>
          <p className="text-white text-sm">Jan - Dec</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#FF5656" />
            <YAxis stroke="#FF5656" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#FF5656"
              strokeWidth={3}
              dot={{ fill: "#FF5656", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Memberships  Table */}
      <div className=" backdrop-blur-sm rounded-2xl mb-10  ">
        <h2 className="text-2xl font-bold text-primary mb-6">
          Recent Memberships 
        </h2>

        {recentMemberships.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary bg-primary/10 ">
                  <th className="text-left py-3 px-4  font-semibold text-sm">
                    User Name
                  </th>
                  <th className="text-left py-3 px-4  font-semibold text-sm">
                    Club Name
                  </th>
                  <th className="text-left py-3 px-4  font-semibold text-sm">
                    Date Joined
                  </th>
                  <th className="text-left py-3 px-4  font-semibold text-sm">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentMemberships.map((member, index) => (
                  <tr
                    key={index}
                    className="border-b border-primary/20  transition-colors">
                    <td className="py-4 px-4  font-medium">
                      {member.userName}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {member.clubName}
                    </td>
                    <td className="py-4 px-4 text-garay-600">
                      {member.dateJoined}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize text-green-600 bg-green-500   ${getStatusStyle(
                          member.status
                        )}`}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No recent memberships</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
