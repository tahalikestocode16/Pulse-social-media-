import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router.jsx';
import './styles.css';

function App() {
  useEffect(() => {
    console.log('socket connected');
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
