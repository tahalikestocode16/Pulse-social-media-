import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from "./components/pages/Home.jsx";
import Register from "./components/pages/auth/Register.jsx";
import Login from "./components/pages/auth/Login.jsx";
import Profile from "./components/profile/Profile.jsx";
import Error from "./components/pages/Error.jsx";
import Comment from "./components/pages/Comments.jsx";
import EditPost from './components/pages/posts/EditPost.jsx';
import Feed from "./components/pages/posts/Feed.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>
  },
  {
    path: "/register",
    element: <Register></Register>
  },
  {
    path: "/login",
    element: <Login></Login>
  },
  {
    path: "/profile",
    element: <Profile></Profile>
  },
  {
    path: "/error",
    element: <Error></Error>
  },
  {
    path: "/comment",
    element: <Comment></Comment>
  },
  {
    path: "/posts",
    element: <Feed></Feed>
  },
  {
    path: "/posts/:id/edit",
    element: <EditPost></EditPost>
  }

]);

export default router;