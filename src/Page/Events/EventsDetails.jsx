import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../Components/Loader";
import { FaRegCalendar, FaRegClock } from "react-icons/fa";
import { MdOutlineConfirmationNumber } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import Swal from "sweetalert2";

const EventsDetails = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [isRegistering, setIsRegistering] = useState(false);

  //  if user is already registered
  const { data: registration = null, isLoading: checkingRegistration } =
    useQuery({
      queryKey: ["event-registration", user?.email, id],
      enabled: !!user?.email && !!id,
      queryFn: async () => {
        const res = await axiosSecure.get(
          `/event-registration/${user.email}?eventId=${id}`
        );
        return res.data;
      },
    });

  // Get event details
  const { data: event = null, isLoading } = useQuery({
    queryKey: ["events-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/event-details/${id}`);
      return res.data;
    },
  });

  if (isLoading || checkingRegistration) return <Loader></Loader>; // ✅ Add checkingRegistration

  const Register = async (eventData) => {
    // Check if user is logged in
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to register",
        icon: "warning",
      });
      return;
    }

    // ✅ Check if already registered
    if (registration) {
      Swal.fire({
        title: "Already Registered",
        text: "You are already registered for this event",
        icon: "info",
      });
      return;
    }

    try {
      setIsRegistering(true);

      const registrationData = {
        eventId: eventData._id,
        eventName: eventData.eventName,
        eventDate: eventData.eventDate,
        eventTime: eventData.eventTime,
        location: eventData.location,
        eventFee: eventData.eventFee,
        bannerImage: eventData.bannerImage,
        userEmail: user.email,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL || "",
        clubId: eventData.clubId,
        clubName: eventData.clubName,
        status: "registered",
        paymentId: null,
        registeredAt: new Date().toISOString(),
      };

      await axiosSecure.post("/event-registrations", registrationData);

      // ✅ Invalidate query to refresh registration status
      queryClient.invalidateQueries(["event-registration", user.email, id]);

      // Success
      Swal.fire({
        title: "Success!",
        text: "Registration successful!",
        icon: "success",
      });
    } catch (error) {
      console.error("Registration Error:", error);

      if (error.response?.data?.alreadyRegistered) {
        Swal.fire({
          title: "Already Registered",
          text: "You are already registered for this event",
          icon: "info",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Registration failed. Please try again.",
          icon: "error",
        });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <main className="flex flex-1 justify-center px-5 my-10">
      <div className="flex w-full max-w-7xl flex-1 flex-col gap-8">
        <div className="flex flex-col-reverse gap-8 md:flex-row md:gap-10">
          {/* Left Section - Event Details */}
          <div className="flex flex-col gap-6 md:w-2/3">
            <div className="flex flex-col gap-2">
              <h1 className="text-primary text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">
                {event?.eventName || "Tech Innovators Conference"}
              </h1>
              <p className="text-lg">
                Hosted by{" "}
                <a
                  className="font-semibold text-primary hover:underline"
                  href="#">
                  {event?.clubName || "Future Tech Society"}
                </a>
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-primary text-xl font-bold">
                About this event
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {event?.description ||
                  "Join us for the annual Tech Innovators Conference, a premier gathering of the brightest minds in technology."}
              </p>
            </div>
          </div>

          {/* Right Section - Event Card */}
          <div className="md:w-2/3 lg:w-1/3">
            <div className="sticky top-24 flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-primary/50 p-4 shadow-sm md:p-6">
              {/* Event Image */}
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                style={{
                  backgroundImage: `url("${event?.bannerImage || ""}")`,
                }}
                role="img"
                aria-label={event?.eventName || "Event banner"}
              />

              {/* Event Info */}
              <div className="flex flex-col gap-3">
                {/* Date */}
                <div className="flex items-center gap-2">
                  <FaRegCalendar size={20} className="text-primary" />
                  <p className="font-bold text-white">
                    {event?.eventDate || "TBD"}
                  </p>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2">
                  <FaRegClock size={20} className="text-primary" />
                  <p className="font-medium text-white">
                    {event?.eventTime || "TBD"}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2">
                  <FaLocationDot size={20} className="text-primary" />
                  <p className="font-medium text-white">
                    {event?.location || "TBD"}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <MdOutlineConfirmationNumber
                    size={22}
                    className="text-primary"
                  />
                  <p className="text-green-500 text-2xl font-bold">Free</p>
                </div>
              </div>

              {/* Register Button */}
              {registration?.status === "registered" ? (
                <button
                  disabled
                  className="flex justify-center items-center h-12 rounded-lg bg-primary/30 text-white font-bold cursor-not-allowed">
                  Already Registered ✓
                </button>
              ) : (
                <button
                  className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary text-white font-medium hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => Register(event)}
                  disabled={isRegistering || checkingRegistration}>
                  <span className="truncate">
                    {isRegistering
                      ? "Registering..."
                      : checkingRegistration
                      ? "Checking..."
                      : "Register"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventsDetails;
