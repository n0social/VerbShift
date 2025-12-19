"use client";
import { useEffect, useRef, useState } from "react";

export default function TypedMotto() {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const motto = "Your Content... Streamlined.";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i < motto.length) {
        setDisplayed((prev) => prev + motto.charAt(i));
        i++;
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 120); // slower typing
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
