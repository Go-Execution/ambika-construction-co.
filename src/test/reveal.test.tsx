import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Reveal } from "@/components/reveal";

describe("Reveal", () => {
  const originalIntersectionObserver = window.IntersectionObserver;

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver;
    vi.restoreAllMocks();
  });

  it("reveals immediately when IntersectionObserver is unavailable", () => {
    // @ts-expect-error testing missing IntersectionObserver fallback
    window.IntersectionObserver = undefined;

    render(
      <Reveal variant="up">
        <span>Visible content</span>
      </Reveal>,
    );

    const item = screen.getByText("Visible content").closest("[data-reveal]");
    expect(item).toHaveAttribute("data-reveal-state", "visible");
  });

  it("transitions from hidden to visible when scrolled into view", () => {
    let observerCallback: IntersectionObserverCallback | null = null;
    const observe = vi.fn();
    const disconnect = vi.fn();

    window.IntersectionObserver = class MockIntersectionObserver {
      readonly root = null;
      readonly rootMargin = "0px";
      readonly thresholds = [0.12];
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
    } as unknown as typeof IntersectionObserver;

    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      top: window.innerHeight + 200,
      bottom: window.innerHeight + 300,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: window.innerHeight + 200,
      toJSON: () => ({}),
    });

    render(
      <Reveal variant="curtain" delay={120}>
        <span>Below fold section</span>
      </Reveal>,
    );

    const item = screen.getByText("Below fold section").closest("[data-reveal]");
    expect(item).toHaveAttribute("data-reveal-state", "hidden");
    expect(observe).toHaveBeenCalledTimes(1);

    act(() => {
      observerCallback?.(
        [
          {
            isIntersecting: true,
            boundingClientRect: { top: 200 } as DOMRectReadOnly,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(item).toHaveAttribute("data-reveal-state", "visible");
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
