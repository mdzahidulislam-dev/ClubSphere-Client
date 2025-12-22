import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

const categories = [
  {
    title: "Technology & Innovation",
    desc: "Dive into AI, robotics, and cutting-edge projects with passionate innovators.",
    bgImage:
      "https://www.qut.edu.au/__data/assets/image/0007/1373749/varieties/thumb-full.jpg",
  },
  {
    title: "Sports & Fitness",
    desc: "Team up for thrilling games, tournaments, and fitness challenges on campus.",
    bgImage:
      "https://img.texasmonthly.com/2025/04/alief-elsik-soccer-update-1.jpg",
  },
  {
    title: "Arts & Culture",
    desc: "Unleash creativity in dance, theater, music, and vibrant cultural performances.",
    bgImage:
      "https://www.scmsbengaluru.edu.in/assets/images/student-clubs-and-committee/CULTURAL-CLUB/1.webp",
  },
  {
    title: "Business & Entrepreneurship",
    desc: "Pitch bold ideas, network with mentors, and build the next big startup.",
    bgImage: "https://cdn.geekwire.com/wp-content/uploads/2025/06/kymavi.png",
  },
];

const PopularCategories = () => {
  return (
    <section className="relative py-20 sm:py-10 md:py-15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-10 pl-15">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-14 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-red-500 via-orange-400 to-red-500 bg-clip-text text-transparent">
              Popular Categories
            </span>
          </h2>
          <p className="mt-5 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-secondary">
            Explore thriving club communities that spark passion, growth, and
            unforgettable experiences.
          </p>
        </motion.div>

        <div className="max-w-xl sm:max-w-2xl md:max-w-2xl lg:max-w-4xl mx-auto">
          <Swiper
            modules={[Autoplay, EffectCards]}
            effect="cards"
            grabCursor={true}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            speed={800}
            className="categories-swiper">
            {categories.map((item, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="relative overflow-hidden rounded-2xl
                             h-[420px] sm:h-[520px] md:h-[620px] lg:h-[700px]
                             shadow-xl bg-black">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: `url(${item.bgImage})` }}
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

                  <div className="absolute bottom-0 p-6 sm:p-10 md:p-14 text-white">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg max-w-xl leading-relaxed opacity-95">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;