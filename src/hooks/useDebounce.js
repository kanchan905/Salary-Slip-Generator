// hooks/useDebounce.js

import { useMemo } from "react";

export default function useDebounce(callback, delay = 500) {
    const debouncedFn = useMemo(() => {
        let timerId;
        return (...args) => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                callback(...args);
            }, delay);
        };
    }, [callback, delay]);

    return debouncedFn;
}
