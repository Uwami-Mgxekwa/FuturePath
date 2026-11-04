"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            // Check for updates every time the page becomes visible
            document.addEventListener("visibilitychange", () => {
              if (document.visibilityState === "visible") {
                reg.update();
              }
            });
          })
          .catch((err) => {
            console.warn("Service worker registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}
