import React, { useState } from "react";

const Update = () => {
  const [editPersonal, setEditPersonal] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "Sarah",
    lastName: "Jones",
    email: "sarahjones360@gmail.com",
    phone: "+09345 346 46",
    bio: "Team Leader",
    password: "485******965",
    country: "United Estate",
    city: "Enter city name",
    postalCode: "ERT 1136",
    role: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="max-w-[1043px] mx-auto p-4 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-[#E2E1E5]">
        <div className="flex items-center gap-4">
          <img
            src="/members/dummyuser.png"
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold pb-1">Mark Jones</h2>
            <p className="text-gray-500 text-sm">
              {formData.email}
              <br />
              Admin | {formData.bio}
            </p>
          </div>
        </div>
        <button className="text-sm text-[#717073] border flex gap-4 py-2 items-center border-[#E2E1E5] p-3 rounded-full flex items-center gap-1 hover:bg-blue-50">
          Edit Profile <img src="/members/editPencil.png" className="w-5" alt="" />
        </button>
      </div>

      {/* Personal Info */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E1E5]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Personal Information</h3>
          <button className="text-sm text-[#717073] border flex gap-4 py-2 items-center border-[#E2E1E5] p-3 rounded-full flex items-center gap-1 hover:bg-blue-50"
            onClick={() => setEditPersonal(!editPersonal)}
          >
            {editPersonal ? "Cancel" : "Edit"} <img src="/members/editPencil.png" className="w-5" alt="" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editPersonal ? (
            <>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                className="input col-span-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                type="password"
                className="input col-span-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          ) : (
            <>
              <div><span className="block">First Name:</span> <span className="font-semibold"> {formData.firstName} </span></div>
              <div><span className="block">Last Name:</span> <span className="font-semibold"> {formData.lastName} </span></div>
              <div><span className="block">Email:</span> <span className="font-semibold"> {formData.email} </span></div>
              <div><span className="block">Phone:</span> <span className="font-semibold">{formData.phone} </span></div>
              <div><span className="block">Bio:</span> <span className="font-semibold">{formData.bio} </span></div>
              <div><span className="block">Password:</span> <span className="font-semibold"> {formData.password} </span></div>
            </>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E1E5]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Address</h3>
          <button
            className="text-sm text-[#717073] border flex gap-4 py-2 items-center border-[#E2E1E5] p-3 rounded-full flex items-center gap-1 hover:bg-blue-50"
            onClick={() => setEditAddress(!editAddress)}
          >
            {editAddress ? "Cancel" : "Edit"} <img src="/members/editPencil.png" className="w-5" alt="" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editAddress ? (
            <>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                className="input col-span-2"
              />
            </>
          ) : (
            <>
              <div><span className="block">Country:</span><span className="font-semibold"> {formData.country}</span></div>
              <div><span className="block">City:</span><span className="font-semibold"> {formData.city}</span></div>
              <div><span className="block">Postal Code:</span><span className="font-semibold"> {formData.postalCode}</span></div>
            </>
          )}
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E1E5]">
        <h3 className="font-semibold text-lg mb-2">Permissions</h3>
        <div className="mb-4 md:w-4/12">
          <label className="block text-sm font-semibold mb-1">Role Name</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="team-leader">Team Leader</option>
            <option value="super-admin">Super Admin</option>
          </select>
        </div>
        <div className="flex justify-center  gap-2">
          <button className="btn border border-[#E2E1E5] text-[#717073]  px-4 py-2 rounded-lg text-sm">Suspend</button>
          <button className="btn border border-[#E2E1E5]  text-[#717073] px-4 py-2 rounded-lg text-sm">Delete</button>
          <button className="btn bg-[#237FEA] text-white px-8 py-2 rounded-lg text-sm">Save</button>
        </div>
      </div>
    </div>
  );
};

export default Update;
