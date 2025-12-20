import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import useAuth from "../../../../Hooks/useAuth";
import Loader from "../../../../Components/Loader";

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
  console.log(payments);

  if (isLoading) return <Loader></Loader>;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table Head */}
        <thead className="bg-gray-100">
          <tr>
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
                  {payment.clubName}
                </td>
                <td className="px-4 py-3 text-sm">
                  {payment.type === "membership" ? (
                    <span className="text-green-600 font-semibold">
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
  );
};

export default ViewPayments;
