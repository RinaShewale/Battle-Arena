import { useEffect } from "react";

import { RouterProvider } from "react-router-dom";

import { router } from "./AppRouter";

import Lenis from "lenis";

import { AuthProvider } from "../auth/AuthContext";

import { BattleProvider } from "../features/BattleContext";

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      allowNestedScroll: true,
    });

    function raf(time: number) {
      lenis.raf(time);

      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <BattleProvider>
        <div className="bg-[#030303] min-h-screen selection:bg-blue-500/30">
          <RouterProvider
            router={router}
          />
        </div>
      </BattleProvider>
    </AuthProvider>
  );
};

export default App;