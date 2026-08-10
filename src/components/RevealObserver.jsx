"use client";
import { useEffect } from "react";

// Watches every .hc-reveal element on the page (including ones mounted
// later, e.g. after client-side navigation) and adds .is-in the first time
// each one crosses into view -- see the .hc-reveal rules in globals.css.
export default function RevealObserver() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".hc-reveal").forEach(el => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const observeAll = () => {
      document.querySelectorAll(".hc-reveal:not(.is-in)").forEach(el => io.observe(el));
    };

    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  return null;
}
