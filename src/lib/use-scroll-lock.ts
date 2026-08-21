"use client";

import { useEffect } from "react";

/**
 * Freezes background scrolling while a modal-style overlay is open,
 * without losing the reader's place.
 *
 * The obvious implementation, `document.body.style.overflow =
 * "hidden"`, is broken on this site and was shipped in three separate
 * components before anyone noticed. CSS propagates `overflow` from
 * `body` to the viewport when `<html>` has `overflow: visible`, so
 * that line makes the whole page non-scrollable. Because `<html>` also
 * carries `h-full` (height: 100%), the scrollable area then collapses
 * to the viewport and the browser clamps scrollTop to 0. The page
 * jumps to the top, and any `sticky` header appears to "unstick"
 * because there is no scroll offset left for it to stick past.
 *
 * Pinning the body at a negative offset equal to the current scroll
 * position keeps the page visually exactly where it was, and the
 * cleanup restores the real offset.
 *
 * Nesting note: this is written for one overlay at a time, which is
 * what the site does (the navbar closes its drawer before opening
 * search). Two simultaneous locks would have the inner one capture
 * scrollY 0 and restore to the top on close.
 *
 * @param active Whether the lock should be applied.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    const scrollY = window.scrollY;
    const { position, top, left, right, width } = document.body.style;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.left = left;
      document.body.style.right = right;
      document.body.style.width = width;
      // Restore synchronously with no smooth-scroll animation, so the
      // page does not visibly travel back to where the user already is.
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [active]);
}
