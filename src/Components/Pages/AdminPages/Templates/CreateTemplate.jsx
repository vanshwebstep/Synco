import React, { useState, useCallback, useEffect } from "react";

import Select from "react-select";
import { motion } from "framer-motion";
import TemplateBuilder from "./TemplateBuilder";
import { HiArrowUturnLeft, HiArrowUturnRight } from "react-icons/hi2";
import PreviewModal from "./PreviewModal";
import { FiSearch } from "react-icons/fi";

export default function CreateTemplateSteps() {


    const [isPreview, setIsPreview] = useState(false);
    const [builderBlocks, setBuilderBlocks] = useState([]);
    const [builderPreview, setBuilderPreview] = useState(false);
    const [builderSubject, setBuilderSubject] = useState("");
    const [step, setStep] = useState(1);
    const [communicationMode, setCommunicationMode] = useState(null);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const isEmailMode = communicationMode?.value === "email";
    const isTextMode = communicationMode?.value === "text";
    const [textform, setTextForm] = useState({
        sender: "",
        message: ""
    });
    const categoryList = [
        "Cancellations",
        "Sales",
        "Credits",
        "Price Increase",
    ];

    const communicationOptions = [
        { value: "email", label: "Email" },
        { value: "text", label: "Text" }
    ];
    const [form, setForm] = useState({
        communication: "",
        title: "",
        category: "",
        tags: "",
    });

    const next = () => setStep((p) => p + 1);
    const back = () => setStep((p) => p - 1);
    const save = () => alert('saved');
console.log('textform', textform);
    const inputClass =
        "w-full px-4 py-3 border border-[#E2E1E5] rounded-xl focus:outline-none bg-white";

    return (
        <>


            <div className="w-full  justify-center px-4 py-10">
                <div className="m-auto max-w-fit item-center flex gap-5 justify-center py-2">
                    {step === 2 && (
                        <>
                            <div className="px-6 py-4  item-center flex rounded-full border border-gray-300 text-base">
                                <button
                                    className="px-3 py-0"
                                    onClick={back}
                                >
                                    <HiArrowUturnLeft className="text-2xl font-bold text-gray-500 hover:text-black cursor-pointer transition-colors duration-200"
                                    />

                                    {/* <img src="/demo/synco/icons/flipLeft.png" alt="" /> */}
                                </button>
                                <button
                                    className="px-3 py-0"
                                    onClick={next}
                                >
                                    <HiArrowUturnRight className="text-2xl font-bold text-gray-500 hover:text-black cursor-pointer transition-colors duration-200"
                                    />

                                    {/* <img src="/demo/synco/icons/flipRight.png" alt="" /> */}

                                </button>
                            </div>
                        </>

                    )}
                    {step === 3 && (
                        <>
                            <div className="px-6 py-4  item-center flex rounded-full border border-gray-300 text-base">
                                <button
                                    className="px-3 py-0"
                                    onClick={back}
                                >
                                    <HiArrowUturnLeft className="text-2xl font-bold text-gray-500 hover:text-black cursor-pointer transition-colors duration-200"
                                    />

                                    {/* <img src="/demo/synco/icons/flipLeft.png" alt="" /> */}
                                </button>
                                <button
                                    className="px-3 bg-blue-400 rounded-full text-white py-0"
                                    onClick={save}
                                >
                                    SAVE


                                    {/* <img src="/demo/synco/icons/flipRight.png" alt="" /> */}

                                </button>
                            </div>
                        </>

                    )}

                </div>
                <div className="w-full m-auto md:max-w-[1043px] rounded-4xl border border-[#E2E1E5] bg-white pb-10">
                    {/* Header */}
                    <div className="px-10 pt-8 pb-6 border-b border-[#E2E1E5]">
                        <h2 className="text-[22px] md:text-[24px] font-semibold text-center mb-6">
                            Create Template
                        </h2>

                        {/* Steps */}
                        <div className="flex justify-center items-center gap-5 text-[13px] font-medium text-[#8A8A8A]">


                            <div className="flex flex-col items-left gap-1 text-[14px]">
                                <span className={step === 1 ? "text-black" : ""}>Setup</span>

                                <div
                                    className={`h-[8px] w-[189px]  transition-all ${step >= 1 ? "bg-[#2E90FA]" : "bg-[#E4E4E4]"
                                        }`}
                                ></div>
                            </div>

                            {/* Template */}
                            <div className="flex flex-col items-left gap-1 text-[14px]">
                                <span className={step === 2 ? "text-black" : ""}>Template</span>
                                <div
                                    className={`h-[8px] w-[189px] transition-all ${step >= 2 ? "bg-[#2E90FA]" : "bg-[#E4E4E4]"
                                        }`}
                                ></div>
                            </div>

                            {/* Preview */}
                            <div className="flex flex-col items-left gap-1 text-[14px]">
                                <span className={step === 3 ? "text-black" : ""}>Preview</span>
                                <div
                                    className={`h-[8px] w-[189px] transition-all ${step >= 3 ? "bg-[#2E90FA]" : "bg-[#E4E4E4]"
                                        }`}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-10 "
                    >
                        {step === 1 && (
                            <div className="space-y-6 mt-10 md:max-w-[50%] m-auto">

                                {/* Mode */}
                                <div>
                                    <label className="block text-base text-[#4B4B4B] mb-1">
                                        Mode of communication
                                    </label>

                                    <Select
                                        value={communicationMode}
                                        onChange={(selected) => {
                                            setCommunicationMode(selected);              // <-- store whole selected object
                                            setForm({ ...form, communication: selected.value });  // store value in form
                                        }}
                                        options={communicationOptions}
                                        className="text-base"
                                        classNamePrefix="react-select"
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                borderRadius: "1.5rem",
                                                borderColor: state.isFocused ? "#ccc" : "#E5E7EB",
                                                boxShadow: "none",
                                                padding: "4px 8px",
                                                minHeight: "48px",
                                            }),
                                            placeholder: (base) => ({ ...base, fontWeight: 600 }),
                                            dropdownIndicator: (base) => ({ ...base, color: "#9CA3AF" }),
                                            indicatorSeparator: () => ({ display: "none" }),
                                        }}
                                    />


                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-base text-[#4B4B4B] mb-1">Title</label>
                                    <input
                                        className={inputClass}
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-base text-[#4B4B4B] mb-1">
                                        {communicationMode?.label || "Communication"} Template Category
                                    </label>

                                    <div className="relative">
                                        {/* SELECT BOX */}
                                        <div
                                            onClick={() => setCategoryOpen(!categoryOpen)}
                                            className="border border-gray-300 rounded-2xl px-4 py-3 cursor-pointer bg-white"
                                        >
                                            {form.category.length === 0 ? (
                                                <span className="text-gray-400">Select category</span>
                                            ) : (
                                                <span className="font-medium">{form.category.join(", ")}</span>
                                            )}
                                        </div>

                                        {categoryOpen && (
                                            <div className="absolute top-full left-0 w-full bg-white mt-2 p-4 rounded-2xl shadow-xl z-50">

                                                {/* Search */}
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Add new category"
                                                        value={categorySearch}
                                                        onChange={(e) => setCategorySearch(e.target.value)}
                                                        className="w-full border rounded-xl pl-4 py-2 border-gray-200 focus:outline-none"
                                                    />
                                                </div>

                                                {/* Category List */}
                                                <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                                                    {categoryList
                                                        .filter((c) =>
                                                            c.toLowerCase().includes(categorySearch.toLowerCase())
                                                        )
                                                        .map((item) => (
                                                            <label key={item} className="flex items-center gap-2 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={form.category.includes(item)}
                                                                    onChange={() => {
                                                                        if (form.category.includes(item)) {
                                                                            setForm({
                                                                                ...form,
                                                                                category: form.category.filter((x) => x !== item),
                                                                            });
                                                                        } else {
                                                                            setForm({
                                                                                ...form,
                                                                                category: [...form.category, item],
                                                                            });
                                                                        }
                                                                    }}
                                                                    className="h-4 w-4"
                                                                />
                                                                <span className="text-gray-700">{item}</span>
                                                            </label>
                                                        ))}
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex justify-between mt-4">
                                                    <button
                                                        className="px-4 py-1 rounded-lg border text-gray-500"
                                                        onClick={() => setForm({ ...form, category: [] })}
                                                    >
                                                        Clear
                                                    </button>

                                                    <button
                                                        className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                                                        onClick={() => setCategoryOpen(false)}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-base text-[#4B4B4B] mb-1">Tags</label>
                                    <Select
                                        value={form.tags ? { label: form.tags, value: form.tags } : null}
                                        onChange={(e) => setForm({ ...form, tags: e.value })}
                                        options={[{ label: "Default", value: "Default" }]}
                                        className="text-base"
                                        placeholder=""
                                        classNamePrefix="react-select"
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                borderRadius: "1.5rem",
                                                borderColor: state.isFocused ? "#ccc" : "#E5E7EB",
                                                boxShadow: "none",
                                                padding: "4px 8px",
                                                minHeight: "48px",
                                            }),
                                            placeholder: (base) => ({ ...base, fontWeight: 600 }),
                                            dropdownIndicator: (base) => ({ ...base, color: "#9CA3AF" }),
                                            indicatorSeparator: () => ({ display: "none" }),
                                        }}
                                    />
                                </div>

                                {/* Next button */}
                                <button
                                disabled={!communicationMode?.value}
                                    className="w-full mt-4 py-3 rounded-xl bg-[#237FEA] text-white font-medium text-base"
                                    onClick={next}
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <>
                                {isEmailMode && (
                                    <TemplateBuilder
                                        blocks={builderBlocks}
                                        setBlocks={setBuilderBlocks}
                                        subject={builderSubject}
                                        setSubject={setBuilderSubject}
                                        isPreview={builderPreview}
                                        setIsPreview={setBuilderPreview}
                                    />
                                )}

                                {isTextMode && (
                                    <div className="max-w-md mx-auto mt-10 space-y-6">

                                        {/* Sender */}
                                        <div>
                                            <label className="block text-base text-[#4B4B4B] mb-1">Sender</label>
                                            <input
                                                className="w-full px-4 py-3 border border-[#E2E1E5] rounded-xl bg-white"
                                                placeholder="Text"
                                                value={textform.sender}
                                                onChange={(e) =>
                                                    setTextForm({ ...textform, sender: e.target.value })
                                                }
                                            />
                                        </div>

                                        {/* SMS Text Box */}
                                        <div>
                                            <label className="block text-base text-[#4B4B4B] mb-1">Text</label>
                                            <textarea
                                                className="w-full h-40 px-4 py-3 border border-[#E2E1E5] rounded-xl bg-white"
                                                maxLength={160}
                                                placeholder="Enter message..."
                                                value={textform.message}
                                                onChange={(e) =>
                                                    setTextForm({ ...textform, message: e.target.value })
                                                }
                                            ></textarea>

                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>1 Credit</span>
                                                <span>
                                                    {textform.message.length}/160 Characters used
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            className="w-full mt-4 py-3 rounded-xl bg-[#237FEA] text-white font-medium text-base"
                                            onClick={next}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {step === 3 && (
                            <>
                                {isEmailMode && (
                                    <div className="space-y-6">
                                        <PreviewModal
                                            blocks={builderBlocks}
                                            subject={builderSubject}
                                            onClose={() => setBuilderPreview(false)}
                                        />
                                    </div>
                                )}

                                {isTextMode && (
                                    <div className="max-w-md mx-auto mt-10 space-y-6">

                                        <h3 className="text-[20px] font-semibold">Preview</h3>

                                        <div className="rounded-xl space-y-4">
                                            <img className="w-full" src="/demo/synco/icons/TopNavigation.png" alt="" />
                                            <div className="min-h-80 p-4 ">
                                                <div className="bg-gray-100 p-4 rounded-xl min-h-20 text-sm text-gray-800">
                                                    {textform.message}
                                                </div>
                                            </div>
                                            <img className="w-full" src="/demo/synco/icons/mobileKeyboard.png" alt="" />

                                        </div>

                                        <button
                                            className="w-full py-3 bg-blue-500 text-white rounded-xl"
                                        >
                                            Save
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </>
    );
}
