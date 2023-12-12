import { RouterProvider } from 'react-router-dom';
import router from './routers/Index';

export default function App() {
  return <RouterProvider router={router} />
}
