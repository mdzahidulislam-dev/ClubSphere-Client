
import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import useAuth from "../../../../Hooks/useAuth";
import Loader from "../../../../Components/Loader";

const EventRegistrations = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["events-register-history", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/event-registration-history/${user.email}`);
      return res.data;
    },
  });
console.log(registrations);

  if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto rounded-xl">
      <div className="flex flex-col gap-2 text-center mt-5 mb-10">
        <h1 className="text-4xl md:text-4xl font-semibold text-primary">
          Events Registered Users History
        </h1>
        <p className="text-secondary">
          Track all users who registered for your club events
        </p>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        {/* Table Head */}
        <thead className="bg-primary/10">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              User Info
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Event Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Event Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Registered Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Status
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100 bg-white">
          {registrations.length > 0 ? (
            registrations.map((registration, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {/* User Info */}
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={registration.userPhoto}
                      alt={registration.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {registration.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {registration.userEmail}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Event Name */}
                <td className="px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-primary">
                      {registration.eventName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {registration.clubName}
                    </p>
                  </div>
                </td>

                {/* Event Date */}
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div>
                    <p>{registration.eventDate}</p>
                    <p className="text-xs text-gray-500">
                      {registration.eventTime}
                    </p>
                  </div>
                </td>

                {/* Registered Date */}
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(registration.registeredAt).toLocaleDateString()}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-sm">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    Registered
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="px-4 py-10 text-center text-primary/20 text-3xl font-bold">
                No registrations found for your events
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventRegistrations;