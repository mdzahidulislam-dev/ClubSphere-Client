import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {  Edit, MapPin, MoreVertical, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import CreateNewClub from "../../../../Components/CreateNewClub";
import { FaMoneyBills } from "react-icons/fa6";

const MyClubs = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=" relative">
      {/* Mobile Header Placeholder (visible only on small screens) */}

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
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <button className="flex h-11 items-center gap-2 rounded-lg bg-primary border border-primary/20 hover:bg-hover px-4 transition-colors btn">
            <span className="text-white text-sm font-medium">All Statuses</span>
            <IoIosArrowDropdownCircle className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Club Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="max-w-sm mx-auto mt-8 club-card group">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              {/* Background Image */}
              <div className="relative h-48 bg-linear-to-br from-orange-200 to-fuchsia-600-800">
                <img
                  src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80"
                  alt="Tennis courts"
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out
    group-hover:scale-110"
                />

                {/* Active Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  Active
                </div>

                {/* Gradient Overlay */}
                <div className="-mb-1 absolute inset-0 bg-linear-to-t from-[#da4848] via-[#da4848]/10 to-transparent"></div>
              </div>

              {/* Content Section */}
              <div className="relative bg-third px-6 py-5 ">
                {/* Header with Menu */}
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl font-bold text-white">
                    Sunset Tennis Club
                  </h2>
                  <button className="text-white hover:text-white transition-colors p-1">
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  A premier tennis community located in the heart of downtown.
                  Weekly
                </p>

                {/* Info Row */}
                <div className="flex items-center gap-4 text-sm mb-5">
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <MapPin size={16} />
                    <span className="font-medium">San Diego, CA</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <FaMoneyBills size={16} />
                    <span className="font-medium">$120/mo</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-forth hover:bg-slate-600 text-white py-2.5 rounded-lg transition-colors font-medium">
                    <Edit size={18} />
                    Edit
                  </button>
                  <button className="flex items-center justify-center bg-forth hover:bg-red-600 text-white px-4 py-2.5 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-primary pt-6 mt-4">
          <p className="text-sm text-primary">
            Showing <span className=" font-bold">1 - 5</span> of{" "}
            <span className=" font-bold">12</span> clubs
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-primary text-text-secondary hover:text-white hover:bg-surface-highlight transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-background-dark font-bold hover:bg-[#0acaca] transition-colors">
              1
            </button>
            <button className="px-4 py-2 rounded-lg border border-primary text-text-secondary hover:text-white hover:bg-surface-highlight transition-colors">
              2
            </button>
            <button className="px-4 py-2 rounded-lg border border-primary text-text-secondary hover:text-white hover:bg-surface-highlight transition-colors">
              3
            </button>
            <button className="px-4 py-2 rounded-lg border border-primary text-text-secondary hover:text-white hover:bg-surface-highlight transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClubs;
