import React, { useState } from "react";
import Select from "react-select";

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
  const [selectedRole, setSelectedRole] = useState(null);


  const roleOptions = [
    { value: "franchisee", label: "Franchisee" },
    { value: "super-admin", label: "Super Admin" },
    { value: "agent", label: "Agent" },
  ];

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="md:max-w-[1043px] w-full mx-auto md:p-4 space-y-8">
      {/* Header */}
      <div className="md:flex items-center justify-between bg-white p-6 rounded-2xl border border-[#E2E1E5]">
        <div className="flex items-center gap-4">
          <img
            src="/members/dummyuser.png"
            alt="avatar"
            className="md:w-[113px] md:h-[113px] w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-[28px] font-semibold pb-1">Mark Jones</h2>
            <p className="text-[#717073] font-medium  md:text-[18px] text-sm">
              {formData.email}
              <br />
              Admin | {formData.bio}
            </p>
          </div>
        </div>
        <button className=" mt-3 md:mt-0 text-sm text-[#717073] border flex gap-3 py-2 items-center border-[#E2E1E5] p-3 rounded-full flex items-center gap-1 hover:bg-blue-50">
          Edit Profile <img src="/members/editPencil.png" className="w-5" alt="" />
        </button>
      </div>

      {/* Personal Info */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E1E5]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-[24px]">Personal Information</h3>
          <button className="text-sm text-[#717073] border flex gap-3 py-2 items-center border-[#E2E1E5] p-3 rounded-full flex items-center gap-1 hover:bg-blue-50"
            onClick={() => setEditPersonal(!editPersonal)}
          >
            {editPersonal ? "Cancel" : "Edit"} <img src="/members/editPencil.png" className="w-5" alt="" />
          </button>
        </div>
        <div className="md:grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editPersonal ? (
            <>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full mt-2 md:mt-0 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full mt-2 md:mt-0 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full mt-2 md:mt-0 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full mt-2 md:mt-0 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
                className="input col-span-2 w-full mt-2 md:mt-0 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                type="password"
                className="input col-span-2 w-full mt-2 md:mt-0 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          ) : (
            <>
              <div><span className="block text-[#717073] font-medium text-18px]">First Name:</span> <span className="font-medium text-[#282829] text-[20px]">  {formData.firstName} </span></div>
              <div><span className="block text-[#717073] font-medium text-18px]">Last Name:</span> <span className="font-medium text-[#282829] text-[20px]">  {formData.lastName} </span></div>
              <div><span className="block text-[#717073] font-medium text-18px]">Email:</span> <span className="font-medium text-[#282829] text-[20px]">  {formData.email} </span></div>
              <div><span className="block text-[#717073] font-medium text-18px]">Phone:</span> <span className="font-medium text-[#282829] text-[20px]">{formData.phone} </span></div>
              <div><span className="block text-[#717073] font-medium text-18px]">Bio:</span> <span className="font-medium text-[#282829] text-[20px]">Admin <br/>{formData.bio} </span></div>
              <div><span className="block text-[#717073] font-medium text-18px]">Password:</span> <span className="font-medium text-[#282829] text-[20px]">  {formData.password} </span></div>
            </>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E1E5]">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-[24px]">Address</h3>
          <button
            className="text-sm text-[#717073] border flex gap-3 py-2 items-center border-[#E2E1E5] p-3 rounded-full flex items-center gap-1 hover:bg-blue-50"
            onClick={() => setEditAddress(!editAddress)}
          >
            {editAddress ? "Cancel" : "Edit"} <img src="/members/editPencil.png" className="w-5" alt="" />
          </button>
        </div>
        <div className="md:grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editAddress ? (
            <>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full border border-gray-300 rounded-lg mt-2 md:mt-0 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full border border-gray-300 rounded-lg mt-2 md:mt-0 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                 className="md:col-span-2 w-full border border-gray-300 rounded-lg mt-2 md:mt-0 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          ) : (
            <>
              <div><span className="block text-[#717073] font-medium text-18px]">Country:</span><span className="font-medium text-[#282829] text-[20px]">  {formData.country}</span></div>
              <div><span className="block text-[#717073] font-medium text-18px]">City:</span><span className="font-medium text-[#282829] text-[20px]">  {formData.city}</span></div>
              <div><span className="block text-[#717073] font-medium text-18px]">Postal Code:</span><span className="font-medium text-[#282829] text-[20px]">  {formData.postalCode}</span></div>
            </>
          )}
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E1E5]">
        <h3 className="font-semibold text-[24px] mb-2">Permissions</h3>
        <div className="mb-4 md:w-4/12">
          <label className="block text-[14px] font-semibold mb-2">Role Name</label>

          <Select
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
            placeholder="Select Role"
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>
      </div>
      <div className="flex justify-center  gap-2">
        <button className="btn border border-[#E2E1E5] text-[#717073]  px-8 py-2 font-semibold rounded-lg text-[14px]">Suspend</button>
        <button className="btn border border-[#E2E1E5]  text-[#717073] px-8 py-2 font-semibold rounded-lg text-[14px]">Delete</button>
        <button className="btn bg-[#237FEA] text-white px-8 py-2 font-semibold rounded-lg text-[14px]">Save</button>
      </div>
    </div>
  );
};

export default Update;
