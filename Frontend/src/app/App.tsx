import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./AppRouter";
import Lenis from 'lenis';

const App = () => {
  useEffect(() => {
    // Initialize Smooth Scroll
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <div className="bg-[#030303] min-h-screen selection:bg-blue-500/30">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;