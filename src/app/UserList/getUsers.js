// pages/api/users/getUsers.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('http://localhost:4000/users/getUsers');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
}
