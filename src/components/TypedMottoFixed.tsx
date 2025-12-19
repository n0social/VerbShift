"use client";
import { useEffect, useRef, useState } from "react";

export default function TypedMottoFixed() {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const motto = "Your Content... Streamlined.";
  const iRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (iRef.current < motto.length) {
        setDisplayed((prev) => prev + motto.charAt(iRef.current));
        iRef.current++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 120);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (displayed.length === motto.length) {
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
