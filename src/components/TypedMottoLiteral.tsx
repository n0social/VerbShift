"use client";
import { useEffect, useRef, useState } from "react";

export default function TypedMottoLiteral() {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  // Use a literal array of characters to avoid any string encoding or mutation issues
  const mottoArr = [
    'Y','o','u','r',' ','C','o','n','t','e','n','t','.','.','.',' ','S','t','r','e','a','m','l','i','n','e','d','.'
  ];
  const iRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (iRef.current < mottoArr.length) {
        const nextChar = mottoArr[iRef.current];
        if (typeof nextChar === 'string') {
          setDisplayed((prev) => prev + nextChar);
        }
        iRef.current++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 120);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (displayed.length === mottoArr.length) {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [displayed]);

  return (
    <span className="inline-block text-primary text-7xl font-extrabold tracking-tight">
      {displayed}
      <span className="inline-block w-2" style={{ opacity: showCursor ? 1 : 0 }}>
        |
      </span>
    </span>
  );
}
