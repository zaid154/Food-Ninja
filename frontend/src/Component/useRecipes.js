import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/Constants";
import { FALLBACK_RECIPES } from "../utils/fallbackDishes";

const useResipe = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

        const fetchData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/recipes`, {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const apiData = await res.json();
                    if (isMounted && apiData && Array.isArray(apiData.recipes) && apiData.recipes.length > 0) {
                        setData(apiData);
                        return;
                    }
                }
                // If not ok or empty, fallback gracefully
                if (isMounted) {
                    setData({ success: true, count: FALLBACK_RECIPES.length, recipes: FALLBACK_RECIPES });
                }
            } catch (err) {
                // If aborted or network/server error, fallback seamlessly
                if (isMounted) {
                    setData({ success: true, count: FALLBACK_RECIPES.length, recipes: FALLBACK_RECIPES });
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, []);

    return data;
};

export default useResipe;
