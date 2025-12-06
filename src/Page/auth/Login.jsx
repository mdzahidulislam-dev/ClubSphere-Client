import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import image from "../../assets/art-sketch.png";
import { useForm } from "react-hook-form";

const Login = () => {
  const [email, setemail] = useState("");
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const {
    signInWithEmailAndPasswordFunc,
    setLoading,
    signInWithGoogleFunc,
    setUser,
  } = useAuth();

  const handelGoogleSignin = (e) => {
    e.preventDefault();
    signInWithGoogleFunc()
      .then((result) => {
        toast.success("Log in Succesful");
        setUser(result.user);
        navigate("/");
      })
      .catch((error) => {
        const cleanMessage = error.code
          .replace("auth/", "")
          .replaceAll("-", " ");
        toast.error(cleanMessage);
      });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = (data) => {
    console.log(data);
    signInWithEmailAndPasswordFunc(data.email, data.password)
      .then((result) => {
        setUser(result.user);
        toast.success("Log in Succesful");
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        const cleanMessage = error.code
          .replace("auth/", "")
          .replaceAll("-", " ");
        if (cleanMessage == "invalid credential") {
          toast.error("Email or password is incorrect.");
        } else {
          toast.error(cleanMessage);
        }
      });
    
  }


  return (
    <div className="flex flex-col lg:flex-row max-w-7xl  mx-auto  items-center px-4 py-4 pb-15 lg:pt-15">
  <title>login</title>
  
  <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-8 md:py-0">
    <form
      className="w-full max-w-md md:w-96 flex flex-col items-center justify-center"
      onSubmit={handleSubmit(login)}>
      
      <h2 className="text-3xl md:text-4xl font-medium text-primary">Log in</h2>
      <p className="text-sm text-gray-500/90 mt-3 text-center">
        Welcome back! Please Log in to continue
      </p>

      <button
        onClick={handelGoogleSignin}
        type="button"
        className="w-full mt-6 md:mt-8 bg-primary/10 flex items-center justify-center h-12 rounded-full hover:bg-primary/20 transition-colors">
        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
          alt="googleLogo"
        />

      </button>

      <div className="flex items-center gap-4 w-full my-5">
        <div className="w-full h-px bg-gray-300/90"></div>
        <p className="text-nowrap text-sm text-gray-500/90 px-2">
          or log in with email
        </p>
        <div className="w-full h-px bg-gray-300/90"></div>
      </div>

      <div className="w-full space-y-4">
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
            value={email}
            onChange={(e) => setemail(e.target.value)}
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
            type={show ? "password" : "text"}
            placeholder="Password"
            {...register("password", { required: true })}
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
                <div className="absolute -top-5 mt-1 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-lg animate-fadeIn">
                  Password is Required
                </div>
              )}
        </div>
      </div>

      <div className="w-full flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <input
            className="h-5 w-5 accent-primary"
            type="checkbox"
            id="checkbox"
            {...register("remember")}
          />
          <label className="text-sm text-gray-500/80" htmlFor="checkbox">
            Remember me
          </label>
        </div>
        
        <Link to='/forgot-password' state={{email}} className="text-sm text-primary hover:underline">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        className="mt-6 bg-hover md:mt-8 w-full h-12 rounded-full text-white bg-primary hover:opacity-90 transition-opacity font-medium">
        Login
      </button>
      
      <p className="text-gray-500/90 text-sm mt-4 text-center">
        Don't have an account?{" "}
        <Link
          to="/sign-up"
          className="text-primary hover:underline font-medium">
          Sign up
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

export default Login;
