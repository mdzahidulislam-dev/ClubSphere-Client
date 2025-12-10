import image from "../../assets/art-sketch.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { useForm } from "react-hook-form";
const ForgotPass = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const navigate = useNavigate();
  const { setLoading, sendPasswordResetEmailFunc } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const forgotPass = (data) => {
    sendPasswordResetEmailFunc(data.email)
      .then(() => {
        window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");
        setLoading(false);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl  mx-auto  items-center px-4 py-4 pb-15 lg:pt-15">
      <title>Forgot Password</title>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-8 md:py-0">
        <form
          className="w-full max-w-md md:w-96 flex flex-col items-center justify-center"
          onSubmit={handleSubmit(forgotPass)}>
          <h2 className="text-3xl md:text-4xl font-medium text-primary">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-500/90 mt-3 text-center">
            Did you remember us? We miss you!!!
            <br />
            Please provide your valid email address
          </p>

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
                  defaultValue={email}
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
          </div>

          <button
            type="submit"
            className="mt-6 md:mt-8 w-full bg-hover h-12 rounded-full text-white bg-primary hover:opacity-90 transition-opacity font-medium">
            Login
          </button>

          <p className="text-gray-500/90 text-sm mt-4 text-center">
            Do you know your password?{" "}
            <Link
              state={location.state}
              to="/login"
              className="text-primary hover:underline font-medium">
              Log in
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

export default ForgotPass;
