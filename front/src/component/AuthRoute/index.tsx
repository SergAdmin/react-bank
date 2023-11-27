import { Navigate } from "react-router";
import { useAuth } from "../../utilits/AuthContext";

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAuth();

  return state.token && state.user.isConfirmed ? (
    <Navigate to="/balance" />
  ) : (
    <>{children}</>
  );
};

export default AuthRoute;
