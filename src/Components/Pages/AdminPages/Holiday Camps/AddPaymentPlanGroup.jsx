import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayments } from '../contexts/PaymentPlanContext';

import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';

const AddPaymentPlanGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [previewShowModal, setPreviewShowModal] = useState(false);
    const { createPackage, createGroup } = usePayments();

    const [description, setDescription] = useState('');
    const [packageDetails, setPackageDetails] = useState('');
    const [terms, setTerms] = useState('');
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        interval: '',
        duration: '',
        students: '',
        joiningFee: ''
    });
    const previewPlans = [
        { students: '1 Student', price: '£99.99' },
        { students: '2 Student', price: '£99.99' },
        { students: '3 Student', price: '£99.99' },
    ];

    const [openForm, setOpenForm] = useState(false);
    const navigate = useNavigate();

    const handleAddPlan = () => {
        setOpenForm(true);
    };

    const handleSavePlan = async () => {
        const newPlan = {
            title: formData.title,
            price: formData.price,
            interval: formData.interval,
            duration: formData.duration,
            students: formData.students,
            joiningFee: formData.joiningFee,
        };

        try {
            await createPackage(newPlan); // Save to backend
            setPlans([...plans, newPlan]); // Optionally save locally for grouping
            setFormData({
                title: '',
                price: '',
                interval: '',
                duration: '',
                students: '',
                joiningFee: '',
            });
            setPackageDetails('');
            setTerms('');
            setOpenForm(false);
        } catch (err) {
            console.error('Error saving plan:', err);
        }
    };


    const handleRemovePlan = (index) => {
        const updated = [...plans];
        updated.splice(index, 1);
        setPlans(updated);
    };

    const handleCreateGroup = async () => {
        const payload = {
            name: groupName,
            description: description,
        };

        try {
            await createGroup(payload); // Send group to API

            console.log("Final Group Payload (Local Usage):", {
                name: groupName,
                description,
                plans,         // local UI only
                packageDetails,
                terms,
            });

            alert("Group Created Successfully!");
            // navigate("/admin-dashboard"); // Enable if routing
        } catch (err) {
            console.error('Error creating group:', err);
        }
    };

    console.log('plans', plans)
    return (
        <div className=" md:p-6 bg-gray-50 min-h-screen">

            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 w-full md:w-1/2`}>
                <h2
                    onClick={() => {
                        if (previewShowModal) {
                            setPreviewShowModal(false);
                        } else {
                            navigate('/holiday-camps/payment-planManager');
                        }
                    }}
                    className="text-2xl font-semibold flex items-center gap-2 cursor-pointer hover:opacity-80"
                >
                    <img src="/icons/arrow-left.png" alt="Back" />
                    {previewShowModal ? '2023/24 Standard Pricing preview' : 'Add Payment Plan Group'}
                </h2>

            </div>

            <div className={`flex flex-col md:flex-row bg-white  rounded-3xl ${previewShowModal ? 'md:w-3/4  md:p-10' : 'w-full  md:p-12 p-4'}`}>
                {previewShowModal && (
                    <div className="flex items-center justify-center w-full px-4 py-6 sm:px-6 md:py-10">
                        <div className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-4xl shadow-2xl">

                            {/* Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E2E1E5] pb-4 mb-4 gap-2">
                                <h2 className="font-semibold text-[20px] sm:text-[24px]">Payment Plan Preview</h2>
                                <button
                                    onClick={() => setPreviewShowModal(false)}
                                    className="text-gray-400 hover:text-black text-xl font-bold"
                                >
                                    <img src="/icons/cross.png" alt="close" className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Plans Grid */}
                            <div className="grid pt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {previewPlans.map((plan, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-[#E2E1E5] rounded-xl p-4 sm:p-5 flex flex-col justify-between transition"
                                    >
                                        <h3 className="text-[18px] sm:text-[20px] font-semibold mb-2">{plan.students}</h3>
                                        <p className="text-[24px] sm:text-[32px] font-semibold mb-4">{plan.price}</p>
                                        <hr className="mb-4 text-[#E2E1E5]" />
                                        <ul className="space-y-2 text-[14px] sm:text-[16px] font-semibold">
                                            <li className="flex items-center py-2 gap-2">
                                                <img src="/icons/tick-circle.png" alt="" className="w-5 h-5" />
                                                4 day camp
                                            </li>
                                            <li className="flex items-center py-2 pb-2 sm:pb-4 gap-2">
                                                <img src="/icons/tick-circle.png" alt="" className="w-5 h-5" />
                                                Free Holiday Camp Bag
                                            </li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                ) ||
                    <>
                        <div className={`transition-all duration-300 md:w-1/2`}>
                            <div className="rounded-2xl  md:p-12 ">
                                <form className="mx-auto space-y-4">
                                    {/* Group Name */}
                                    <div>
                                        <label className="block text-base  font-semibold text-gray-700 mb-2">
                                            Payment Plan Group Name
                                        </label>
                                        <input
                                            value={groupName}
                                            onChange={(e) => setGroupName(e.target.value)}
                                            type="text"
                                            placeholder="Enter Group Name"
                                            className="w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-base  font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <input

                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            type="text"
                                            placeholder="Add Internal  reference"
                                            className="w-full px-4 font-semibold py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Payment Plans */}
                                    <div>
                                        <label className="block text-base  font-semibold text-gray-700 mb-2">
                                            Payment Plans
                                        </label>
                                        <div className="space-y-2  border border-gray-200 rounded-lg px-4 py-3 ">
                                            {plans.map((plan, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center font-semibold justify-between "
                                                >
                                                    <span>{`${plan.title}: ${plan.price}`}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemovePlan(idx)}
                                                        className="text-gray-500 hover:text-red-500"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Add Payment Plan Button */}
                                    <button
                                        type="button"
                                        onClick={handleAddPlan}
                                        className="w-full bg-[#237FEA] mb-8 text-white text-[16px] font-semibold py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Add Payment Plan
                                    </button>

                                    {/* Footer Buttons */}
                                    <div className="flex flex-wrap flex-col-reverse gap-4 md:flex-row md:items-center md:justify-end md:gap-4">


                                        <button
                                            type="button"
                                            onClick={() => setPreviewShowModal(true)}
                                            className="flex items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 w-full md:w-auto"
                                        >
                                            Preview Payment Plans
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={handleCreateGroup}
                                            type="submit"
                                            className="bg-[#237FEA] text-white min-w-50 font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 w-full md:w-auto"
                                        >
                                            Create Group
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>

                        <AnimatePresence>
                            {openForm && (
                                <motion.div
                                    initial={{ x: '100%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: '100%', opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full md:w-1/2 bg-white rounded-3xl p-6 shadow-2xl relative"
                                >
                                    <button
                                        onClick={() => setOpenForm(false)}
                                        className="absolute top-2 right-3  hover:text-gray-700 text-5xl"
                                        title="Close"
                                    >
                                        &times;
                                    </button>
                                    {/* Add your form content here */}
                                    <div className="text-[24px] font-semibold mb-4">Payment Plan</div>

                                    {[
                                        { label: "Title", name: "title" },
                                        { label: "Price (€)", name: "price" },
                                        { label: "Interval", name: "interval" },
                                        { label: "Duration", name: "duration" },
                                        { label: "Number of Students", name: "students" },
                                        { label: "Joining Fee (€)", name: "joiningFee" }
                                    ].map((field) => (
                                        <div key={field.name} className="mb-4">
                                            <label className="block text-base  font-semibold text-gray-700 mb-2">{field.label}</label>
                                            <input
                                                type="text"
                                                value={formData[field.name]}
                                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                                className="w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}

                                    <div className="mb-4">
                                        <label className="block text-base  font-semibold text-gray-700 mb-2">Holiday Camp Package Details</label>
                                      
                                        <Editor
                                            apiKey="frnlhul2sjabyse5v4xtgnphkcgjxm316p0r37ojfop0ux83"
                                             value={packageDetails}
                                            onEditorChange={(content) => setPackageDetails(content)}
                                            init={{
                                                height: 300,
                                                menubar: false,
                                                plugins: [
                                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons',
                                                    'image', 'link', 'lists', 'media', 'searchreplace', 'table',
                                                    'visualblocks', 'wordcount'
                                                ],
                                                toolbar:
                                                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
                                                    'link image media table mergetags | addcomment showcomments | ' +
                                                    'spellcheckdialog a11ycheck typography | align lineheight | ' +
                                                    'checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                                tinycomments_mode: 'embedded',
                                                tinycomments_author: 'Author name',
                                                mergetags_list: [
                                                    { value: 'First.Name', title: 'First Name' },
                                                    { value: 'Email', title: 'Email' },
                                                ],
                                                ai_request: (request, respondWith) =>
                                                    respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                            }}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-base  font-semibold text-gray-700 mb-2">Terms & Conditions</label>

                                        <Editor
                                            apiKey="frnlhul2sjabyse5v4xtgnphkcgjxm316p0r37ojfop0ux83"
                                            value={terms}
                                            onEditorChange={(content) => setTerms(content)}
                                            init={{
                                                height: 300,
                                                menubar: false,
                                                plugins: [
                                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons',
                                                    'image', 'link', 'lists', 'media', 'searchreplace', 'table',
                                                    'visualblocks', 'wordcount'
                                                ],
                                                toolbar:
                                                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
                                                    'link image media table mergetags | addcomment showcomments | ' +
                                                    'spellcheckdialog a11ycheck typography | align lineheight | ' +
                                                    'checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                                tinycomments_mode: 'embedded',
                                                tinycomments_author: 'Author name',
                                                mergetags_list: [
                                                    { value: 'First.Name', title: 'First Name' },
                                                    { value: 'Email', title: 'Email' },
                                                ],
                                                ai_request: (request, respondWith) =>
                                                    respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                            }}
                                        />
                                    </div>

                                    <div className="text-right">
                                        <button
                                            onClick={handleSavePlan}
                                            className="bg-[#237FEA] text-white mt-5 min-w-50 font-semibold px-6 py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            Save Plan
                                        </button>
                                    </div>



                                </motion.div>
                            )}
                        </AnimatePresence>

                    </>}
            </div>


        </div>
    );
};

export default AddPaymentPlanGroup;
