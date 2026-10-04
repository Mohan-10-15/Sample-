"use client";

import { useEffect, useState } from "react";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

function compute(target: number): CountdownParts {
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isOver: false,
  };
}

export default function useCountdown(target: Date): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(() => compute(target.getTime()));

  useEffect(() => {
    const id = setInterval(() => setParts(compute(target.getTime())), 1000);
    return () => clearInterval(id);
  }, [target]);

  return parts;
}