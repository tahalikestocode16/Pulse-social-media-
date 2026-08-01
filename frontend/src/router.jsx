import { createBrowserRouter } from 'react-router-dom';
import Home from "./components/pages/Home.jsx";
import Register from "./components/pages/auth/Register.jsx";
import Login from "./components/pages/auth/Login.jsx";
import Profile from "./components/pages/profile/Profile.jsx";
import Search from "./components/pages/Search.jsx";
import Error from "./components/pages/Error.jsx";
import CommentSection from "./components/pages/comments/CommentSection.jsx";
import EditPost from './components/pages/posts/EditPost.jsx';
import CreatePost from './components/pages/posts/CreatePost.jsx';
import MessagesPage from './components/pages/messages/MessagesPage.jsx';
import Notifications from './components/pages/notifications/Notifications.jsx';
import PrivacyPolicy from './components/pages/extra/PrivacyPolicy.jsx';
import Terms from './components/pages/extra/Terms.jsx';
import About from './components/pages/extra/About.jsx';
import Blog from './components/pages/extra/Blog.jsx';
import Help from './components/pages/extra/Help.jsx';
import Pulses from './components/pages/posts/Pulses.jsx';
import EditProfile from './components/pages/profile/EditProfile.jsx';

const router = createBrowserRouter([
  {
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/pulses",
        element: <Pulses />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/profile/edit",
        element: <EditProfile />
      },
      {
        path: "/profile/:id",
        element: <Profile />
      },
      {
        path: "/search",
        element: <Search />
      },
      {
        path: "/explore",
        element: <Search />
      },
      {
        path: "/messages",
        element: <MessagesPage />
      },
      {
        path: "/notifications",
        element: <Notifications />
      },
      {
        path: "/posts",
        element: <Home />
      },
      {
        path: "/posts/create",
        element: <CreatePost />
      },
      {
        path: "/posts/:id/comment",
        element: <CommentSection />
      },
      {
        path: "/posts/:id/edit",
        element: <EditPost />
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />
      },
      {
        path: "/terms",
        element: <Terms />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/blog",
        element: <Blog />
      },
      {
        path: "/help",
        element: <Help />
      },
      {
        path: "/error",
        element: <Error />
      },
      {
        path: "*",
        element: <Error />
      }
    ]
  }
]);

export default router;