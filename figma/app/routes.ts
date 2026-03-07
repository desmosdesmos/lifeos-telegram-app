import { createBrowserRouter } from "react-router";
import { Onboarding } from "./screens/Onboarding";
import { Dashboard } from "./screens/Dashboard";
import { Nutrition } from "./screens/Nutrition";
import { Sleep } from "./screens/Sleep";
import { AIAnalysis } from "./screens/AIAnalysis";
import { AIChat } from "./screens/AIChat";
import { Profile } from "./screens/Profile";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Onboarding,
  },
  {
    path: "/app",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "nutrition", Component: Nutrition },
      { path: "sleep", Component: Sleep },
      { path: "analysis", Component: AIAnalysis },
      { path: "chat", Component: AIChat },
      { path: "profile", Component: Profile },
    ],
  },
]);