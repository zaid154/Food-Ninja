import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "./Usercontext";

// wraps any page that should only be visible to logged-in users.
// if the user is not logged in, send them to /login instead.
const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
