import useAuth from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import Loader from "../Components/Loader";
import Forbidden from "../Components/Forbidden";

const ManagerRoute = ({ children }) => {
  const { loading } = useAuth();
  const { role, isLoading } = useRole();

  if (loading || isLoading) {
    return <Loader />;
  }

  if (role !== "manager") {
    return <Forbidden />;
  }

  return children;
};

export default ManagerRoute;
