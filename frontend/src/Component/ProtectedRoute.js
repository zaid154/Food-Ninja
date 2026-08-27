import { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "./Usercontext";

// wraps any page that should only be visible to logged-in users.
// if the user is not logged in, send them to /login instead.
const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserContext);

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
