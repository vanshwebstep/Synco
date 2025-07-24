import React, { useEffect, useState } from 'react';
import Create from './Create';
import { useNavigate } from 'react-router-dom';
import { Check } from "lucide-react";
import Loader from '../contexts/Loader';
import { useVenue } from '../contexts/VenueContext';
import { usePayments } from '../contexts/PaymentPlanContext';
import { useTermContext } from '../contexts/termDatesSessionContext';
import Swal from "sweetalert2"; // make sure it's installed

const List = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [clickedIcon, setClickedIcon] = useState(null);
  const handleIconClick = (icon) => {
    setClickedIcon(icon);
    setShowModal(true);
  };

  const { fetchPackages, packages } = usePayments()
  const { fetchTermGroup, termGroup } = useTermContext()

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { venues, formData, setFormData, isEditVenue, setIsEditVenue, deleteVenue, fetchVenues, loading } = useVenue()
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const toggleCheckbox = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };
  const isAllSelected = venues.length > 0 && selectedUserIds.length === venues.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      const allIds = venues.map((user) => user.id);
      setSelectedUserIds(allIds);
    }
  };


  const handledelete = (id) => {
    Swal({
      title: "Are you sure?",
      text: "This action will permanently delete the venue.",
      icon: "warning",
      buttons: ["Cancel", "Yes, delete it!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        console.log('DeleteId:', id);
        deleteVenue(id); // Call your delete function here
      }
    });
  };

  const [openForm, setOpenForm] = useState(false);
  useEffect(() => {
    fetchVenues();
    fetchPackages();
    fetchTermGroup();
  }, [fetchVenues, fetchPackages, fetchTermGroup]);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    )
  }

  return (
    <div className="pt-1 bg-gray-50 min-h-screen">
      <div className={`flex pe-4 justify-between items-center mb-4 ${openForm ? 'md:w-3/4' : 'w-full'}`}>
        <h2 className="text-[28px] font-semibold">Venues</h2>
        <button
          onClick={() => setOpenForm(true)}
          className="bg-[#237FEA] flex items-center gap-2 cursor-pointer text-white px-4 py-[10px] rounded-xl hover:bg-blue-700 text-[16px] font-semibold"
        >
          <div className="flex items-center gap-2">
            <img src="/demo/synco/members/add.png" className="w-5" alt="" />
            <span>Add New Venue</span>
          </div>
        </button>
      </div>

      <div className="md:flex gap-6">
        <div
          className={`transition-all duration-300 ${openForm ? 'md:w-3/4' : 'w-full'} `}>
          {
            venues.length > 0 ? (

              <div className={`overflow-auto rounded-4xl w-full`}>

                <table className="min-w-full rounded-4xl  bg-white text-sm border border-[#E2E1E5]">
                  <thead className="bg-[#F5F5F5] text-left border-1 border-[#EFEEF2]">
                    <tr className="font-semibold ">
                      <th className="p-4 text-[#717073]">
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={toggleSelectAll}
                            className="w-5 h-5 flex items-center justify-center rounded-md border-2 border-gray-500 focus:outline-none"
                          >
                            {isAllSelected && <Check size={16} strokeWidth={3} className="text-gray-500" />}
                          </button>
                          Area
                        </div>
                      </th>
                      <th className="p-4 text-[#717073]">Name of the venue</th>
                      <th className="p-4 text-[#717073]">Address</th>
                      <th className="p-4 text-[#717073]">Facility</th>
                      <th className="p-4 text-[#717073]"></th>
                      <th className="p-4 text-[#717073]"></th>
                    </tr>
                  </thead>

                  <tbody>
                    {venues.map((user, idx) => {
                      const isChecked = selectedUserIds.includes(user.id);

                      return (
                        <tr key={idx} className="border-t font-semibold text-[#282829] border-[#EFEEF2] hover:bg-gray-50">
                          <td className="p-4 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleCheckbox(user.id)}
                                className={`lg:w-5 lg:h-5 w-full  me-2 flex items-center justify-center rounded-md border-2 ${isChecked ? 'border-gray-700' : 'border-gray-300'
                                  } transition-colors focus:outline-none`}
                              >
                                {isChecked && <Check size={16} strokeWidth={3} className="text-gray-700" />}
                              </button>
                              <span>{user.area || "-"}</span>
                            </div>
                          </td>
                          <td className="p-4">{user.name || "-"}</td>
                          <td className="p-4">{user.address || "-"}</td>
                          <td className="p-4">{user.facility || "-"}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <div onClick={() => handleIconClick("calendar")} className="cursor-pointer">
                                <img src="/demo/synco/members/calendar-circle.png" className="w-6 h-6" alt="calendar" />
                              </div>
                              <div onClick={() => handleIconClick("currency")} className="cursor-pointer">
                                <img src="/demo/synco/members/Currency Icon.png" className="w-6 h-6" alt="currency" />
                              </div>
                              <div onClick={() => handleIconClick("group")} className="cursor-pointer">
                                <img src="/demo/synco/members/Group-c.png" className="w-6 h-6" alt="group" />
                              </div>
                              <div onClick={() => handleIconClick("p")} className="cursor-pointer">
                                <img src="/demo/synco/members/p.png" className="w-6 h-6" alt="p icon" />
                              </div>
                            </div>

                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <div><img onClick={() => {
                                setIsEditVenue(true);
                                setFormData(user);
                                setOpenForm(true)
                              }} src="/demo/synco/members/edit.png" className='w-6 h-6 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-90' alt="" /></div>
                              <div>
                                <img
                                  onClick={() => handledelete(user.id)}
                                  src="/demo/synco/members/delete-02.png"
                                  className="w-6 h-6 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-90"
                                  alt=""
                                />
                              </div>
                              <div>  <img
                                src="/demo/synco/members/Time-Circle.png"
                                className="w-6 h-6 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-90"
                                alt="Navigate"
                                onClick={() => navigate('/weekly-classes/venues/class-schedule')}
                              /></div>
                            </div>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              </div>
            ) : (
              <p className='text-center  p-4 border-dotted border rounded-md'>No Members Found</p>
            )
          }
        </div>

        {openForm && (
          <div className="md:w-1/4 bg-white  rounded-4xl relative">

            <button
              onClick={() => {
                setOpenForm(false);
                setIsEditVenue(false);
                setFormData({
                  area: "",
                  name: "",
                  address: "",
                  facility: "",
                  parking: false,
                  congestion: false,
                  parkingNote: "",
                  entryNote: "",
                  termDateLinkage: "",
                  subscriptionLinkage: ""
                });
              }}
              className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-xl"
              title="Close"
            >
              &times;
            </button>
            <Create packages={packages} termGroup={termGroup} onClose={() => setOpenForm(false)} />


          </div>
        )}

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#0000007a] bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px]">
            <h2 className="text-lg font-semibold mb-2">Clicked Icon</h2>
            <p className="text-[#717073] mb-4">You clicked: <strong>{clickedIcon}</strong></p>
            <div className="text-right">
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default List;
