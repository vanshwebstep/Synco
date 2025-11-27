import React, { useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import TemplateBuilder from "./TemplateBuilder";
import { HiArrowUturnLeft,HiArrowUturnRight  } from "react-icons/hi2";

export default function CreateTemplateSteps() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        communication: "Email",
        title: "",
        category: "",
        tags: "",
        templateBody: "",
    });

    const next = () => setStep((p) => p + 1);
    const back = () => setStep((p) => p - 1);

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
                                    <HiArrowUturnLeft   className="text-2xl font-bold text-gray-500 hover:text-black cursor-pointer transition-colors duration-200"
 />

                                    {/* <img src="/demo/synco/icons/flipLeft.png" alt="" /> */}
                                </button>
                                <button
                                    className="px-3 py-0"
                                    onClick={next}
                                >
                                    <HiArrowUturnRight   className="text-2xl font-bold text-gray-500 hover:text-black cursor-pointer transition-colors duration-200"
/>

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
                            <div className="space-y-6 md:max-w-[50%] m-auto">

                                {/* Mode */}
                                <div>
                                    <label className="block text-base text-[#4B4B4B] mb-1">
                                        Mode of communication
                                    </label>

                                    <Select
                                        value={{ label: form.communication, value: form.communication }}
                                        onChange={(e) => setForm({ ...form, communication: e.value })}
                                        options={[{ label: "Email", value: "Email" }]}
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
                                        Email Template Category
                                    </label>
                                    <Select
                                        value={form.category ? { label: form.category, value: form.category } : null}
                                        onChange={(e) => setForm({ ...form, category: e.value })}
                                        options={[{ label: "General", value: "General" }]}
                                        className="text-base"
                                        classNamePrefix="react-select"
                                        placeholder=""
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
                                    className="w-full mt-4 py-3 rounded-xl bg-[#237FEA] text-white font-medium text-base"
                                    onClick={next}
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <>

                                <TemplateBuilder />
                            </>

                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-[20px] font-semibold">Preview</h3>

                                <div className="p-4 border border-[#E2E1E5] rounded-xl bg-gray-50 text-gray-800 whitespace-pre-wrap text-base min-h-[200px]">
                                    {form.templateBody || "No content"}
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        className="px-6 py-3 rounded-xl border border-gray-300 text-base"
                                        onClick={back}
                                    >
                                        Back
                                    </button>
                                    <button className="px-6 py-3 rounded-xl bg-[#2E90FA] text-white text-base">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </>
    );
}
