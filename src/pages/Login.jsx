import React from 'react'
import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Login = ({setIsAuthenticated} ) => {
  
  const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        username: "",
        password: "",
      });
      const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch('http://localhost:3000/user-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
      
          if (response.ok) {
            setIsAuthenticated(true);
            const result = await response.json();
            // console.log('Success:', result.token);
            localStorage.setItem('token', result.token); // Assuming 'data.token' contains the JWT
            toast.success('Login successful!'); 
            setTimeout(() => {
              navigate('/signup-list');
            }, 2000);
            // Store token or handle login success
          } else {
            toast.error('Login Failed!'); 
            // console.error('Error:', response.statusText);
            // Handle errors
          }
        } catch (error) {
          console.error('Error:', error);
          // Handle network errors
        }
      };
      
    
  return (
    <div className='class="wrapper d-flex align-items-center justify-content-center h-100"'>
    <form onSubmit={handleSubmit}>
        <h4 className='text-center mt-2'>Login Here</h4>
      <div className="mb-3 mt-4">
        <label htmlFor="exampleInputEmail1" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          name="username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="off"
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
        />
      </div>
      <button type="submit" className="btn btn-primary mb-3">
        Submit
      </button>
      <div className="sign-up mt-3 text-center">
                        Don't have an account? <Link to="/">Create One</Link>
                    </div>
    </form>
    <ToastContainer position="top-right" autoClose={2000}hideProgressBar={false}newestOnTop={false}closeOnClickrtl={false}pauseOnFocusLoss draggable pauseOnHover theme="light"/> 

  </div>
  
  )
}

export default Login