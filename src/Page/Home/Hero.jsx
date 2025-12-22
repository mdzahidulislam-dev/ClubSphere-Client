import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router";

const slides = [
  {
    title: "Manage Your Club Effortlessly",
    description: "All-in-one membership, events, and communication platform.",
    image:
      "https://blog.skillest.com/wp-content/uploads/2025/03/How-to-Increase-Club-Head-Speed-.png",
  },
  {
    title: "Organize Events Seamlessly",
    description: "Create, manage, and track club events with ease.",
    image:
      "https://momentivesoftware.com/wp-content/uploads/2025/11/BlogCard_APT-10-Overlooked-Tactics-for-Increasing-Membership_2025.png",
  },
  {
    title: "Engage Members Better",
    description: "Keep members informed, connected, and active.",
    image:
      "https://tbicommunications.com/wp-content/uploads/2023/09/member-engagement.jpg",
  },
];

const Hero = () => {
  return (
    <section className="w-full relative bg-white text-gray-900">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        className="w-full h-[600px] md:h-[800px]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full relative bg-cover bg-center overflow-hidden animate-slideZoom"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="bg-black/40 p-6 md:p-12 rounded-xl text-center">
                  <h2
                    className="text-3xl md:text-5xl font-bold mb-4"
                    style={{ color: "#FF5656" }}
                  >
                    {slide.title}
                  </h2>

                  <p className="text-lg md:text-2xl text-white/90 mb-6">
                    {slide.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link
                      to="/clubs"
                      className="px-6 py-3 font-semibold rounded-lg transition hover:opacity-90"
                      style={{
                        backgroundColor: "#ff7b00",
                        color: "#fff",
                      }}
                    >
                      Join a Club
                    </Link>

                    <Link
                      to="/events"
                      className="px-6 py-3 font-semibold rounded-lg transition hover:opacity-90"
                      style={{
                        backgroundColor: "#FF5656",
                        color: "#fff",
                      }}
                    >
                      Register an Event
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
