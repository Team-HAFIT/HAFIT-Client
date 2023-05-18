import { useState, useEffect } from "react";

function useDebounce(func, wait) {
  const [id, setId] = useState(null);
  useEffect(() => {
    return () => {
      clearTimeout(id);
    };
  }, [id]);
  return (...args) => {
    if (id) {
      clearTimeout(id);
    }
    setId(
      setTimeout(() => {
        setId(null);
        func(...args);
      }, wait)
    );
  };
}

export default useDebounce;