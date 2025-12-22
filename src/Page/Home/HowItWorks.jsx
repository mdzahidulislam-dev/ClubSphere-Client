import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaCalendarAlt, FaRocket, FaUserPlus } from "react-icons/fa";

const steps = [
  {
    step: "01",
    title: "Create Your Club",
    desc: "Set up your club profile with basic details, logo, and branding in minutes.",
    icon: <FaUsers className="text-4xl" style={{ color: "#FF5656" }} />,
  },
  {
    step: "02",
    title: "Manage Members",
    desc: "Add members, assign roles, track attendance, and manage permissions effortlessly.",
    icon: <FaUserPlus className="text-4xl" style={{ color: "#FF5656" }} />,
  },
  {
    step: "03",
    title: "Organize Events",
    desc: "Create events, handle registrations, send reminders, and track RSVPs easily.",
    icon: <FaCalendarAlt className="text-4xl" style={{ color: "#FF5656" }} />,
  },
  {
    step: "04",
    title: "Grow Engagement",
    desc: "Boost member interaction with announcements, polls, chats, and activity feeds.",
    icon: <FaRocket className="text-4xl" style={{ color: "#FF5656" }} />,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-5 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20">
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight"
            style={{ color: "#FF5656" }}>
            How ClubSphere Works
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto font-medium">
            Get started in just 4 simple steps — powerful club management made
            easy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-2xl hover:border-[#FF5656]/30 transition-all duration-300">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#FF5656] to-[#ff7b00] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {item.step}
                </div>
              </div>

              <div className="flex justify-center mt-6 mb-6">{item.icon}</div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {item.title}
              </h3>

              <p className="text-gray-600 text-center leading-relaxed">
                {item.desc}
              </p>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-[#FF5656] to-[#ff7b00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-b-2xl"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
