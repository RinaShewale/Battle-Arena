import { createBrowserRouter } from "react-router-dom";
import HomePage from "../features/pages/HomePage";
import AboutPage from "../features/pages/AboutPage";

import NotFoundPage from "../features/pages/NotFoundPage";
import BattlePage from "../features/pages/BattlePage";
import { LeaderboardPage } from "../features/pages/LeaderboardPage";
import Login from "../auth/Login";
import Register from "../auth/Register";
import HowItWorksPage from "../features/pages/HowItWorksPage";
import ProfilePage from "../features/pages/ProfilePage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
   {
    path: "/working",
    element: <HowItWorksPage />,
  },
   {
    path: "/profile",
    element: <ProfilePage />,
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
    path: "/login",
    element: <Login />,
  },


    {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);