import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";

import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";

function App() {

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) {
          return null;
        }
        toast.error(err.response?.data?.message || "Something went wrong");
      }
    },
  });

  if (isLoading) return null;

  return (
    <>
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />

        {/* Protected routes */}
        <Route element={authUser ? <Layout /> : <Navigate to="/login" />}>

          <Route path="/" element={<HomePage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />

        </Route>

      </Routes>

      <Toaster />
    </>
  );
}

export default App;