import React, { useState } from 'react';

const EditForm = ({ user, onSave, onCancel }) => {
  const [firstName, setFirstName] = useState(user.basic_info.first_name);
  const [lastName, setLastName] = useState(user.basic_info.last_name);
  // Add more fields as needed

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call onSave with updated user data
    onSave({
      ...user,
      basic_info: {
        ...user.basic_info,
        first_name: firstName,
        last_name: lastName,
        // Update other fields similarly
      }
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border px-4 py-2 w-full" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border px-4 py-2 w-full" />
          </div>
          {/* Add more input fields for other user details */}
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 mr-2">Save</button>
            <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
