import React from "react";
import useAuth from "../../Hooks/useAuth";
import { Link } from "react-router-dom";
import element1 from "../../assets/element1.png";
import element2 from "../../assets/element2.png";
import element3 from "../../assets/element3.png";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { AtSign, Image } from "lucide-react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const { user, setLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!user) {
    setLoading(true);
    return null;
  }

  const updateInfo = (data) => {
    console.log(data);
  };
  return (
    <div className="">
      <title>My Profile</title>

      <div className=" mt-5  max-w-7xl mx-auto  grid grid-cols-1 md:grid-cols-2 pt-5 pb-25">
        <main className="relative flex flex-col items-center px-2 md:px-5 mx-5 rounded-4xl shadow-2xl justify-center  py-15 bg-white">
          <img
            src={element1}
            className=" object-cover absolute z-50 bottom-0 left-0"
          />
          <img
            src={element2}
            className=" object-cover absolute z-50 top-10 left-10"
          />
          <img
            src={element3}
            className=" object-cover absolute z-50 top-10 right-10"
          />
          <div className="flex flex-col items-center gap-4">
            <div>
              <img
                src={user?.reloadUserInfo.photoUrl}
                alt=""
                className="bg-center bg-cover rounded-full w-32 h-32 border-4 border-secondary"
              />
            </div>
            <div className="text-center">
              <p className="text-primary text-4xl font-bold">
                {user?.reloadUserInfo.displayName}
              </p>
              <p className=" text-base">{user?.reloadUserInfo.email}</p>
            </div>
          </div>

          <h3 className="text-secondary text-lg font-bold mt-8">Socials</h3>

          <div className=" flex justify-center gap-8 mt-3">
            <a href="#">
              <FaFacebookF
                size={40}
                color="#FF5656"
                className="hover:-translate-y-1 transition-all duration-300"></FaFacebookF>
            </a>

            <a href="#">
              <FaLinkedinIn
                size={40}
                color="#FF5656"
                className="hover:-translate-y-1 transition-all duration-300"></FaLinkedinIn>
            </a>
            <a href="#">
              <FaInstagram
                size={40}
                color="#FF5656"
                className="hover:-translate-y-1 transition-all duration-300"></FaInstagram>
            </a>
          </div>
        </main>
        <div className="flex flex-col items-center mt-10 mx-5 md:mt-0">
          <h2 className="text-secondary text-3xl font-bold mb-5">
            Edit Your Info
          </h2>
          <form
            onSubmit={handleSubmit(updateInfo)}
            className="w-full max-w-md md:w-96 flex flex-col">
            <div className="w-full space-y-6">
              <div className="relative w-full">
                <div className="flex items-center w-full bg-transparent border border-primary/60 h-12 rounded-full overflow-hidden px-4 gap-2">
                  <AtSign color="#FF5656" size={18} />
                  <input
                    type="text"
                    defaultValue={user?.reloadUserInfo.displayName}
                    placeholder="Your Name"
                    {...register("displayName", { required: true })}
                    className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full h-full"
                  />
                </div>

                {/* Popup Error */}
                {errors.displayName && (
                  <div className="absolute -top-5 mt-1 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-lg animate-fadeIn">
                    Name is Required
                  </div>
                )}
              </div>

              <div className="relative w-full">
                <div className="flex  items-center w-full bg-transparent border border-primary/60 h-12 rounded-full overflow-hidden px-4 gap-2">
                  <Image color="#FF5656" size={18} />
                  <input
                    type="text"
                    defaultValue={user?.reloadUserInfo.photoUrl}
                    {...register("photoURL", { required: true })}
                    placeholder="Enter your Image link"
                    className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full h-full"
                  />
                </div>
                {/* Popup Error */}
                {errors.photoURL && (
                  <div className="absolute -top-5 mt-1 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-lg animate-fadeIn">
                    Photo is Required
                  </div>
                )}
              </div>

              <div className="relative w-full">
                <div className="flex items-center w-full bg-transparent border border-primary/60 h-12 rounded-full overflow-hidden px-4 gap-2">
                  <svg
                    width="16"
                    height="11"
                    viewBox="0 0 16 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                      fill="#FF5656"
                    />
                  </svg>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    defaultValue={user?.reloadUserInfo.email}
                    placeholder="Your Email Address"
                    className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full h-full"
                  />
                </div>
                {/* Popup Error */}
                {errors.email && (
                  <div className="absolute -top-5 mt-1 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-lg animate-fadeIn">
                    Email is Required
                  </div>
                )}
                <button
                  type="submit"
                  className="mt-6 bg-hover md:mt-8 w-full h-12 rounded-full text-white bg-primary hover:opacity-90 transition-opacity font-medium">
                  Update Info
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
