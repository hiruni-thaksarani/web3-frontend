// UserList.js
'use client' ;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:4000/users/getUsers');
        console.log('Response:', response.data); 
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold my-4">Users</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Mobile Number</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{user.basic_info.first_name}</td>
              <td className="border px-4 py-2">{user.basic_info.last_name}</td>
              <td className="border px-4 py-2">{user.contact_info.email}</td>
              <td className="border px-4 py-2">{user.contact_info.mobile_number}</td>
              <td className="border px-4 py-2">{user.basic_info.gender}</td>
              <td className="border px-4 py-2">{user.basic_info.dob}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
