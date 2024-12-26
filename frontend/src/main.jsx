import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { StrictMode, useEffect } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Scrollbar } from "smooth-scrollbar-react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Lenis and GSAP Wrapper Component
const ScrollAndAnimationWrapper = ({ children }) => {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // GSAP Animations
    const sections = document.querySelectorAll(".hero");
    sections.forEach((section) => {
      const content = section.querySelector(".content");

      gsap.fromTo(
        content,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Cleanup
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
};

// Render the application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Scrollbar
    damping={0.1}
    thumbMinSize={20}
    renderByPixels={true}
    alwaysShowTracks={false}
    continuousScrolling={true}
    plugins={{}}
    onScroll={(e) => console.log("Scrolling:", e)}
  >
    <PayPalScriptProvider options={{ "client-id": "your-client-id" }}>
      <StrictMode>
        <ScrollAndAnimationWrapper>
          <App />
        </ScrollAndAnimationWrapper>
      </StrictMode>
    </PayPalScriptProvider>
  </Scrollbar>
);
