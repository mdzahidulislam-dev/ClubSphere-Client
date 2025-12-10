import { AtSign, Image } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import image from "../../assets/art-sketch.png";
import { useForm } from "react-hook-form";
import PhotoInput from "../../Components/PhotoInput";
import axios from "axios";
import GoogleLogin from "./GoogleLogin";
import useAxios from "../../Hooks/useAxios";

const SignUp = () => {
  const { createUserWithEmailAndPasswordfunc, updateProfileFunc, setLoading } =
    useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(true);
  const axiosSecure = useAxios();

  console.log(location.state);

  const signUp = async (data) => {
    try {
      setLoading(true);
      const profileImg = data.photo[0];

      // 1️⃣ Create user
      await createUserWithEmailAndPasswordfunc(data.email, data.password);
      setLoading(true);
      toast.success("Sign up Successful");

      // 2️⃣ Upload profile image to imgbb
      let photoURL = "";
      if (profileImg) {
        const formData = new FormData();
        formData.append("image", profileImg);

        const url = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_hosting_key
        }`;

        const res = await axios.post(url, formData);
        photoURL = res.data.data.display_url;
      }
      const userInfo = {
        name: data.displayName,
        email: data.email,
        photoURL: photoURL,
        role: "member"
      };

      axiosSecure.post("/users", userInfo).then(() => {});

      // 3️⃣ Update Firebase profile
      await updateProfileFunc({
        displayName: data.displayName,
        photoURL,
      });
      navigate(location.state || "/");
    } catch (error) {
      const cleanMessage = error.code
        ? error.code.replace("auth/", "").replaceAll("-", " ")
        : error.message;
      toast.error(cleanMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto items-center px-4 py-4 pb-15 lg:pt-10">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-8 md:py-0">
        <form
          className="w-full max-w-md md:w-96 flex flex-col"
          onSubmit={handleSubmit(signUp)}>
          <div className="flex flex-col items-center justify-center mb-6">
            <h2 className="text-3xl md:text-4xl font-medium text-primary">
              Sign up
            </h2>
            <p className="text-sm text-gray-500/90 mt-3 text-center">
              Welcome! Please Sign up to continue
            </p>
          </div>
          <GoogleLogin />

          <div className="flex items-center gap-4 w-full my-5">
            <div className="w-full h-px bg-gray-300/90"></div>
            <p className="text-nowrap text-sm text-gray-500/90 px-2">
              or Sign up with email
            </p>
            <div className="w-full h-px bg-gray-300/90"></div>
          </div>

          <div className="w-full space-y-6">
            <div className="relative w-full">
              <div className="flex items-center w-full bg-transparent border border-primary/60 h-12 rounded-full overflow-hidden px-4 gap-2">
                <AtSign color="#FF5656" size={18} />
                <input
                  type="text"
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
              <div className="">
                <PhotoInput>
                  <input
                    className="file-input-bordered file-input-primary file-input w-full bg-transparent text-sm"
                    type="file"
                    {...register("photo", { required: true })}
                  />
                </PhotoInput>
              </div>
              {errors.photo && (
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
            </div>

            <div className="relative w-full">
              <div className="flex items-center w-full bg-transparent border border-primary/60 h-12 rounded-full overflow-hidden px-4 gap-2">
                <svg
                  width="13"
                  height="17"
                  viewBox="0 0 13 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                    fill="#FF5656"
                  />
                </svg>

                <input
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    validate: {
                      uppercase: (v) =>
                        /[A-Z]/.test(v) || "Must Have an uppercase letter",
                      lowercase: (v) =>
                        /[a-z]/.test(v) || "Must Have a lowercase letter",
                      length: (v) => v.length >= 6 || "Minimum 6 characters",
                    },
                  })}
                  className="bg-transparent placeholder-gray-500/80 outline-none text-sm w-full h-full"
                />

                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="text-gray-500">
                  {show ? (
                    <FaRegEyeSlash color="#FF5656" />
                  ) : (
                    <FaRegEye color="#FF5656" />
                  )}
                </button>
              </div>

              {/* Popup Error */}
              {errors.password && (
                <div className="absolute -top-5 mt-1 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-lg animate-fadeIn z-10 whitespace-nowrap">
                  {errors.password.message}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn mt-6 bg-hover md:mt-8 w-full h-12 rounded-full text-white bg-primary hover:opacity-90 transition-opacity font-medium">
            Sign up
          </button>

          <p className="text-gray-500/90 text-sm mt-4 text-center">
            Already Have an account?{" "}
            <Link
              state={location.state}
              to="/login"
              className="text-primary hover:underline font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center mt-8 lg:mt-0 px-4 lg:px-8">
        <img
          src={image}
          alt="signup"
          className="w-full max-w-lg object-cover rounded-lg shadow-xl md:shadow-2xl"
        />
      </div>
    </div>
  );
};

export default SignUp;
