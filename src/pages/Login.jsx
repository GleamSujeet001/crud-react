import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScaleLoader from "react-spinners/ScaleLoader";

const Login = ({ setIsAuthenticated, setUserData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // State for loader

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (!validateEmail(formData.username)) {
      toast.error("Please enter a valid email!");
      return;
    }

    setLoading(true); // Show loader

    try {
      const response = await fetch("http://localhost:3939/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setIsAuthenticated(true);
        localStorage.setItem("token", result.token);
        setUserData(result.user.image); // Store user data in the parent state
        toast.success("Login successful!");
        localStorage.setItem("UserDetails", JSON.stringify(result.user));
        setTimeout(() => {
          navigate("/Student-list");
        }, 2000);
      } else {
        toast.error("Login Failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred!");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 300px)",
        position: "relative",
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)", // Light overlay while loading
            zIndex: 10,
          }}
        >
          <ScaleLoader color="#36d7b7" />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
          filter: loading ? "blur(3px)" : "none", // Apply blur effect when loading
          transition: "filter 0.3s ease", // Smooth transition for the blur effect
        }}
      >
        <h4 className="text-center mt-2">Login Here</h4>
        <div className="mb-3 mt-4">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="off"
            style={{ marginBottom: "1rem" }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
            style={{ marginBottom: "1rem" }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary mb-3"
          style={{ width: "100%" }}
        >
          Submit
        </button>
        <div className="sign-up mt-3 text-center">
          Don't have an account? <Link to="/">Create One</Link>
        </div>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Login;
