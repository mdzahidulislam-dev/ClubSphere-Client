import { MapPin } from "lucide-react";
import React from "react";
import { FaUsers } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loader from "../../Components/Loader";
import { FaMoneyBills } from "react-icons/fa6";

const ClubDetails = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const { id } = useParams();

  const { data: club = null, isLoading } = useQuery({
    queryKey: ["club-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/club/${id}`);
      return res.data;
    },
  });
  const { data: manager = null } = useQuery({
    queryKey: ["user", user],
    enabled: !!club?.managerEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${club.managerEmail}`);
      return res.data;
    },
  });
  if (isLoading) return <Loader></Loader>;
  console.log(manager);

  return (
    <div className="flex flex-col flex-1 mx-auto max-w-7xl  px-5 lg:px-0  gap-8 my-8">
      <div
        className="bg-cover bg-center flex flex-col justify-end overflow-hidden min-h-[200px] lg:min-h-[600px] md:min-h-[500px] rounded-2xl"
        style={{
          backgroundImage: `linear-gradient(
            0deg,
            #ff5656 0%,
            #ff565600 50%
          ), url(${club.bannerImage})`,
        }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 lg:px-24 pb-8">
          <div className="flex h-8 items-center justify-center gap-x-2 rounded-lg bg-primary px-4 w-fit mb-4">
            <p className="text-white text-sm font-medium">{club.category}</p>
          </div>

          <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
            {club.clubName}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Content */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            {/* About */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-4">
                About this Club
              </h2>
              <p className="text-gray-500 leading-relaxed">
                {club.description}
              </p>
            </section>

            {/* Events */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-6">
                Ongoing Events
              </h2>

              <div className="flex flex-col gap-4">
                {[
                  "Sunrise Hike at Eagle Peak",
                  "Lakeside Trail Cleanup",
                  "Annual Winter Camping Trip",
                ].map((event, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-primary">
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      {event}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-primary mb-6">
                Upcoming Events
              </h2>

              <div className="flex flex-col gap-4">
                {[
                  "Sunrise Hike at Eagle Peak",
                  "Lakeside Trail Cleanup",
                  "Annual Winter Camping Trip",
                ].map((event, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-primary/50">
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      {event}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery */}
            <section>
              <h2 className="text-2xl font-bold text-primary  mb-6">Gallery</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuC585Tdo4wYNsxmhAV2UFDTmbtOwagDEGm7ePnri2RDbWAL_4GJfTLt_UYsb6JVWxCYhAYrhAQSR4rHjkabYWHyzkJuDG5NV2OP_a71b8RD_3BCAjWZ1KOE2D3xZSDU4XwUcQP0wYEiz1vwsfd3ZpZcaZLMgFuYxF3Xpf4PuOH2kDoiOhi6hRJWIzmeyAzBgyycZwijR09vjDPi_76a2Rn1jT_49jEtYZdm8Ys9iTKu-P8rXRAB_exnwp5XC0ntIa1o1_4q7M0iLe3h",
                ].map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-cover bg-center rounded-xl"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuC585Tdo4wYNsxmhAV2UFDTmbtOwagDEGm7ePnri2RDbWAL_4GJfTLt_UYsb6JVWxCYhAYrhAQSR4rHjkabYWHyzkJuDG5NV2OP_a71b8RD_3BCAjWZ1KOE2D3xZSDU4XwUcQP0wYEiz1vwsfd3ZpZcaZLMgFuYxF3Xpf4PuOH2kDoiOhi6hRJWIzmeyAzBgyycZwijR09vjDPi_76a2Rn1jT_49jEtYZdm8Ys9iTKu-P8rXRAB_exnwp5XC0ntIa1o1_4q7M0iLe3h",
                ].map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-cover bg-center rounded-xl"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuC585Tdo4wYNsxmhAV2UFDTmbtOwagDEGm7ePnri2RDbWAL_4GJfTLt_UYsb6JVWxCYhAYrhAQSR4rHjkabYWHyzkJuDG5NV2OP_a71b8RD_3BCAjWZ1KOE2D3xZSDU4XwUcQP0wYEiz1vwsfd3ZpZcaZLMgFuYxF3Xpf4PuOH2kDoiOhi6hRJWIzmeyAzBgyycZwijR09vjDPi_76a2Rn1jT_49jEtYZdm8Ys9iTKu-P8rXRAB_exnwp5XC0ntIa1o1_4q7M0iLe3h",
                ].map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-cover bg-center rounded-xl"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuC585Tdo4wYNsxmhAV2UFDTmbtOwagDEGm7ePnri2RDbWAL_4GJfTLt_UYsb6JVWxCYhAYrhAQSR4rHjkabYWHyzkJuDG5NV2OP_a71b8RD_3BCAjWZ1KOE2D3xZSDU4XwUcQP0wYEiz1vwsfd3ZpZcaZLMgFuYxF3Xpf4PuOH2kDoiOhi6hRJWIzmeyAzBgyycZwijR09vjDPi_76a2Rn1jT_49jEtYZdm8Ys9iTKu-P8rXRAB_exnwp5XC0ntIa1o1_4q7M0iLe3h",
                ].map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-cover bg-center rounded-xl"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuC585Tdo4wYNsxmhAV2UFDTmbtOwagDEGm7ePnri2RDbWAL_4GJfTLt_UYsb6JVWxCYhAYrhAQSR4rHjkabYWHyzkJuDG5NV2OP_a71b8RD_3BCAjWZ1KOE2D3xZSDU4XwUcQP0wYEiz1vwsfd3ZpZcaZLMgFuYxF3Xpf4PuOH2kDoiOhi6hRJWIzmeyAzBgyycZwijR09vjDPi_76a2Rn1jT_49jEtYZdm8Ys9iTKu-P8rXRAB_exnwp5XC0ntIa1o1_4q7M0iLe3h",
                ].map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-cover bg-center rounded-xl"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-6 p-6 rounded-xl  bg-primary/70">
              <button className="h-12 rounded-lg bg-primary hover:bg-[#e94848] text-white font-bold">
                Join Club
              </button>

              <div className="flex flex-col gap-4 text-slate-700 dark:text-white">
                <p className="flex items-center gap-1">
                  <MapPin size={16} /> {club.location}
                </p>
                <p>
                  <span className="font-medium">
                    {club.membershipFee === "0" ? (
                      <span className="text-green-500 font-bold text-lg">
                        Free
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <FaMoneyBills size={16} />${club.membershipFee}/mo
                      </span>
                    )}
                  </span>
                </p>
                <p className="flex items-center gap-1">
                  <FaUsers /> 142 Members
                </p>
              </div>

              <hr className="border-slate-200 dark:border-white/20" />

              <div>
                <h3 className="font-bold mb-3">Organizer</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={manager?.photoURL}
                    className="w-12 h-12 rounded-full object-cover"
                    alt="Organizer"
                  />
                  <div>
                    <p className="font-semibold">{manager?.name}</p>
                    <p className="text-sm opacity-70">{club.managerEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClubDetails;
