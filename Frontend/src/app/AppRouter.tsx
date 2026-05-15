import { createBrowserRouter } from "react-router-dom";
import HomePage from "../features/pages/HomePage";
import AboutPage from "../features/pages/AboutPage";

import NotFoundPage from "../features/pages/NotFoundPage";
import BattlePage from "../features/pages/BattlePage";
import { LeaderboardPage } from "../features/pages/LeaderboardPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/leaderboard",
    element: <LeaderboardPage />,
  },

   {
    path: "/battlearena",
    element: <BattlePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);