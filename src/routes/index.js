import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";
import AuthLayout from "../layouts/auth";

// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
        { path: "reset-password", element: <ResetPasswordPage /> },
        { path: "new-password", element: <NewPasswordPage /> },
        { path: "verify", element: <VerifyPage /> },
      ],
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "app", element: <GeneralApp /> },
        { path: "conversation", element: <Conversation /> },
        { path: "chats", element: <Chats /> },
        { path: "settings", element: <Settings /> },
        { path: "group", element: <Group /> },
        { path: "contact", element: <Contact /> },
        { path: "profile", element: <Profile /> },
        { path: "call", element: <CallPage /> },

        { path: "/:user_id", element: <User /> },

        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },

    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const GeneralApp = Loadable(lazy(() => import("../pages/dashboard/GeneralApp")));
const Conversation = Loadable(lazy(() => import("../pages/dashboard/Conversation")));
const Chats = Loadable(lazy(() => import("../pages/dashboard/Chats")));
const Settings = Loadable(lazy(() => import("../pages/dashboard/Settings")));
const Group = Loadable(lazy(() => import("../pages/dashboard/Group")));
const Contact = Loadable(lazy(() => import("../sections/Dashboard/Contact")));
const Profile = Loadable(lazy(() => import("../pages/dashboard/Settings/Profile")));
const CallPage = Loadable(lazy(() => import("../pages/dashboard/Call")));

const Page404 = Loadable(lazy(() => import("../pages/Page404")));

const LoginPage = Loadable(lazy(() => import("../pages/auth/Login")));
const RegisterPage = Loadable(lazy(() => import("../pages/auth/Register")));
const ResetPasswordPage = Loadable(lazy(() => import("../pages/auth/ResetPassword")));
const NewPasswordPage = Loadable(lazy(() => import("../pages/auth/NewPassword")));
const VerifyPage = Loadable(lazy(() => import("../pages/auth/Verify")));

const User = Loadable(lazy(() => import("../pages/dashboard/User")));
