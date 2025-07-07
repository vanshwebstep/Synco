import React, { useState } from "react";
import Select from "react-select";

const Create = () => {
  const [photo, setPhoto] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const roleOptions = [
    { value: "franchisee", label: "Franchisee" },
    { value: "super-admin", label: "Super Admin" },
    { value: "agent", label: "Agent" },
  ];

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 border-[#E2E1E5] border-b p-6">
        Add New Member
      </h2>

      <form className="space-y-4 p-5">
        <div>
          <label className="block text-sm font-semibold text-[#282829]">Full Name</label>
          <input type="text" className="w-full border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#282829]">Position</label>
          <input type="text" className="w-full border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#282829]">Phone Number</label>
          <input type="tel" className="w-full border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#282829]">Email</label>
          <input type="email" className="w-full border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Role using react-select */}
        <div>
          <label className="block text-sm font-semibold text-[#282829] mb-1">Role</label>
          <Select
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
            placeholder="Select Role"
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#282829]">Password</label>
          <input type="password" className="w-full border border-[#E2E1E5] rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#282829] mb-1">Profile Picture</label>
          <div className="w-full border border-[#E2E1E5] rounded-lg bg-[#F5F5F5] h-32 flex items-center justify-center cursor-pointer relative overflow-hidden">
            {photo ? (
              <img src={photo} alt="Uploaded" className="h-full object-cover" />
            ) : (
              <>
                <span className="text-2xl font-light">+</span>
                <span className="text-sm ml-2">Add Photo</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Create;
