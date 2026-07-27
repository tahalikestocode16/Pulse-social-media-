import { useState } from 'react'
import socket from "./socket";
import { RouterProvider } from 'react-router-dom';
import Register from "./components/Register.jsx";

// testing

useEffect(() => {
    console.log("socket connected");

}, []);

function App() {
  return <RouterProvider router={router} />;
  
}

export default App
