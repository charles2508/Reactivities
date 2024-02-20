import { Navigate, Outlet, useLocation } from "react-router-dom";
import useStore from "../stores/store";

export default function RequireAuth() {
    const location = useLocation();
    const {userStore: {isLoggedIn}} = useStore();

    if (!isLoggedIn) {
        return <Navigate to='/' state={{from: location}}/>
    }

    return <Outlet/>
}