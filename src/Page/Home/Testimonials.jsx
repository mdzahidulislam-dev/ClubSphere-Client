import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "MD Amdad Islam",
    role: "President, Tech Innovators Club",
    quote:
      "ClubSphere transformed how we manage our club. Events are now seamless, and member engagement has skyrocketed!",
    avatar: "https://avatars.githubusercontent.com/u/195456266?v=4",
  },
  {
    name: "Obaidullah Miazi",
    role: "Member, Entrepreneurship Society",
    quote:
      "Thanks to ClubSphere, I built lifelong connections and developed leadership skills I never knew I had.",
    avatar: "https://avatars.githubusercontent.com/u/219156601?v=4",
  },
  {
    name: "Md Zahidul Islam",
    role: "Organizer, Creative Arts Club",
    quote:
      "The platform is intuitive and powerful. Organizing events and communicating with members has never been easier.",
    avatar: "https://avatars.githubusercontent.com/u/92626624?v=4",
  },
  {
    name: "Md Rijoan Maruf",
    role: "Vice President, Debate Club",
    quote:
      "ClubSphere helped us grow from 20 to over 100 active members. It's the all-in-one tool every club needs.",
    avatar: "https://avatars.githubusercontent.com/u/78620963?v=4",
  },
  {
    name: "LITAN MOLLA",
    role: "Member, Environmental Action Group",
    quote:
      "I love how easy it is to stay connected and participate in initiatives that make a real impact.",
    avatar: "https://avatars.githubusercontent.com/u/185999515?v=4",
  },
];

const Testimonials = () => {
  return (
    <section className=" overflow-hidden">
      <div className="max-w-7xl mx-auto ">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-14 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight">
            <span className="bg-linear-to-r from-[#FF5656] to-[#ff7b00] bg-clip-text text-transparent">
              What Our Members Say
            </span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-secondary max-w-3xl mx-auto">
            Real stories from club leaders and members who love using
            ClubSphere.
          </p>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop
          grabCursor
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12">
          {testimonials.map((item, index) => (
            <SwiperSlide key={index} className="h-full pb-15 px-5 lg:px-0">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-gray-100 
                           min-h-[400px] flex flex-col 
                           hover:-translate-y-2 hover:shadow-2xl 
                           transition-all duration-300 ">
                <img
                  src="https://cdn.prod.website-files.com/65f178221acfb3ab01f09d6a/66438b9b32c661120f08b48b_Coral%20Quotation%20Marks.png"
                  alt="Quote"
                  className="w-12 h-12 sm:w-14 sm:h-14 mb-5 opacity-70"
                />

                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8 grow italic">
                  “{item.quote}”
                </p>

                <div className="flex items-center gap-4">
                  <div className="p-0.5 rounded-full bg-linear-to-r from-[#FF5656] to-[#ff7b00]">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900">
                      {item.name}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      {item.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
