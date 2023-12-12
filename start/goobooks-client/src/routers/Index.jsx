import { createBrowserRouter, redirect } from "react-router-dom";
import BaseLayout from "../views/BaseLayout";
import HomePage from "../views/HomePage";
import LoginPage from "../views/LoginPage";
const SERVER_URL = "http://localhost:3000";

const router = createBrowserRouter([
    {
        path: "/",
        loader: async () => {
            return redirect('/books')
        },
    },
    {
        path: "*",
        loader: async () => {
            return redirect('/books')
        },
    },
    {
        path: "/login",
        element: <LoginPage url={SERVER_URL} />,
        loader: async () => {
            if (localStorage.access_token) {
                return redirect('/books')
            }

            return null
        },
    },
    {
        element: <BaseLayout />,
        loader: async () => {
            if (!localStorage.access_token) {
                return redirect('/login')
            }

            return null
        },
        children: [
            {
                path: "/books",
                element: <HomePage url={SERVER_URL} />
            }
        ]
    }
]);

export default router;