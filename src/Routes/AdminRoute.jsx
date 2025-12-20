import useRole from "../Hooks/useRole";
import useAuth from "../Hooks/useAuth";
import Loader from "../Components/Loader";
import Forbidden from "../Components/Forbidden";

const AdminRoute = ({ children }) => {
  const { loading } = useAuth();
  const { role, isLoading } = useRole();
 
  if (loading || isLoading) {
    return <Loader />;
  }

  if (role !== "admin") {
    return <Forbidden />;
  }

  return children;
};

export default AdminRoute;
