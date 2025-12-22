import React from "react";
import { motion } from "framer-motion";
import { 
  FaTrophy, 
  FaHandshake, 
  FaLightbulb, 
  FaHeart, 
  FaUsersCog,
  FaChartLine 
} from "react-icons/fa";

const benefits = [
  {
    title: "Build Meaningful Connections",
    desc: "Meet like-minded people, form lasting friendships, and expand your personal and professional network.",
    icon: <FaHandshake className="text-5xl" style={{ color: "#FF5656" }} />
  },
  {
    title: "Develop New Skills",
    desc: "Learn from workshops, events, and hands-on activities designed to help you grow personally and professionally.",
    icon: <FaLightbulb className="text-5xl" style={{ color: "#FF5656" }} />
  },
  {
    title: "Boost Leadership Abilities",
    desc: "Take on roles, organize events, and lead initiatives that enhance your confidence and leadership skills.",
    icon: <FaTrophy className="text-5xl" style={{ color: "#FF5656" }} />
  },
  {
    title: "Give Back to Community",
    desc: "Participate in social impact projects, volunteering, and initiatives that make a real difference.",
    icon: <FaHeart className="text-5xl" style={{ color: "#FF5656" }} />
  },
  {
    title: "Teamwork & Collaboration",
    desc: "Work together on exciting projects, share ideas, and achieve common goals with passionate members.",
    icon: <FaUsersCog className="text-5xl" style={{ color: "#FF5656" }} />
  },
  {
    title: "Career Growth Opportunities",
    desc: "Gain experience, build your resume, and unlock networking that can open doors to future opportunities.",
    icon: <FaChartLine className="text-5xl" style={{ color: "#FF5656" }} />
  },
];

const WhyJoin = () => {
  return (
    <section className="py-10 ">
      <div className="max-w-7xl mx-auto px-5 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight"
            style={{ color: "#FF5656" }}
          >
            Why Join a Club?
          </h2>
          <p className="text-xl text-secondary max-w-3xl mx-auto font-medium">
            Joining a club is more than just an activity — it's an opportunity to grow, connect, and thrive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-2xl hover:border-[#FF5656]/30 transition-all duration-300 text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-linear-to-br from-[#FF5656]/10 to-[#ff7b00]/10 group-hover:from-[#FF5656]/20 group-hover:to-[#ff7b00]/20 transition-all duration-300">
                  {item.icon}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {item.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
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

export default WhyJoin;