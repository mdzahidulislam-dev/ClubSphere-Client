import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MapPin, MoreVertical } from "lucide-react";
import React, { useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FaMoneyBills, FaRegCalendar, FaRegClock } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import Loader from "../../Components/Loader";
import { MdOutlinePageview } from "react-icons/md";
import { Link } from "react-router-dom";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const axiosSecure = useAxios();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["all-events"],
    queryFn: async () => {
      const res = await axiosSecure.get("/all-events");
      return res.data;
    },
  });
  console.log(events);

  if (isLoading) return <Loader></Loader>;



  // Filtered events
  const filteredClubs = events.filter((event) => {
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


    const matchesPrice =
      priceFilter === "all"
        ? true
        : priceFilter === "free"
        ? Number(event.eventFee) === 0
        : Number(event.eventFee) > 0;

    return matchesSearch  && matchesPrice;
  });

  // pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClubs = filteredClubs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);

  return (
    <div className=" relative ">
      <div className=" mx-auto max-w-7xl  px-5 lg:px-0 flex flex-col gap-8 my-8">
        <div className="flex flex-col gap-6">
          <div className=" relative justify-center ">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-4xl md:text-4xl font-semibold text-primary">
                All Events
                <span className="text-lg"> ({filteredClubs.length})</span>
              </h1>
              <p className=" text-secondary">
                Browse all available events, explore details, and find the
                perfect community for you.
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4   rounded-xl justify-between">
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
          <div className="flex gap-4">
            <div className="relative w-full md:w-40">
              <select
                value={priceFilter}
                onChange={(e) => {
                  setPriceFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none w-full h-11 pl-3 pr-8 border border-primary rounded-lg bg-primary/90 text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="all">All</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>

              <IoIosArrowDropdownCircle
                className="absolute top-1/2 right-2 -translate-y-1/2 text-white pointer-events-none"
                size={20}
              />
            </div>
            
          </div>
        </div>

        {/* Club Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {currentClubs.length > 0 ? (
            currentClubs.map((event) => {
              return (
                <div
                  key={event._id}
                  className=" mt-4 event-card group transition-transform duration-500 ease-in-out hover:scale-102">
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
                        <Link
                          to={`/event-details/${event._id}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-forth text-white py-2.5 rounded-lg font-medium">
                          <MdOutlinePageview size={18} />
                          view Details
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

export default Events;
