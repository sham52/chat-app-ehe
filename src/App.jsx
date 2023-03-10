import React, { useState, useEffect } from "react";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import ChatBox from "./components/ChatBox";
import Register from "./components/Register";
import { Routes, Route, Navigate } from "react-router-dom";
import MainScreen from "./components/MainScreen";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";

const style = {
  appContainer: `max-w-[728px] max-h-screen mx-auto text-center `,
  sectionContainer: `flex flex-col h-[100vh] bg-gray-100 shadow-xl relative `,
};

function App() {
  const [user] = useAuthState(auth);
  const [isDark, setIsDark] = useState(false);
  const [dataTheme, setDataTheme] = useState("");

  {
    /* Usage of same theme with browser*/
  }
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDataTheme("synthwave");
    } else {
      setDataTheme("winter");
    }
  }, []);

  const handleTheme = () => {
    isDark ? setDataTheme("synthwave") : setDataTheme("winter");
  };

  const ProtectedRoute = ({ children }) => {
    user ? <Navigate to="/" /> : children;
    return children;
  };

  return (
    <div className={style.appContainer} data-theme={dataTheme}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={style.sectionContainer}>
        <NavBar
          handleTheme={handleTheme}
          setIsDark={setIsDark}
          isDark={isDark}
        />
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="chatbox"
            element={
              <ProtectedRoute>
                <ChatBox />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
