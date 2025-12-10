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

  const handelGoogleSignin = (e) => {
    setLoading(true);
    e.preventDefault();
    signInWithGoogleFunc()
      .then((result) => {
        toast.success("Log in Succesful");

        const userInfo = {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          role: "member"
        };

        axiosSecure.post("/users", userInfo).then(() => {});

        setUser(result.user);
        navigate(location.state || "/");
      })
      .catch((error) => {
        const cleanMessage = error.code
          .replace("auth/", "")
          .replaceAll("-", " ");
        toast.error(cleanMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  console.log(location.state);

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
