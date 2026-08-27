import { useEffect, useState } from "react";

let Usegroceries = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const feachData = async () => {
            const res = await fetch("http://localhost:5000/api/groceries");
            const apiData = await res.json();
            setData(apiData);
        };
        feachData();
    }, []);

    return data;
};

export default Usegroceries;
