import { useState, useEffect, useRef } from "react";

function useThrottle(func, wait) {
  const [id, setId] = useState(null);
  const previous = useRef(Date.now());
  const remaining = useRef(wait);
  const now = useRef(previous.current);
  const diff = useRef(0);

  useEffect(() => {
    return () => {
      clearTimeout(id);
      now.current = Date.now();
      diff.current = wait - (now.current - previous.current);
      remaining.current = diff.current < wait && diff.current > 0 ? diff.current : 0;
    };
  }, [id, previous]);

  return (...args) => {
    if (remaining.current <= 0) {
      func(...args);
      previous.current = Date.now();
    } else {
      setId(
        setTimeout(() => {
          func(...args);
        }, remaining.current)
      );
    }
  };
}

export default useThrottle;