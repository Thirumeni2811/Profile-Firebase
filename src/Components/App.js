import React from "react";
import Signup from "./Signup";
import { ToastContainer } from "react-toastify";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";
import ViewProfile from "./ViewProfile";
import UpdateProfile from "./UpdateProfile";

function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Profile />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/view-profile" element={<ViewProfile />} />
                <Route path="update-profile" element={<UpdateProfile />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
      </div>
    </Container>
  );
}

export default App;
