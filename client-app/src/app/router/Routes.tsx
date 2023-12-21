import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <HomePage/>
            },
            {
                path: "activities",
                element: <ActivityDashboard/>,
            },
            // This path is not a child of ActivityDashboard. Its a completely different path (not rendered inside ActivityDashboard)
            {
                path: "activities/:id",
                element: <ActivityDetails/>
            },
            {
                path: 'createActivity',
                element: <ActivityForm key="create"/>
            },
            {
                path: 'manage/:id',
                element: <ActivityForm key="manage"/>
            }
        ]
    },
]


export const router = createBrowserRouter(routes);
  