import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/Constants";

let useResipe = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const feachData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/recipes`);
                const apiData = await res.json();
                setData(apiData);
            } catch (err) {
                console.error("Failed to fetch recipes:", err);
            }
        };
        feachData();
    }, []);

    return data;
};

export default useResipe;
