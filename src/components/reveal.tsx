import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type RevealVariant = "up" | "down" | "left" | "right" | "fade" | "scale" | "curtain";
type RevealTag = "div" | "article" | "section" | "p" | "span" | "aside";
type RevealState = "idle" | "hidden" | "visible";

interface RevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  as?: RevealTag;
  threshold?: number;
  style?: CSSProperties;
}

export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  duration = 700,
  as: Tag = "div",
  threshold = 0.12,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<RevealState>("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setState("visible");
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.94) {
      setState("visible");
      return;
    }

    setState("hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight) {
            setState("visible");
            observer.disconnect();
            break;
          }
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const mergedStyle = {
    ...style,
    "--reveal-delay": `${delay}ms`,
    "--reveal-duration": `${duration}ms`,
  } as CSSProperties;

  return (
    <Tag
      ref={ref as never}
      data-reveal={variant}
      data-reveal-state={state}
      className={cn("reveal-item", className)}
      style={mergedStyle}
    >
      {children}
    </Tag>
  );
}
