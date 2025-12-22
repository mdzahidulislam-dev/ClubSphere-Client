import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Edit, MapPin, MoreVertical, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { FaPlus, FaRegCalendar, FaRegClock } from "react-icons/fa";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FaMoneyBills } from "react-icons/fa6";
import useAxios from "../../../../Hooks/useAxios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import Loader from "../../../../Components/Loader";
import Swal from "sweetalert2";
import { TbEyeSearch } from "react-icons/tb";
import { Link } from "react-router-dom";
import CreateNewEvent from "../../../../Components/CreateNewEvent";
import EditEvent from "../../../../Components/EditEvent";

const EventsManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const itemsPerPage = 8;
  const { user } = useAuth();
  const axiosSecure = useAxios();

  const {
    data: events = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myEvents", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <Loader></Loader>;

  // Filtered events
  const filteredevents = events.filter((event) => {
    const normalizedSearch = searchTerm
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "");

    const matchesSearch =
      event.eventName
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(normalizedSearch) ||
      event.location
        ?.toLowerCase()
        .replace(/\s+/g, "")
        .includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "all" ? true : event.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentevents = filteredevents.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredevents.length / itemsPerPage);

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
          await axiosSecure.delete(`/events/${id}`);
          queryClient.invalidateQueries(["all-events"]);
          refetch();
          Swal.fire({
            title: "Deleted!",
            text: "The event has been deleted.",
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

  const ongoingEvents = filteredevents.filter(
    (e) => e.status === "ongoing"
  ).length;

  const upcomingEvents = filteredevents.filter(
    (e) => e.status === "upcoming"
  ).length;

  const pastEvents = filteredevents.filter((e) => e.status === "past").length;

  return (
    <div className=" relative">
      <div className=" mx-auto  px-4 py-6 md:px-8 md:py-10 flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <div className=" relative justify-center ">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-4xl md:text-4xl font-semibold text-primary">
                My events Events
              </h1>
              <p className=" text-secondary">
                Manage your events Events, update details and monitor all in one
                place.
              </p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="md:absolute right-0 top-0 flex items-center w-full md:w-fit md:-mt-5 lg:mt-0 mt-5 gap-2 rounded-xl btn p-6  bg-primary hover:bg-hover text-sm font-bold shadow-lg shadow-primary/20 transition-all text-white transform hover:scale-[1.02] active:scale-[0.98]">
              <FaPlus />
              <span>Create New Event</span>
            </button>

            {isOpen && (
              <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl p-6 w-11/12 max-w-5xl h-11/12 overflow-y-auto relative">
                  <CreateNewEvent closeModal={() => setIsOpen(false)} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mt-5 text-center lg:px-10 md:px-5">
          {/* Total events */}
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ">
            <h2 className="text-4xl font-bold text-primary group-hover:text-red-500 transition">
              {filteredevents.length}
            </h2>
            <p className="mt-2 text-gray-600 font-medium">Total Events</p>
          </div>

          {/* Active */}
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ">
            <h2 className="text-4xl font-bold text-green-600 group-hover:text-green-700 transition">
              {ongoingEvents}
            </h2>
            <p className="mt-2 text-gray-600 font-medium">On Going</p>
          </div>

          {/* Expired */}
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ">
            <h2 className="text-4xl font-bold text-gray-400 group-hover:text-gray-600 transition">
              {pastEvents}
            </h2>
            <p className="mt-2 text-gray-600 font-medium">Past</p>
          </div>

          {/* Pending Payment */}
          <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ">
            <h2 className="text-4xl font-bold text-yellow-500 group-hover:text-yellow-600 transition">
              {upcomingEvents}
            </h2>
            <p className="mt-2 text-gray-600 font-medium">Up Coming</p>
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
                  ? "ongoing"
                  : prev === "ongoing"
                  ? "upcoming"
                  : prev === "upcoming"
                  ? "past"
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

        {/* event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {currentevents.length > 0 ? (
            currentevents.map((event) => {
              return (
                <div
                  key={event._id}
                  className="max-w-sm mx-auto mt-8 event-card group transition-transform duration-500 ease-in-out hover:scale-102">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl flex flex-col h-full">
                    {/* Background Image */}
                    <div className="relative h-48 bg-linear-to-br from-orange-200 to-fuchsia-600-800">
                      <img
                        src={event.bannerImage}
                        alt={event.eventName}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                      />

                      {/* status Badge */}
                      <div
                        className={`absolute top-4 right-4 flex items-center gap-1.5 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg ${
                          event.status === "ongoing"
                            ? "bg-green-500"
                            : event.status === "upcoming"
                            ? "bg-yellow-500"
                            : event.status === "past"
                            ? "bg-gray-500"
                            : "bg-gray-400"
                        }`}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        {event.status}
                      </div>

                      <div className="-mb-1 absolute inset-0 bg-linear-to-t from-[#da4848] via-[#da4848]/10 to-transparent"></div>
                    </div>

                    {/* Content Section */}
                    <div className="relative bg-third px-6 py-5 flex flex-col grow">
                      <div className="flex flex-col grow gap-2 mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <h2 className="text-2xl font-bold text-white">
                            {event.eventName?.length > 35
                              ? event.eventName.slice(0, 35) + "..."
                              : event.eventName}
                          </h2>
                          <button className="text-white hover:text-white transition-colors p-1">
                            <MoreVertical size={20} />
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-sm mb-4 leading-relaxed grow">
                          {event.description?.length > 80
                            ? event.description.slice(0, 80) + "..."
                            : event.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <FaRegCalendar size={16} />
                          <span className="font-medium">{event.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <FaRegClock size={16} />
                          <span className="font-medium">{event.eventTime}</span>
                        </div>

                        {/* Info Row */}

                        <div className="flex items-center gap-1.5 text-gray-300">
                          <MapPin size={16} />
                          <span className="font-medium">
                            {event.location?.length > 25
                              ? event.location.slice(0, 25) + "..."
                              : event.location}
                          </span>
                        </div>

                        {/* price */}
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <span className="font-medium">
                            {event.eventFee === "0" ? (
                              <span className="text-green-500 font-bold text-lg">
                                Free
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <FaMoneyBills size={16} className="mr-1" />$
                                {event.eventFee}/mo
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons at Bottom */}
                      <div className="flex gap-3 mt-auto">
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setEditOpen(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 bg-forth text-white py-2.5 rounded-lg font-medium">
                          <Edit size={18} />
                          Edit
                        </button>

                        <button
                          onClick={() => Delete(event._id)}
                          className="flex items-center justify-center bg-forth text-white px-4 py-2.5 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                        <Link
                          to={`/dashboard/manager/event-details/${event._id}`}
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
              No event Found
            </div>
          )}
          {editOpen && (
            <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl p-6 w-11/12 max-w-5xl h-11/12 overflow-y-auto relative">
                <EditEvent
                  closeModal={() => setEditOpen(false)}
                  selectedEvent={selectedEvent}
                />
              </div>
            </div>
          )}
        </div>
        {currentevents.length === 0 ? (
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

export default EventsManagement;
