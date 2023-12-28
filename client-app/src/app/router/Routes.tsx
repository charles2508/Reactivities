import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestErrors";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
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
            },
            {
                path: 'errors',
                element: <TestErrors/>
            },
            {
                path: 'not-found',
                element: <NotFound/>
            },
            {
                path:'server-error',
                element: <ServerError/>
            },
            {
                path: '*',
                element: <Navigate to='not-found'/>
            }
        ]
    },
]


export const router = createBrowserRouter(routes);
  