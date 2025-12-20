import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Edit, MapPin, MoreVertical, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import CreateNewClub from "../../../../Components/CreateNewClub";
import { FaMoneyBills } from "react-icons/fa6";
import useAxios from "../../../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import Loader from "../../../../Components/Loader";
import Swal from "sweetalert2";
import EditClub from "../../../../Components/EditClub";
import { TbEyeSearch } from "react-icons/tb";
import { Link } from "react-router-dom";

const MyClubs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const {
    data: clubs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${user.email}`);
      return res.data;
    },
  });
  if (isLoading) return <Loader></Loader>;

  // Filtered clubs
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
      club.location
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "all" ? true : club.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClubs = filteredClubs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);

  // Delete Function
  const Delete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/clubs/${id}`);
          refetch();
          Swal.fire({
            title: "Deleted!",
            text: "The club has been deleted.",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Something went wrong.",
            icon: "error",
          });
          console.log(error);
        }
      }
    });
  };

  const approvedClubs = filteredClubs.filter(
    (c) => c.status === "approved"
  ).length;
  const rejectedClubs = filteredClubs.filter(
    (c) => c.status === "rejected"
  ).length;
  const pendingClubs = filteredClubs.filter(
    (c) => c.status === "pending"
  ).length;

  return (
    <div className=" relative">
      <div className=" mx-auto  px-4 py-6 md:px-8 md:py-10 flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <div className=" relative justify-center ">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-4xl md:text-4xl font-semibold text-primary">
                My Clubs
              </h1>
              <p className=" text-secondary">
                Manage your clubs, update details and monitor membership status
                all in one place.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="md:absolute right-0 top-0 flex items-center w-full md:w-fit md:-mt-5 lg:mt-0 mt-5 gap-2 rounded-xl btn p-6  bg-primary hover:bg-hover text-sm font-bold shadow-lg shadow-primary/20 transition-all text-white transform hover:scale-[1.02] active:scale-[0.98]">
              <FaPlus />
              <span>Create New Club</span>
            </button>

            {isOpen && (
              <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl p-6 w-11/12 max-w-5xl h-11/12 overflow-y-auto relative">
                  <CreateNewClub closeModal={() => setIsOpen(false)} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mt-5 text-center lg:px-10 md:px-5">
          {/* Total Clubs */}
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ">
            <h2 className="text-4xl font-bold text-primary group-hover:text-red-500 transition">
              {filteredClubs.length}
            </h2>
            <p className="mt-2 text-gray-600 font-medium">Total Clubs</p>
          </div>

          {/* Active */}
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ">
            <h2 className="text-4xl font-bold text-green-600 group-hover:text-green-700 transition">
              {approvedClubs}
            </h2>
            <p className="mt-2 text-gray-600 font-medium">Approved</p>
          </div>

          {/* Expired */}
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ">
            <h2 className="text-4xl font-bold text-gray-400 group-hover:text-gray-600 transition">
              {rejectedClubs}
            </h2>
            <p className="mt-2 text-gray-600 font-medium">Rejected</p>
          </div>

          {/* Pending Payment */}
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ">
            <h2 className="text-4xl font-bold text-yellow-500 group-hover:text-yellow-600 transition">
              {pendingClubs}
            </h2>
            <p className="mt-2 text-gray-600 font-medium">Pending</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 bg-surface-dark  rounded-xl justify-between">
          {/* Search */}
          <div className="w-full lg:w-220">
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

          <button
            onClick={() => {
              setStatusFilter((prev) =>
                prev === "all"
                  ? "approved"
                  : prev === "approved"
                  ? "pending"
                  : prev === "pending"
                  ? "rejected"
                  : "all"
              );
              setCurrentPage(1);
            }}
            className="flex h-11 items-center gap-2 rounded-lg bg-primary border border-primary/20 hover:bg-hover px-4 transition-colors btn">
            <span className="text-white text-sm font-medium">
              {statusFilter === "all"
                ? "All Statuses"
                : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </span>
            <IoIosArrowDropdownCircle className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Club Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {currentClubs.length > 0 ? (
            currentClubs.map((club) => {
              return (
                <div
                  key={club._id}
                  className="max-w-sm mx-auto mt-8 club-card group transition-transform duration-500 ease-in-out hover:scale-102">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl flex flex-col h-full">
                    {/* Background Image */}
                    <div className="relative h-48 bg-linear-to-br from-orange-200 to-fuchsia-600-800">
                      <img
                        src={club.bannerImage}
                        alt={club.clubName}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                      />

                      {/* status Badge */}
                      <div
                        className={`absolute top-4 right-4 flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${
                          club.status === "pending"
                            ? "bg-yellow-500"
                            : club.status === "approved"
                            ? "bg-emerald-500"
                            : club.status === "rejected"
                            ? "bg-red-500"
                            : "bg-gray-400"
                        }`}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        {club.status}
                      </div>

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
                                  <FaMoneyBills size={16} />$
                                  {club.membershipFee}/mo
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons at Bottom */}
                      <div className="flex gap-3 mt-auto">
                        <button
                          onClick={() => {
                            setSelectedClub(club);
                            setEditOpen(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 bg-forth text-white py-2.5 rounded-lg font-medium">
                          <Edit size={18} />
                          Edit
                        </button>

                        <button
                          onClick={() => Delete(club._id)}
                          className="flex items-center justify-center bg-forth text-white px-4 py-2.5 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                        <Link
                          to={`/dashboard/manager/club-details/${club._id}`}
                          className="flex items-center justify-center bg-forth text-white px-4 py-2.5 rounded-lg transition-colors">
                          <TbEyeSearch size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-primary/50 text-3xl py-20 font-bold">
              No Club Found
            </div>
          )}
          {editOpen && (
            <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl p-6 w-11/12 max-w-5xl h-11/12 overflow-y-auto relative">
                <EditClub
                  closeModal={() => setEditOpen(false)}
                  selectedClub={selectedClub}
                />
              </div>
            </div>
          )}
        </div>
        {currentClubs.length === 0 ? (
          ""
        ) : (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-primary text-text-secondary hover:text-white hover:bg-primary transition-colors">
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === i + 1
                    ? "bg-primary text-white font-bold"
                    : "border border-primary text-black hover:text-white hover:bg-primary"
                }`}>
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-primary text-text-secondary hover:text-white hover:bg-primary transition-colors">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClubs;
