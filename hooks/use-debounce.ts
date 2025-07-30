import React from "react";

export const useDebounce = (value: string, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
