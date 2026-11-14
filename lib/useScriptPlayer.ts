"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { journey, subscribe } from "./journey";

type Step = { typing?: boolean };

/**
 * Plays a scripted sequence once the viewer reaches `chapter` (progress > startAt).
 * Steps marked `typing` show a typing indicator first. Reduced motion: shows everything at once.
 */
export function useScriptPlayer(steps: Step[], chapter: number, startAt = 0.2, pace = 1) {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const play = useCallback(() => {
    clear();
    started.current = true;
    if (journey.reduced) {
      setShown(steps.length);
      setTyping(false);
      return;
    }
    setShown(0);
    let at = 400;
    steps.forEach((s, i) => {
      if (s.typing) {
        timers.current.push(setTimeout(() => setTyping(true), at));
        at += 1100 * pace;
      } else {
        at += 650 * pace;
      }
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          setShown(i + 1);
        }, at)
      );
      at += 850 * pace;
    });
  }, [steps, pace]);

  useEffect(() => {
    const check = () => {
      if (!started.current && journey.p[chapter] > startAt) play();
    };
    check();
    const off = subscribe(check);
    return () => {
      off();
      clear();
    };
  }, [play, chapter, startAt]);

  return { shown, typing, play };
}
