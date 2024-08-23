import { Button } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

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

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "image" && files) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0]
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch('http://localhost:3000/user-signup', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Signup successful!'); 
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const error = await response.json();
        toast.error(`Signup Failed: ${error.message}`); 
      }
    } catch (error) {
      toast.error('Signup Failed!'); 
    }
  };

  return (
    <div className='wrapper d-flex align-items-center justify-content-center h-100'>
      <form onSubmit={handleSubmit}>
        <h4 className='text-center mt-2'>Sign Up Here</h4>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="mb-3 mt-4">
          <label htmlFor="username" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact" className="form-label">
            Contact No
          </label>
          <input
            type="number"
            className="form-control"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            name="image"
            id="image"
            onChange={handleChange}
          />
          {imagePreview && <img src={imagePreview} alt="Image Preview" style={{ marginTop: '10px', maxWidth: '100px' }} />}
        </div>
        <button type="submit" className="btn btn-primary mb-3">
          Submit
        </button>
        <div className="sign-up mt-3 text-center">
          Have an account? <Link to="/login">Create One</Link>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" /> 
    </div>
  );
};

export default Signup;
