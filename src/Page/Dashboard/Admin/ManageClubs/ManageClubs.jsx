import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import useAxios from "../../../../Hooks/useAxios";
import Loader from "../../../../Components/Loader";
import Swal from "sweetalert2";
import { RxCross2 } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import { toast } from "react-toastify";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Approved",
    value: "approved",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
  {
    label: "Pending",
    value: "pending",
  },
];

const TABLE_HEAD = [
  "Club Name",
  "Manager",
  "Stats",
  "Fee",
  "Status",
  "Actions",
];

export default function ManageClubs() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const axiosSecure = useAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [managers, setManagers] = useState({});

  

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/clubs");
      return res.data;
    },
  });

  useEffect(() => {
    if (!clubs.length) return;

    const fetchManagers = async () => {
      try {
        const uniqueEmails = [
          ...new Set(clubs.map((c) => c.managerEmail).filter(Boolean)),
        ];

        const results = await Promise.all(
          uniqueEmails.map(async (email) => {
            const res = await axiosSecure.get(`/users/${email}`);
            return res.data;
          })
        );

        const managerMap = {};
        results.forEach((m) => {
          managerMap[m.email] = m;
        });

        setManagers(managerMap);
      } catch (error) {
        console.error("Manager fetch failed", error);
      }
    };

    fetchManagers();
  }, [clubs, axiosSecure]);

  if (isLoading) return <Loader></Loader>;

  const Approve = async (id, clubName) => {

    Swal.fire({
      title: "Are you sure?",
      text: `You want to Approve "${clubName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF5656",
      cancelButtonColor: "#FFA239",
      confirmButtonText: "Yes, Approvd!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/clubs/${id}`, { status: "approved" });
          toast.success(`${clubName} is Approved`);
          // refresh clubs
          queryClient.invalidateQueries(["clubs"]);

          Swal.fire({
            title: "Approved!",
            text: `The "${clubName}" has been Approved"!!!`,
            icon: "success",
          });
        } catch (error) {
          toast.error("Failed to Approved Status");
          console.error(error);
        }
      }
    });
  };

  const Reject = (id, clubName) => {

    Swal.fire({
      title: "Are you sure?",
      text: `You want to reject "${clubName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF5656",
      cancelButtonColor: "#FFA239",
      confirmButtonText: "Yes, Reject!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/clubs/${id}`, { status: "rejected" });
          toast.success(`${clubName} is rejected`);
          // refresh clubs
          queryClient.invalidateQueries(["clubs"]);

          Swal.fire({
            title: "rejected!",
            text: `The "${clubName}" has been rejected"!!!`,
            icon: "success",
          });
        } catch (error) {
          toast.error("Failed to rejected Status");
          console.error(error);
        }
      }
    });
  };

  // Filter Clubs
  const filteredClubs = clubs.filter((club) => {
    const normalizedSearch = searchTerm
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "");

    const matchesSearch =
      club.clubName
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(normalizedSearch) ||
      club.managerEmail
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(normalizedSearch);

    const matchesStatus =
      activeTab === "all" ? true : club.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);

  const paginatedClubs = filteredClubs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="h-full w-full bg-white rounded-lg ">
      {/* Card Header */}
      <div className="py-6 text-center">
        <div className="mb-8  ">
          <h5 className="text-4xl font-semibold text-primary">Manage Clubs</h5>
          <p className="text-secondary mt-1 font-normal">
            Overview and moderation of registered clubs
          </p>
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
                placeholder="Search"
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
        <table className="w-full min-w-max table-auto text-left mb-6">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={head}
                  className="border-y border-primary/50 bg-primary/10 p-4 transition-colors hover:bg-primary/20 cursor-pointer">
                  <div className="flex items-center justify-between gap-2   text-black opacity-70 font-semibold">
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
            {filteredClubs.length === 0 ? (
              <tr>
                <td
                  colSpan={TABLE_HEAD.length}
                  className="text-center py-10 text-2xl text-primary/50 font-bold">
                  No Club Found
                </td>
              </tr>
            ) : (
              paginatedClubs.map(
                (
                  {
                    bannerImage,
                    clubName,
                    managerEmail,
                    UpdateDate,
                    createdDate,
                    membershipFee,
                    status,
                    _id,
                  },
                  index
                ) => {
                  const isLast = index === clubs.length - 1;
                  const classes = isLast
                    ? "p-4 "
                    : "p-4 border-b border-primary/20";

                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors">
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <img
                            src={bannerImage}
                            alt={clubName}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-normal text-gray-900">
                              {clubName}
                            </span>
                            <span className="text-sm font-normal text-gray-500">
                              {UpdateDate || createdDate}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        {managers[managerEmail] ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                managers[managerEmail]?.photoURL ||
                                "https://i.ibb.co/0Qp1W33/default-avatar.png"
                              }
                              className="h-10 w-10 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium">
                                {managers[managerEmail]?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {managers[managerEmail]?.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Loading...
                          </span>
                        )}
                      </td>

                      <td className={classes}>
                        <span className="text-sm font-normal text-gray-900">
                          <div>
                            <p className="text-sm font-medium">120 Member</p>
                            <p className="text-xs text-gray-500">5 Events</p>
                          </div>
                        </span>
                      </td>
                      <td className={classes}>
                        <span className="text-sm font-normal text-gray-900">
                          {membershipFee === "0" ? (
                            <span className="text-green-500 font-bold text-lg">
                              Free
                            </span>
                          ) : (
                            <span className="flex items-center">
                              ${membershipFee}/mo
                            </span>
                          )}
                        </span>
                      </td>
                      <td className={classes}>
                        <span
                          className={`inline-flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow ${
                            status === "pending"
                              ? "bg-yellow-500"
                              : status === "approved"
                              ? "bg-emerald-500"
                              : status === "rejected"
                              ? "bg-red-500"
                              : "bg-gray-400"
                          }`}>
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className={classes}>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              Approve(_id, clubName);
                            }}
                            className="p-2 text-green-600
                      bg-green-100  hover:bg-green-200 rounded-full transition-colors"
                            title="Approve Club">
                            <IoMdCheckmark className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              Reject(_id, clubName);
                            }}
                            className="p-2 text-primary
                      bg-primary/10  hover:bg-primary/20 rounded-full transition-colors"
                            title="Reject Club">
                            <RxCross2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
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
