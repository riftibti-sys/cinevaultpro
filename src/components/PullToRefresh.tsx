import { useEffect, useRef, useState } from "react";

const THRESHOLD = 70;
const MAX = 110;

export function PullToRefresh() {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const active = useRef(false);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0) {
        startY.current = null;
        active.current = false;
        return;
      }
      startY.current = e.touches[0].clientY;
      active.current = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!active.current || startY.current == null || refreshing) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy <= 0) {
        setPull(0);
        return;
      }
      const eased = Math.min(MAX, dy * 0.5);
      setPull(eased);
    };
    const onTouchEnd = () => {
      if (!active.current) return;
      active.current = false;
      startY.current = null;
      if (pull >= THRESHOLD && !refreshing) {
        setRefreshing(true);
        setPull(THRESHOLD);
        setTimeout(() => window.location.reload(), 150);
      } else {
        setPull(0);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pull, refreshing]);

  const progress = Math.min(1, pull / THRESHOLD);
  const rotate = progress * 360;

  if (pull === 0 && !refreshing) return null;

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[999] flex justify-center pointer-events-none md:hidden"
      style={{ transform: `translateY(${pull - 20}px)`, transition: refreshing || pull === 0 ? "transform 200ms ease" : "none" }}
    >
      <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-full bg-black shadow-lg">
        <div
          className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
          style={{
            transform: `rotate(${rotate}deg)`,
            animation: refreshing ? "spin 0.8s linear infinite" : undefined,
          }}
        />
      </div>
    </div>
  );
}
