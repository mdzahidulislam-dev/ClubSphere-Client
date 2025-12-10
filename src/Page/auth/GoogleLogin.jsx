import React from "react";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import useAxios from "../../Hooks/useAxios";

const GoogleLogin = () => {
  const { signInWithGoogleFunc, setUser, setLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxios();

  const handelGoogleSignin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const result = await signInWithGoogleFunc();
      toast.success("Log in Successful");

      const userInfo = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: "member",
        createdAt: new Date().toISOString(),
        createdDate: new Date().toLocaleDateString("en-GB"),
        createdTime: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Save user in database
      await axiosSecure.post("/users", userInfo);
      setUser(result.user);

      // Navigate
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
    <button
      onClick={handelGoogleSignin}
      type="button"
      className="w-full mt-6 md:mt-8 bg-primary/10 flex items-center justify-center h-12 rounded-full hover:bg-primary/20 transition-colors">
      <img
        src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
        alt="googleLogo"
      />
    </button>
  );
};

export default GoogleLogin;
