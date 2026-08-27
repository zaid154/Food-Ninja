import { createContext } from "react";

// holds the current logged-in user (or null when nobody is logged in)
// setUser is provided in App.js so any component can update it
const UseContext = createContext({
    user: null,
    setUser: () => { }
});

export default UseContext;
