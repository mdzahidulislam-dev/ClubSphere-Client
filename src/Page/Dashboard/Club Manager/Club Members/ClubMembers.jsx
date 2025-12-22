import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RiDeleteBin6Fill } from "react-icons/ri";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import useAxios from "../../../../Hooks/useAxios";
import useAuth from "../../../../Hooks/useAuth";
import Loader from "../../../../Components/Loader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const TABS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Pending", value: "pending" },
];

const TABLE_HEAD = ["Member", "Club Name", "Membership Status", "Join Date", "Actions"];

export default function ClubMembers() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const axiosSecure = useAxios();
  const { user } = useAuth();

  const statusOptions = ["active", "expired", "pending"];

  // Fetch all members from manager's clubs
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["club-members", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/manager/club-members/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  // Calculate statistics
  const totalMembers = members.length;
  const activeMembers = members.filter(
    (m) => m.membershipStatus === "active"
  ).length;
  const expiredMembers = members.filter(
    (m) => m.membershipStatus === "expired"
  ).length;
  const pendingMembers = members.filter(
    (m) => m.membershipStatus === "pending"
  ).length;

  // Handle status change
  const handleStatusChange = async (memberId, newStatus, currentStatus, memberName) => {
    if (newStatus === currentStatus) return;

    Swal.fire({
      title: "Are you sure?",
      text: `Change ${memberName}'s membership from "${currentStatus}" to "${newStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF5656",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/memberships/${memberId}`, {
            membershipStatus: newStatus,
          });

          // Refresh members list
          queryClient.invalidateQueries(["club-members", user?.email]);

          Swal.fire({
            title: "Changed!",
            text: `Membership status updated to "${newStatus}"`,
            icon: "success",
          });
        } catch (error) {
          toast.error("Failed to update membership status");
          console.error(error);
        }
      }
    });
  };

  // Filter members
  const filteredMembers = members.filter((member) => {
    const normalizedSearch = searchTerm
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "");

    const matchesSearch =
      member.memberName?.toLowerCase().replace(/\s+/g, "").includes(normalizedSearch) ||
      member.memberEmail?.toLowerCase().replace(/\s+/g, "").includes(normalizedSearch) ||
      member.clubName?.toLowerCase().replace(/\s+/g, "").includes(normalizedSearch);

    const matchesStatus =
      activeTab === "all" ? true : member.membershipStatus === activeTab;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "expired":
        return "bg-gray-100 text-gray-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="h-full w-full bg-white rounded-lg">
      {/* Header */}
      <div className="py-6 text-center">
        <div className="mb-8">
          <h5 className="text-4xl font-semibold text-primary">
            My Club Members
          </h5>
          <p className="text-secondary mt-1 font-normal">
            Manage all members from your clubs
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-10 text-center lg:px-10 md:px-5">
          {/* Total Members */}
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <h2 className="text-4xl font-bold text-primary group-hover:text-red-500 transition">
              {totalMembers}
            </h2>
            <p className="mt-2 text-gray-600 font-medium">Total Members</p>
          </div>

          {/* Active */}
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <h2 className="text-4xl font-bold text-green-600 group-hover:text-green-700 transition">
              {activeMembers}
            </h2>
            <p className="mt-2 text-gray-600 font-medium">Active Members</p>
          </div>

          {/* Expired */}
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <h2 className="text-4xl font-bold text-gray-400 group-hover:text-gray-600 transition">
              {expiredMembers}
            </h2>
            <p className="mt-2 text-gray-600 font-medium">Expired Members</p>
          </div>

          {/* Pending */}
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <h2 className="text-4xl font-bold text-yellow-500 group-hover:text-yellow-600 transition">
              {pendingMembers}
            </h2>
            <p className="mt-2 text-gray-600 font-medium">Pending</p>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="w-full md:w-auto">
            <div className="flex border-b border-gray-200">
              {TABS.map(({ label, value }) => (
                <button
                  key={value}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === value
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-primary"
                  }`}
                  onClick={() => {
                    setActiveTab(value);
                    setCurrentPage(1);
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="w-full md:w-72">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-primary" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search by name, email or club"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-0">
        <table className="w-full min-w-max table-auto text-left mb-18">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="border-y border-primary/50 bg-primary/10 p-4 transition-colors hover:bg-primary/20">
                  <div className="flex items-center justify-between gap-2 text-black opacity-70 font-semibold">
                    {head}
                    {index !== TABLE_HEAD.length - 1 && (
                      <ChevronUpDownIcon className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td
                  colSpan={TABLE_HEAD.length}
                  className="text-center py-10 text-2xl text-primary/50 font-bold">
                  No Members Found
                </td>
              </tr>
            ) : (
              paginatedMembers.map((member, index) => {
                const isLast = index === paginatedMembers.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-primary/20";

                return (
                  <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                    {/* Member Info */}
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <img
                          src={member.memberPhoto || "https://via.placeholder.com/40"}
                          alt={member.memberName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-normal text-gray-900">
                            {member.memberName}
                          </span>
                          <span className="text-sm font-normal text-gray-500">
                            {member.memberEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Club Name */}
                    <td className={classes}>
                      <span className="text-sm font-medium text-gray-900">
                        {member.clubName}
                      </span>
                    </td>

                    {/* Membership Status */}
                    <td className={classes}>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(
                          member.membershipStatus
                        )}`}>
                        {member.membershipStatus || "N/A"}
                      </span>
                    </td>

                    {/* Join Date */}
                    <td className={classes}>
                      <span className="text-sm font-normal text-gray-900">
                        {new Date(member.joinAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className={classes}>
                      <div className="flex items-center gap-2">
                        {/* Edit Status Dropdown */}
                        <div className="dropdown dropdown-left">
                          <div
                            tabIndex={0}
                            role="button"
                            className="rounded-full bg-primary/10 hover:bg-primary/20 text-primary btn-sm p-2">
                            <PencilIcon className="h-4 w-4" />
                          </div>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
                            {statusOptions.map((status) => (
                              <li key={status}>
                                <button
                                  type="button"
                                  className={`capitalize ${
                                    member.membershipStatus === status
                                      ? "font-bold text-primary"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleStatusChange(
                                      member._id,
                                      status,
                                      member.membershipStatus,
                                      member.memberName
                                    )
                                  }>
                                  {status}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-primary/20 p-4">
        <span className="text-sm font-normal text-primary mb-2 sm:mb-0">
          Page {currentPage} of {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className={`px-4 py-2 text-sm border rounded-md transition-colors ${
              currentPage === 1
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-primary text-primary hover:bg-primary hover:text-white"
            }`}>
            Previous
          </button>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className={`px-4 py-2 text-sm border rounded-md transition-colors ${
              currentPage === totalPages || totalPages === 0
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-primary text-primary hover:bg-primary hover:text-white"
            }`}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}