import { useEffect, useState } from "react";

export const useRows = () => {
  const [showRows, setShowRows] = useState(
    window.innerWidth <= 800
      ? 1
      : window.innerWidth > 800 && window.innerWidth <= 1500
      ? 2
      : 3
  );

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 1500 && window.innerWidth > 800) {
        setShowRows(2);
      } else if (window.innerWidth <= 800) {
        setShowRows(1);
      } else {
        setShowRows(3);
      }
    });
  }, []);

  return { showRows };
};
