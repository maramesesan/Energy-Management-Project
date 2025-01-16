import axios from 'axios';

export const login = async (username, password) => {
  const response = await axios.post(`http://localhost:8080/auth/sign-in`, { username, password });
  console.log(response.data)
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`http://localhost:8080/auth/sign-up`, userData);
  return response.data;
};
