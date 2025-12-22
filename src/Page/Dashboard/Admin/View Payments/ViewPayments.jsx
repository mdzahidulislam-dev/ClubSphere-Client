import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import useAuth from "../../../../Hooks/useAuth";
import Loader from "../../../../Components/Loader";
import { LuHistory } from "react-icons/lu";

const ViewPayments = () => {
  const axiosSecure = useAxios();
  const [userRole, setUserRole] = useState();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.email) return;
    axiosSecure(`/users/${user.email}`).then((res) => {
      setUserRole(res.data.role);
    });
  }, [user, axiosSecure]);

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payment-history", user],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?${userRole}=admin`);
      return res.data;
    },
  });

  if (isLoading) return <Loader></Loader>;
  console.log(payments);

  return (
    <div>
      <div className="mb-8 text-center ">
        <h5 className="text-2xl md:text-4xl font-semibold text-primary">
          All user Payment History{" "}
          <span className="text-lg">({payments.length})</span>
        </h5>
        <p className="text-secondary mt-1 font-normal">
          Track user Payment History & payment progress.
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl">
        <h5 className="text-xl md:text-2xl font-semibold text-primary flex gap-2 items-center p-2">
          <LuHistory />
          Payment History
        </h5>
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Head */}
          <thead className="bg-primary/10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                User info
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Club Details
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Club
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 bg-white">
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={payment.memberPhoto}
                        alt={payment.memberName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-normal text-gray-900">
                          {payment.memberName}
                        </span>
                        <span className="text-sm font-normal text-gray-500">
                          {payment.memberEmail}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {payment.clubName}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {payment.type === "membership" ? (
                      <span className="text-primary font-semibold">
                        Membership
                      </span>
                    ) : (
                      <span className="text-blue-600 font-semibold">Event</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    ${payment.amount}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(payment.paidAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {payment.paymentStatus === "paid" ? (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        Paid
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-10 text-center text-gray-500 text-2xl">
                  No payment history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPayments;
