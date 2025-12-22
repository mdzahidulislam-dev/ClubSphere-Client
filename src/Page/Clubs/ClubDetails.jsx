import { MapPin } from "lucide-react";
import React from "react";
import { FaUsers } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";
import useRole from "../../Hooks/useRole";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../Components/Loader";
import { FaMoneyBills } from "react-icons/fa6";
import { ArrowLeft, Calendar, MapPinIcon, Clock } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ClubDetails = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: membership = null } = useQuery({
    queryKey: ["membership", user?.email, id],
    enabled: !!user?.email && !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/membership/${user.email}?clubId=${id}`
      );
      return res.data;
    },
  });

  const { data: club = null, isLoading } = useQuery({
    queryKey: ["club-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/club/${id}`);
      return res.data;
    },
  });

  const { data: manager = null } = useQuery({
    queryKey: ["user", club?.managerEmail],
    enabled: !!club?.managerEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${club.managerEmail}`);
      return res.data;
    },
  });

  // Fetch all events and filter by clubId
  const { data: allEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["all-events"],
    queryFn: async () => {
      const res = await axiosSecure.get("/all-events");
      return res.data;
    },
  });

  const { mutate: payClubFee } = useMutation({
    mutationFn: async (paymentInfo) => {
      const res = await axiosSecure.post(
        "/create-checkout-session",
        paymentInfo
      );
      return res.data.url;
    },
    onSuccess: (url) => {
      window.location.href = url;
      queryClient.invalidateQueries(["membership", user?.email, id]);
    },
  });

  if (isLoading || eventsLoading) return <Loader></Loader>;

  // Filter events for this specific club
  const clubEvents = allEvents.filter((event) => event.clubId === id);

  // Separate upcoming and ongoing events
  const upcomingEvents = clubEvents.filter(
    (event) => event.status === "upcoming"
  );
  const ongoingEvents = clubEvents.filter(
    (event) => event.status === "ongoing"
  );

  // const joinClub = async (club) => {
  //   if (!user) {
  //     return toast.error("Please login first");
  //   }

  //   const membershipPayload = {
  //     clubId: club._id,
  //     clubName: club.clubName,
  //     clubFee: club.membershipFee,
  //     clubManagerEmail: club.managerEmail,
  //     memberEmail: user.email,
  //     memberName: user.displayName,
  //     memberPhoto: user.photoURL,
  //     status: club.membershipFee === "0" ? "paid" : "pending",
  //   };

  //   if (club.membershipFee === "0") {
  //     try {
  //       await axiosSecure.post("/addMembership", membershipPayload);
  //       queryClient.invalidateQueries(["membership", user?.email, id]);
  //       Swal.fire({
  //         title: "Success!",
  //         text: `Successfully joined ${club.clubName}!`,
  //         icon: "success",
  //         confirmButtonText: "OK",
  //       });
  //     } catch (err) {
  //       if (err) {
  //         toast.error("Failed to join club. Please try again.");
  //       }
  //     }
  //     return;
  //   }

  //   payClubFee(membershipPayload);
  // };

  const joinClub = async (club) => {
    if (!user) {
      return navigate("/login");
    }

    if (role !== "member") {
      return toast.error("Only members can join clubs");
    }

    const membershipPayload = {
      clubId: club._id,
      clubName: club.clubName,
      clubFee: club.membershipFee,
      clubManagerEmail: club.managerEmail,
      memberEmail: user.email,
      memberName: user.displayName,
      memberPhoto: user.photoURL,
      status: club.membershipFee === "0" ? "paid" : "pending",
    };

    if (club.membershipFee === "0") {
      try {
        await axiosSecure.post("/addMembership", membershipPayload);
        queryClient.invalidateQueries(["membership", user?.email, id]);
        Swal.fire({
          title: "Success!",
          text: `Successfully joined ${club.clubName}!`,
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (err) {
        if (err) {
          toast.error("Failed to join club. Please try again.");
        }
      }
      return;
    }

    payClubFee(membershipPayload);
  };
  return (
    <div className="flex flex-col flex-1 mx-auto max-w-7xl px-5 lg:px-0 gap-8 my-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold w-fit">
        <ArrowLeft size={18} />
        Back
      </button>

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

          <h1 className="text-white text-2xl md:text-5xl font-bold leading-tight">
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

            {/* Upcoming Events */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-6">
                Upcoming Events ({upcomingEvents.length})
              </h2>

              {upcomingEvents.length === 0 ? (
                <div className="p-8 rounded-xl bg-gray-50 text-center">
                  <p className="text-primary/50 font-bold text-xl">
                    No upcoming events scheduled
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="p-5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer border border-primary/20"
                      onClick={() => navigate(`/event-details/${event._id}`)}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-800">
                          {event.eventName}
                        </h3>
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          Upcoming
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 text-gray-600">
                        <p className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary" />
                          {new Date(event.eventDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock size={16} className="text-primary" />
                          {event.eventTime}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPinIcon size={16} className="text-primary" />
                          {event.location}
                        </p>
                        {event.eventFee && (
                          <p className="flex items-center gap-2">
                            <FaMoneyBills size={16} className="text-primary" />
                            <span className="text-green-500 font-bold text-lg">
                              Free
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Ongoing Events */}
            <section>
              <h2 className="text-2xl font-bold text-primary mb-6">
                Ongoing Events ({ongoingEvents.length})
              </h2>

              {ongoingEvents.length === 0 ? (
                <div className="p-8 rounded-xl bg-gray-50 text-center">
                  <p className="text-primary/50 font-bold text-xl">
                    No ongoing events at the moment
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {ongoingEvents.map((event) => (
                    <div
                      key={event._id}
                      className="p-5 rounded-xl bg-green-50 hover:bg-green-100 transition-colors cursor-pointer border border-green-200"
                      onClick={() => navigate(`/event-details/${event._id}`)}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-800">
                          {event.eventName}
                        </h3>
                        <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold animate-pulse">
                          Ongoing
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 text-gray-600">
                        <p className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary" />
                          {new Date(event.eventDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock size={16} className="text-primary" />
                          {event.eventTime}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPinIcon size={16} className="text-primary" />
                          {event.location}
                        </p>
                        {event.eventFee && (
                          <p className="flex items-center gap-2">
                            <FaMoneyBills size={16} className="text-primary" />
                            <span className="text-green-500 font-bold text-lg">
                              Free
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-6 p-6 rounded-xl bg-primary/70">
              {/* {membership?.status === "paid" ? (
                <button
                  disabled
                  className="flex justify-center items-center h-12 rounded-lg bg-primary/50 text-white font-bold cursor-not-allowed">
                  Already Joined
                </button>
              ) : membership?.status === "pending" ? (
                <button
                  disabled
                  className="flex justify-center items-center h-12 rounded-lg bg-yellow-500 text-white font-bold cursor-not-allowed">
                  Payment Pending
                </button>
              ) : (
                <button
                  onClick={() => joinClub(club)}
                  className="flex justify-center items-center h-12 rounded-lg bg-primary hover:bg-[#e94848] text-white font-bold">
                  Join Club
                </button>
              )} */}

              {/* Show join button only for members or non-logged-in users */}
              {role === "member" || !user ? (
                <>
                  {!user ? (
                    <button
                      onClick={() => navigate("/login")}
                      className="flex justify-center items-center h-12 rounded-lg bg-primary hover:bg-[#e94848] text-white font-bold">
                      Login to Join
                    </button>
                  ) : membership?.status === "paid" ? (
                    <button
                      disabled
                      className="flex justify-center items-center h-12 rounded-lg bg-primary/50 text-white font-bold cursor-not-allowed">
                      Already Joined
                    </button>
                  ) : membership?.status === "pending" ? (
                    <button
                      disabled
                      className="flex justify-center items-center h-12 rounded-lg bg-yellow-500 text-white font-bold cursor-not-allowed">
                      Payment Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => joinClub(club)}
                      className="flex justify-center items-center h-12 rounded-lg bg-primary hover:bg-[#e94848] text-white font-bold">
                      Join Club
                    </button>
                  )}
                </>
              ) : (
                <div className="flex justify-center items-center h-12 rounded-lg bg-gray-100 text-gray-600 font-semibold">
                  Only Members Can Join
                </div>
              )}

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
                  <FaUsers /> {club.membersCount || 0}
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
