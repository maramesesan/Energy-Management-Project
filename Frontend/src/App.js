import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './user/Login';
import Register from './user/Register';
import Person from './user/Person';
import PersonDetails from './user/PersonDetails';
import Device from './device/Device';
import DeviceCreation from './device/DeviceCreation';
import DeviceDetails from './device/DeviceDetails';
import Home from './Home';
import StartPage from './StartPage';
import DeviceLinking from './device/DeviceLinking';
import DeviceUser from './device/DeviceUser';
import { AuthProvider } from './AuthContext'; 
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} /> 
          
          {/* Protected Routes */}
          <Route 
            path="/StartPage" 
            element={<ProtectedRoute element={<StartPage />} allowedRoles={"ADMIN"} />} 
          />
          <Route 
            path="/register" 
            element={<ProtectedRoute element={<Register />} allowedRoles={"ADMIN"} />} 
          />
          <Route 
            path="/person" 
            element={<ProtectedRoute element={<Person />} allowedRoles={"ADMIN"} />} 
          />
          <Route 
            path="/person/:id" 
            element={<ProtectedRoute element={<PersonDetails />} allowedRoles={"ADMIN"} />} 
          />
          <Route 
            path="/device" 
            element={<ProtectedRoute element={<Device />} allowedRoles={"ADMIN"} />} 
          />
          <Route 
            path="/device/create" 
            element={<ProtectedRoute element={<DeviceCreation />} allowedRoles={"ADMIN"} />} 
          />
          <Route 
            path="/device/:id" 
            element={<ProtectedRoute element={<DeviceDetails />} allowedRoles={"ADMIN"} />} 
          />
          <Route 
            path="/person/:id/link-device" 
            element={<ProtectedRoute element={<DeviceLinking />} allowedRoles={"ADMIN"} />} 
          />
          <Route 
            path="/person/:id/devices" 
            element={<ProtectedRoute element={<DeviceUser />} allowedRoles={"USER"} />} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
