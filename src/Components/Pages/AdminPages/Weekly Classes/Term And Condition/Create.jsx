import Select from "react-select";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SessionPlanSelect from "./SessionPlanSelect"
import { useNavigate } from 'react-router-dom';

const initialTerms = [
    {
        id: 1,
        name: 'Autumn 2025',
        startDate: 'Sat 9th Sep 2025',
        endDate: 'Sat 10th Dec 2025',
        exclusions: ['Sat 15th Oct 2025'],
        sessions: '12',
        isOpen: true,
    },
    {
        id: 2,
        name: 'Spring 2025',
        startDate: 'Sat 5th Jan 2025',
        endDate: 'Sat 30th Mar 2025',
        exclusions: ['Sat 10th Feb 2025', 'Sat 17th Feb 2025'],
        sessions: '10',
        isOpen: false,
    },
    {
        id: 3,
        name: 'Summer 2025',
        startDate: '',
        endDate: '',
        exclusions: [''],
        sessions: '',
        isOpen: false,
    },
];
const Create = () => {
    const [terms, setTerms] = useState(initialTerms);
    const [activeSessionValue, setActiveSessionValue] = useState('');
    const [sessionMappings, setSessionMappings] = useState([]);
    const activeTerm = terms.find(t => t.isOpen);
    const activeSessionCount = parseInt(activeSessionValue || 0, 10);
    const [isMapping, setIsMapping] = useState(false);
    const navigate = useNavigate();

    const handleMapSession = () => {
        setIsMapping(!isMapping); // toggle the mapping state
    };
    useEffect(() => {
        const openTerm = terms.find(t => t.isOpen);
        if (openTerm) {
            setActiveSessionValue(openTerm.sessions || '');
        } else {
            setActiveSessionValue('');
        }
    }, [terms]);

    const toggleTerm = (id) => {
        setTerms((prev) =>
            prev.map((term) => ({
                ...term,
                isOpen: term.id === id ? !term.isOpen : false, // only one open at a time
            }))
        );
    };

    const handleInputChange = (id, field, value) => {
        setTerms((prev) =>
            prev.map((term) =>
                term.id === id ? { ...term, [field]: value } : term
            )
        );

        if (field === 'sessions') {
            const current = terms.find(t => t.id === id);
            if (current?.isOpen) {
                setActiveSessionValue(value);
            }
        }
    };


    const handleExclusionChange = (termId, index, value) => {
        setTerms((prev) =>
            prev.map((term) =>
                term.id === termId
                    ? {
                        ...term,
                        exclusions: term.exclusions.map((ex, i) =>
                            i === index ? value : ex
                        ),
                    }
                    : term
            )
        );
    };

    const addExclusionDate = (termId) => {
        setTerms((prev) =>
            prev.map((term) =>
                term.id === termId
                    ? { ...term, exclusions: [...term.exclusions, ''] }
                    : term
            )
        );
    };

    const deleteTerm = (id) => {
        setTerms((prev) => prev.filter((term) => term.id !== id));
    };
    const removeExclusionDate = (termId, indexToRemove) => {
        setTerms((prev) =>
            prev.map((term) =>
                term.id === termId
                    ? {
                        ...term,
                        exclusions: term.exclusions.filter((_, idx) => idx !== indexToRemove),
                    }
                    : term
            )
        );
    };
    const handleMappingChange = (index, field, value) => {
        setSessionMappings(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [field]: value,
            };
            return updated;
        });
    };

    const handleSaveMappings = () => {
        console.log('✅ Saved session mappings for:', activeTerm.name);
        console.table(sessionMappings);
        // TODO: Send to API or context
    };


    return (
        <div className="md:p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 w-full md:w-1/2">
                <h2
                    onClick={() => {
                        navigate('/weekly-classes/term-dates/list');
                    }}
                    className="text-xl md:text-[28px] font-semibold flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity mb-4 duration-200">
                    <img
                        src="/demo/synco/icons/arrow-left.png"
                        alt="Back"
                        className="w-5 h-5 md:w-6 md:h-6"
                    />
                    <span className="truncate">Add Term Dates</span>
                </h2>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-8  md:flex-row rounded-3xl w-full">
                <div className="transition-all duration-300 md:w-1/2">
                    <h3 className="font-semibold   text-[24px]"> <b>Step 1: </b>Add term Dates </h3>

                    <div className="rounded-2xl mb-5 bg-white md:p-6">

                        <div className="border border-gray-200 rounded-3xl px-4  py-3">
                            <div className="flex items-center justify-between">
                                <label className="rounded-3xl block text-base font-semibold text-gray-700 mb-2">
                                    Name of Term Group
                                </label>
                                <img src="/demo/synco/icons/edit.png" className="w-[18px]" alt="" />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter Term Group Name"
                                className="w-1/2 px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="rounded-2xl mb-5 bg-white md:p-6">
                        {terms.map((term) => (
                            <div
                                key={term.id}
                                className="border mb-5 border-gray-200 rounded-3xl px-4 py-3"
                            >
                                <div className="flex items-center justify-between">
                                    <label className="rounded-3xl block text-base font-semibold text-gray-700 mb-2">
                                        {term.name || 'Term Name'}
                                    </label>
                                    <div className="flex gap-2">
                                        <img
                                            src="/demo/synco/icons/edit.png"
                                            className="w-[18px] cursor-pointer"
                                            onClick={() => toggleTerm(term.id)}
                                        />
                                        <img
                                            src="/demo/synco/icons/deleteIcon.png"
                                            className="w-[18px] cursor-pointer"
                                            onClick={() => deleteTerm(term.id)}
                                        />
                                        {term.isOpen && (
                                            <img
                                                src="/demo/synco/icons/crossGray.png"
                                                className="w-[18px] cursor-pointer"
                                                onClick={() => toggleTerm(term.id)}
                                            />
                                        )}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {term.isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Enter Term Name"
                                                value={term.name}
                                                onChange={(e) =>
                                                    handleInputChange(term.id, 'name', e.target.value)
                                                }
                                                className="w-1/2 px-4 mb-5 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />

                                            <div className="flex gap-4 mb-5 justify-between">
                                                <div className="w-full">
                                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                                        Start Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Start Date"
                                                        value={term.startDate}
                                                        onChange={(e) =>
                                                            handleInputChange(term.id, 'startDate', e.target.value)
                                                        }
                                                        className="w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                                        End Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter End Date"
                                                        value={term.endDate}
                                                        onChange={(e) =>
                                                            handleInputChange(term.id, 'endDate', e.target.value)
                                                        }
                                                        className="w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-4 mb-5 justify-between">
                                                <div className="w-full">
                                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                                        Exclusion Date(s)
                                                    </label>
                                                    {term.exclusions.map((ex, idx) => (
                                                        <div key={idx} className="flex gap-2 mb-2 items-center">
                                                            <input
                                                                type="text"
                                                                placeholder={`Exclusion Date ${idx + 1}`}
                                                                value={ex}
                                                                onChange={(e) =>
                                                                    handleExclusionChange(term.id, idx, e.target.value)
                                                                }
                                                                className="w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                            {term.exclusions.length > 1 && (
                                                                <button
                                                                    onClick={() => removeExclusionDate(term.id, idx)}
                                                                    type="button"
                                                                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                                                                    title="Remove"
                                                                >
                                                                    &times;
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        className="text-sm text-blue-500 mt-1 font-semibold"
                                                        onClick={() => addExclusionDate(term.id)}
                                                    >
                                                        + Add Exclusion Date
                                                    </button>
                                                </div>

                                                <div className="w-full">
                                                    <label className="block text-base font-semibold text-gray-700 mb-2">
                                                        Total Number of Sessions
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Total Number of Sessions"
                                                        value={term.sessions}
                                                        onChange={(e) =>
                                                            handleInputChange(term.id, 'sessions', e.target.value)
                                                        }
                                                        className="w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="w-1/2 mb-4">
                                                <button
                                                    className="flex w-full items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg font-semibold hover:bg-blue-50"
                                                    onClick={() => addExclusionDate(term.id)}
                                                >
                                                    + Add Exclusion Date
                                                </button>
                                            </div>
                                            {activeSessionValue && (
                                                <div className="text-right font-semibold text-blue-600 mb-4">
                                                    Active Term Sessions: {activeSessionValue}
                                                </div>
                                            )}

                                            <div className="flex gap-4 justify-between">
                                                <div className="w-full" />
                                                <div className="w-full flex items-center gap-2">
                                                    <button
                                                        className="flex whitespace-nowrap w-4/12 items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg text-[14px] font-semibold hover:bg-blue-50"
                                                        onClick={handleMapSession}
                                                    >
                                                        Map Session
                                                    </button>
                                                    <button className="bg-[#237FEA] text-white text-[14px] w-8/12 font-semibold px-6 py-3 rounded-lg hover:bg-blue-700">
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        <div className="flex mb-5 flex-wrap flex-col-reverse gap-4 md:flex-row md:items-center md:justify-end md:gap-4">
                            <button
                                onClick={() =>
                                    setTerms((prev) => [
                                        ...prev,
                                        {
                                            id: Date.now(),
                                            name: '',
                                            startDate: '',
                                            endDate: '',
                                            exclusions: [''],
                                            sessions: '',
                                            isOpen: true,
                                        },
                                    ])
                                }
                                className="flex items-center min-w-40 justify-center gap-1 border border-gray-400 text-gray-400 text-[14px] px-4 py-3 rounded-lg hover:bg-gray-100 w-full md:w-auto"
                            >
                                + Add Term
                            </button>
                            <button className="bg-[#237FEA] text-white min-w-40 font-semibold px-6 py-3 rounded-lg text-[14px] hover:bg-blue-700 w-full md:w-auto">
                                Save
                            </button>
                        </div>
                    </div>


                </div>

                <AnimatePresence>
                    {activeTerm && isMapping && (
                        <motion.div
                            key="session-step"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.4 }}
                            className="transition-all duration-300 md:w-1/2"
                        >
                            <h3 className="font-semibold text-[24px] mb-4">
                                <b>Step 2:</b> Map Sessions Plans for{' '}
                                <span className="text-blue-600">{activeTerm.name}</span>
                            </h3>

                            <motion.div
                                initial={{ scale: 0.98, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.98, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="rounded-2xl mb-5 bg-white md:p-6"
                            >
                                <div className="border border-gray-200 rounded-3xl px-4 py-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-[22px] font-semibold">
                                            {activeTerm.name}
                                        </label>
                                    </div>

                                    <div className="flex items-start gap-5 justify-between">
                                        {/* Session Date Column */}
                                        <div className="w-full">
                                            <label className="text-base">Session Date</label>
                                            {Array.from({ length: activeSessionCount }).map((_, idx) => (
                                                <motion.div
                                                    key={`date-${idx}`}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder={`Session Date ${idx + 1}`}
                                                        value={sessionMappings[idx]?.date || ''}
                                                        onChange={(e) =>
                                                            handleMappingChange(idx, 'date', e.target.value)
                                                        }
                                                        className="w-full px-4 mb-5 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Session Plan Column */}
                                        <div className="w-full">
                                            <label className="text-base">Ssession Plan</label>
                                            {Array.from({ length: activeSessionCount }).map((_, idx) => (
                                                <motion.div
                                                    key={`plan-${idx}`}
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 10 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                >
                                                    <SessionPlanSelect
                                                        idx={idx}
                                                        value={sessionMappings[idx]?.plan}
                                                        onChange={handleMappingChange}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer Buttons */}
                                    <div className="flex gap-4 justify-between">
                                        <div className="w-1/2" />
                                        <div className="w-full flex items-center gap-2">
                                            <button className="flex whitespace-nowrap w-6/12 items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg text-base font-semibold hover:bg-blue-50">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveMappings}
                                                className="bg-[#237FEA] text-white text-base w-6/12 font-semibold px-6 py-3 rounded-lg hover:bg-blue-700"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>

    );
};

export default Create;
