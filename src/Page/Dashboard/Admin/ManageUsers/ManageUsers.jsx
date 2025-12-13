import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RiDeleteBin6Fill } from "react-icons/ri";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import useAxios from "../../../../Hooks/useAxios";
import Loader from "../../../../Components/Loader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Manager",
    value: "manager",
  },
  {
    label: "Member",
    value: "member",
  },
];

const TABLE_HEAD = ["Member", "Role", "Created At", "Actions"];

export default function ManageUsers() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const axiosSecure = useAxios();

  const roles = ["admin", "manager", "member"];

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });
  if (isLoading) return <Loader></Loader>;
  console.log(users);

  //  Role update
  const handleRoleChange = async (userId, newRole, currentRole) => {
    if (newRole === currentRole) return;
    Swal.fire({
      title: "Are you sure?",
      text: `You want to change role from "${currentRole}" to "${newRole}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF5656",
      cancelButtonColor: "#FFA239",
      confirmButtonText: "Yes, Change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.patch(`/users/${userId}`, { role: newRole });
          toast.success(`Role changed to ${newRole}`);
          // refresh users
          queryClient.invalidateQueries(["users"]);
        } catch (error) {
          toast.error("Failed to update role");
          console.error(error);
        }
        Swal.fire({
          title: "Changed!",
          text: `The "${currentRole}" has been changed to "${newRole}"!!!`,
          icon: "success",
        });
      }
    });

    if (!confirm) return;
  };

  const filteredUsers = users
    .filter((user) => activeTab === "all" || user.role === activeTab)
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="h-full w-full bg-white rounded-lg ">
      {/* Card Header */}
      <div className="py-6 text-center">
        <div className="mb-8  ">
          <h5 className="text-4xl font-semibold text-primary">
            All Members list
          </h5>
          <p className="text-secondary mt-1 font-normal">
            See information about all members
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
                  onClick={() => setActiveTab(value)}>
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className=" px-0">
        <table className="w-full min-w-max table-auto text-left">
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={TABLE_HEAD.length}
                  className="text-center py-10 text-2xl text-primary/50 font-bold">
                  No User Found
                </td>
              </tr>
            ) : (
              filteredUsers.map(
                ({ photoURL, name, email, role, createdDate, _id }, index) => {
                  const isLast = index === users.length - 1;
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
                            src={photoURL}
                            alt={name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-normal text-gray-900">
                              {name}
                            </span>
                            <span className="text-sm font-normal text-gray-500">
                              {email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className={classes}>
                        <div className="flex flex-col">
                          <span className="text-sm font-normal text-gray-900">
                            {role}
                          </span>
                        </div>
                      </td>

                      <td className={classes}>
                        <span className="text-sm font-normal text-gray-900">
                          {createdDate}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className={classes}>
                        <div className="flex items-center">
                          <div className="dropdown dropdown-center dropdown-left ">
                            <div
                              tabIndex={0}
                              role="button"
                              className=" mr-2 rounded-full   bg-primary/10 hover:bg-primary/20 text-primary btn-sm p-2">
                              <PencilIcon className="h-4 w-4" />
                            </div>
                            <ul
                              tabIndex="-1"
                              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                              {roles.map((item) => (
                                <li key={item}>
                                  <button
                                    type="button"
                                    className={`capitalize ${
                                      role === item
                                        ? "font-bold text-primary"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleRoleChange(_id, item, role)
                                    }>
                                    {item}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button
                            className="p-2 text-primary
                      bg-primary/10  hover:bg-primary/20 rounded-full transition-colors"
                            title="Delete User">
                            <RiDeleteBin6Fill className="h-4 w-4" />
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
          Page 1 of 10
        </span>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border border-primary rounded-md text-primary hover:bg-primary hover:text-white transition-colors">
            Previous
          </button>
          <button className="px-4 py-2 text-sm border border-primary rounded-md text-primary hover:bg-primary hover:text-white transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
