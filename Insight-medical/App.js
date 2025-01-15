import "./App.css";
import { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./screens/auth/Login";
import SignUp from "./screens/auth/SignUp";
import AuthLayout from "./components/Layout/AuthLayout";
import {
  CreateNewPassword,
  ForgotPass,
  SubmitYourCode,
} from "./screens/auth/ForgotPass";
import Layout from "./components/Layout/Layout";
import Dashboard from "./screens/Dashboard/Dashboard";
import ProfileSettings from "./screens/Dashboard/ProfileSettings";
import PasswordSettings from "./screens/Dashboard/PasswordSettings";
import Notifications from "./screens/Dashboard/Notifications";
import Payment from "./screens/Dashboard/Payment";
import Help from "./screens/Dashboard/Help";

function App() {
  const loggedInUser = localStorage.getItem("user");
  const user = JSON.parse(loggedInUser);
  const navigate = useNavigate();

  const { theme } = useSelector((state) => state.data);

  // if user not found then redirect to home page

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, []);

  // Theme Change as per the theme state comes from the redux

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // for start page from the top of the component

  const Wrapper = ({ children }) => {
    const location = useLocation();
    useLayoutEffect(() => {
      document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);
    return children;
  };

  return (
    <Wrapper>
      <Routes>
        {/* befor login accesseble  */}
        {user == null && (
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Outlet />}>
              <Route index element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot" element={<ForgotPass />} />
              <Route path="/create-new-pass" element={<CreateNewPassword />} />
              <Route path="/submit-your-code" element={<SubmitYourCode />} />
            </Route>
          </Route>
        )}
        {/* After login accesseble  */}
        {user && (
          <Route element={<Layout />}>
            <Route path="/" element={<Outlet />}>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route path="modal/profile" element={<ProfileSettings />} />
                <Route path="modal/password" element={<PasswordSettings />} />
                <Route path="modal/notifications" element={<Notifications />} />
                <Route path="modal/payments" element={<Payment />} />
                <Route path="modal/help" element={<Help />} />
              </Route>
            </Route>
          </Route>
        )}
      </Routes>
    </Wrapper>
  );
}

export default App;
