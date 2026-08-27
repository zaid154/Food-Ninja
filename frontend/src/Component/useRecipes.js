import { useEffect, useState } from "react";

let useResipe = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const feachData = async () => {
            const res = await fetch("http://localhost:5000/api/recipes");
            const apiData = await res.json();
            setData(apiData);
        };
        feachData();
    }, []);

    return data;
};

export default useResipe;
