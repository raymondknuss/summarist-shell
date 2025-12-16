import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import HomePage from "../pages/Home/HomePage";
import ForYouPage from "../pages/ForYou/ForYouPage";
import BookDetailsPage from "../pages/Book/BookDetailsPage";
import PlayerPage from "../pages/Player/PlayerPage";
import ChoosePlanPage from "../pages/Sales/ChoosePlanPage";
import SettingsPage from "../pages/Settings/SettingsPage";
import LibraryPage from "../pages/Library/LibraryPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "for-you", element: <ForYouPage /> },
      { path: "book/:id", element: <BookDetailsPage /> },
      { path: "player/:id", element: <PlayerPage /> },
      { path: "choose-plan", element: <ChoosePlanPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "library", element: <LibraryPage /> }
    ]
  }
]);

export default router;
