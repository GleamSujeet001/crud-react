import { Button, Avatar, Box } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ScaleLoader from "react-spinners/ScaleLoader";

const Signup = ({ setUserImage }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    contact: "",
    password: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    username: "",
    contact: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // Loader state

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image" && files) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      if (value.trim() !== "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === "" ? "Full Name is required" : "",
      username:
        formData.username.trim() === "" ? "Email address is required" : "",
      contact: formData.contact.trim() === "" ? "Contact No is required" : "",
      password: formData.password.trim() === "" ? "Password is required" : "",
    };
    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      toast.error("All fields are mandatory except image");
    }
    return !hasErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    setLoading(true); // Show loader

    try {
      const response = await fetch("http://localhost:3939/user-signup", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Signup successful!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(`Signup Failed: ${error.message}`);
      }
    } catch (error) {
      toast.error("Signup Failed!");
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
        minHeight: "calc(100vh - 150px)",
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
          filter: loading ? "blur(3px)" : "none", // Blur when loading
          transition: "filter 0.3s ease",
        }}
      >
        <h4 className="text-center mt-2">Sign Up Here</h4>
        {imagePreview && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Avatar
              src={imagePreview}
              alt="Image Preview"
              sx={{ width: 100, height: 100 }}
            />
          </Box>
        )}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
            style={{
              marginBottom: "1rem",
              borderColor: errors.name ? "red" : "",
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Email address <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="off"
            style={{
              marginBottom: "1rem",
              borderColor: errors.username ? "red" : "",
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact" className="form-label">
            Contact No <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            className="form-control"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            autoComplete="off"
            style={{
              marginBottom: "1rem",
              borderColor: errors.contact ? "red" : "",
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
            style={{
              marginBottom: "1rem",
              borderColor: errors.password ? "red" : "",
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image
          </label>
          <input
            type="file"
            className="form-control"
            name="image"
            id="image"
            onChange={handleChange}
            style={{ marginBottom: "1rem" }}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ width: "100%" }}
        >
          Submit
        </Button>
        <div className="sign-up mt-3 text-center">
          Have an account? <Link to="/login">Create One</Link>
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

export default Signup;
