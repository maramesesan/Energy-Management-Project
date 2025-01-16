import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Form.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // does not reload the page after submision

    try {
      const response = await fetch('http://user.localhost/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          // role: formData.role || 'USER' !!!!!!!!!!!
          role: 'USER'
        })
      });

      if (response.ok) {
        // const data = await response.json();
        // console.log('Person registered:', data);

        setSuccessMessage('Registration successful!');
        // reset the form
        setFormData({
          name: '',
          username: '',
          email: '',
          password: '',
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to register. Please try again.');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('An error occurred. Please try again.');
    }
  };


  return (
    <div>
      <h1>Register</h1>
      <div id="buttons">
      <button className="backButton" 
      onClick={() => navigate('/StartPage')} 
      // style={{ marginBottom: '20px' }}
      >
          BACK
        </button>

        <button className="backButton" onClick={() => navigate('/person')}>
          SEE ALL USERS
        </button>
      </div>
      

      <div className="container-form" >
        <form className="form-1" onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    </div>
  );
}

export default Register;
