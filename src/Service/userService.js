import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Update the URL with your backend URL

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/getUsers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
