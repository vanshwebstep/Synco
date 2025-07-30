import Select from "react-select";
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, m } from 'framer-motion';
import SessionPlanSelect from "./SessionPlanSelect";
import { useNavigate, useParams } from 'react-router-dom';
import { useTermContext } from '../../contexts/TermDatesSessionContext';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

const initialTerms = [];
const Create = () => {
    const token = localStorage.getItem("adminToken");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [searchParams] = useSearchParams();

    const id = searchParams.get("id");

    const [terms, setTerms] = useState(initialTerms);
    const [activeSessionValue, setActiveSessionValue] = useState('');
    const [sessionMappings, setSessionMappings] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isGroupSaved, setIsGroupSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionsMap, setSessionsMap] = useState([]);
    const [savedTermIds, setSavedTermIds] = useState(new Set());
    const activeTerm = terms.find(t => t.isOpen);
    const activeSessionCount = parseInt(activeSessionValue || 0, 10);
    const [isMapping, setIsMapping] = useState(false);
    const navigate = useNavigate();

    const { createTermGroup, updateTermGroup, myGroupData, setMyGroupData, setSelectedTermGroup, selectedTermGroup, fetchTerm, termData, fetchTermGroupById } = useTermContext();
    console.log('terms', terms)
    // Handle prefilling data in edit mode
    // First: fetch group data and wait for state update
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                console.log('Fetching group data...');
                setMyGroupData(null)
                await fetchTermGroupById(id); // This should update selectedTermGroup and termData
                setIsEditMode(true); // Only set this AFTER fetch completes
            };

            fetchData();
        }
        else {
            setSelectedTermGroup(null)
        }
    }, [id]);

    // Second: Wait for isEditMode + termData + selectedTermGroup
    useEffect(() => {
        if (isEditMode && termData.length && selectedTermGroup?.id) {
            console.log('Processing group data...', termData);
            setMyGroupData(null)
            setGroupName(selectedTermGroup.name);
            setIsGroupSaved(true);

            const matchedTerms = termData.filter(
                (term) => term.termGroup?.id === selectedTermGroup.id
            );
            console.log('Processing group matchedTerms...', matchedTerms);

            if (matchedTerms?.length) {
                const mappedTerms = matchedTerms.map(term => ({
                    id: term.id,
                    name: term.termName,
                    startDate: term.startDate,
                    endDate: term.endDate,
                    exclusions: JSON.parse(term.exclusionDates || '[]'),
                    sessions: term.sessionsMap?.length || 0,
                    isOpen: false,
                    sessionsMap: term.sessionsMap || []
                }));

                setTerms(mappedTerms);

                const extractedData = mappedTerms.flatMap(term =>
                    term.sessionsMap.map(session => ({
                        sessionDate: session.sessionDate,
                        sessionPlanId: session.sessionPlanId,
                        termId: term.id,
                    }))
                );
                setSavedTermIds(prev => {
                    const updated = new Set(prev);
                    matchedTerms.forEach(term => updated.add(term.id));
                    return updated;
                });
                console.log('extractedData', extractedData);
                setSessionMappings(extractedData);
            }
        }
    }, [isEditMode, termData, selectedTermGroup]);

    const handleGroupNameSave = async () => {
        if (!groupName.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Group Name Required',
                text: 'Please enter a name for the term group',
                confirmButtonColor: '#d33'
            });
            return;
        }

        console.log('myGroupData', selectedTermGroup);
        setMyGroupData(null)
        setIsLoading(true);
        try {
            const payload = { name: groupName };

            const groupId = myGroupData?.id || selectedTermGroup?.id;
            console.log('myGroupData', groupId);
            if (groupId) {
                // Update existing group
                await updateTermGroup(groupId, payload);
                Swal.fire({
                    icon: 'success',
                    title: 'Group Updated',
                    text: 'Term group updated successfully',
                    confirmButtonColor: '#3085d6'
                });
            } else {
                // Create new group
                const createdGroup = await createTermGroup(payload);

            }

            setIsGroupSaved(true);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: error?.message || 'Failed to save group name',
                confirmButtonColor: '#d33'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleMapSession = () => {
        if (!isGroupSaved) {
            alert('Please save the group name first');
            return;
        }

        if (!activeTerm) {
            alert('Please select a term to map sessions');
            return;
        }

        setIsMapping(!isMapping);
    };

    useEffect(() => {

        const openTerm = terms.find(t => t.isOpen);
        if (openTerm) {
            console.log('openTerm0', openTerm)
            setActiveSessionValue(openTerm.sessions || '');
            // Load either saved mappings or unsaved mappings
            setSessionMappings(openTerm.sessionsMap.length > 0 ?
                openTerm.sessionsMap :
                openTerm.unsavedSessionMappings || []);

        } else {
            setActiveSessionValue('');
            setSessionMappings([]);
        }
    }, [terms]);

    // IN PROGRESS


    // Term management functions
    const toggleTerm = (id) => {
        if (!isGroupSaved) {
            Swal.fire({
                icon: 'error',
                title: 'Save Group First',
                text: 'Please save the group name before adding terms',
                confirmButtonColor: '#d33'
            });
            return;
        }

        // Save current term's unsaved mappings before switching
        setTerms(prev => prev.map(term => {
            if (term.isOpen) {
                return {
                    ...term,
                    unsavedSessionMappings: [...sessionMappings] // Save current mappings
                };
            }
            return term;
        }));

        // Then toggle the terms
        setTerms(prev => prev.map(term => ({
            ...term,
            isOpen: term.id === id ? !term.isOpen : false
        })));

        // Load the new term's mappings
        const newActiveTerm = terms.find(t => t.id === id);
        if (newActiveTerm) {
            setSessionMappings(newActiveTerm.unsavedSessionMappings || []);
        }
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

    const deleteTerm = useCallback(async (id) => {
        if (!token) return;

        const willDelete = await Swal.fire({
            title: "Are you sure?",
            text: "This action will permanently delete the term.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        if (!willDelete.isConfirmed) return; // Exit if user cancels

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/term/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                Swal.fire("Deleted!", "The term was deleted successfully.", "success");
                fetchTerm()
            } else {
                const errorData = await response.json();
                Swal.fire("Failed", errorData.message || "Failed to delete the term.", "error");
            }
        } catch (err) {
            console.error("Failed to delete term:", err);
            Swal.fire("Error", "Something went wrong. Please try again.", "error");
        }
    }, [token]);
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
        console.log('index', field, value)
        const updated = [...sessionMappings];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setSessionMappings(updated);
    };



    const handleSaveMappings = async () => {
        if (!sessionMappings.length) {
            alert('Please add at least one session mapping');
            return;
        }
        console.log('sessionMappings', sessionMappings)
        // Validate all mappings have both date and plan
        const isValid = sessionMappings.every(mapping =>
            mapping.sessionDate && mapping.sessionPlanId
        );

        if (!isValid) {
            alert('Please fill all session mappings completely');
            return;
        }
        console.log('sessionMappings', sessionMappings)

        setSessionsMap(sessionMappings);
        setIsMapping(false);
        alert('Session mappings saved successfully');
    };
    const handleSaveTerm = async (term) => {
        console.log('selectedTermGroup', selectedTermGroup)
        if (!myGroupData?.id && !selectedTermGroup) {
            console.error("Missing termGroupId");
            return;
        }

        console.log("OK"); // Either one exists




        console.log('Term to save:', term);
        console.log('Matched terms:', termData);

        // Validate required fields
        if (!term.name || !term.startDate || !term.endDate || !term.sessions) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Please fill all required fields for the term',
                confirmButtonColor: '#d33'
            });
            return;
        }

        // Validate session mappings
        if (sessionMappings.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Session Mapping Required',
                text: 'Please map all sessions before saving the term',
                confirmButtonColor: '#d33'
            });
            return;
        }
        console.log('selectedTermGroup', selectedTermGroup?.id)
        // Prepare the payload
        const payload = {
            termName: term.name,
            termGroupId: myGroupData?.id || selectedTermGroup?.id,
            sessionPlanGroupId: 1, // static value
            startDate: term.startDate,
            endDate: term.endDate,
            totalNumberOfSessions: Number(term.sessions),
            exclusionDates: term.exclusions.filter((ex) => ex.trim() !== ""),
            sessionsMap: sessionMappings.map((session) => ({
                sessionDate: session.sessionDate,
                sessionPlanId: session.sessionPlanId,
            })),
            unsavedSessionMappings: []
        };

        // Determine if it's an existing term (edit)
        const isExistingTerm = termData.some((t) => t.id === term.id);
        const requestUrl = isExistingTerm
            ? `${API_BASE_URL}/api/admin/term/${term.id}`
            : `${API_BASE_URL}/api/admin/term`;
        const method = isExistingTerm ? "PUT" : "POST";

        setIsLoading(true);
        try {
            const response = await fetch(requestUrl, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to save term.');
            }

            // Update the terms list
            setTerms(prev => prev.map(t => {
                if (t.id === term.id) {
                    return {
                        ...t,
                        id: data.data.id || t.id,
                        name: data.data.termName || t.name,
                        startDate: data.data.startDate || t.startDate,
                        endDate: data.data.endDate || t.endDate,
                        sessions: data.data.totalNumberOfSessions?.toString() || t.sessions,
                        exclusions: data.data.exclusionDates || t.exclusions,
                        sessionsMap: data.data.sessionsMap || sessionMappings,
                    };
                }
                return t;
            }));

            // Save to saved list
            setSavedTermIds(prev => new Set(prev).add(data.data.id || term.id));

            Swal.fire({
                icon: 'success',
                title: data.message || 'Term Saved Successfully',
                confirmButtonColor: '#3085d6'
            });

            toggleTerm(term.id);
        } catch (error) {
            console.error("❌ Error saving term:", error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to Save Term',
                text: error.message || 'An unexpected error occurred.',
                confirmButtonColor: '#d33'
            });
        } finally {
            setIsLoading(false);
        }
    };


    const addNewTerm = () => {
        if (!isGroupSaved) {
            Swal.fire({
                icon: 'error',
                title: 'Save Group First',
                text: 'Please save the group name before adding terms',
                confirmButtonColor: '#d33'
            });
            return;
        }

        // Check for unsaved terms
        const hasUnsavedTerms = terms.some(t => !savedTermIds.has(t.id));
        if (hasUnsavedTerms) {
            Swal.fire({
                icon: 'error',
                title: 'Unsaved Term',
                text: 'Please save the current term before adding a new one',
                confirmButtonColor: '#d33'
            });
            return;
        }

        // Clear session mappings for the new term
        setSessionMappings([]);

        setTerms(prev => [
            ...prev,
            {
                id: Date.now(),
                name: '',
                startDate: '',
                endDate: '',
                exclusions: [''],
                sessions: '',
                isOpen: true,
                sessionsMap: []
            },
        ]);
    };

    const handleSaveAll = async () => {
        if (!terms.length) {
            Swal.fire({
                icon: 'error',
                title: 'No Terms',
                text: 'Please add at least one term',
                confirmButtonColor: '#d33'
            });
            return;
        }

        // Check if all terms are saved
        const unsavedTerms = terms.filter(t => !savedTermIds.has(t.id));
        if (unsavedTerms.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Unsaved Terms',
                text: `Please save all terms (${unsavedTerms.length} unsaved) before final submission`,
                confirmButtonColor: '#d33'
            });
            return;
        }

        // Success - navigate away or show success message
        Swal.fire({
            icon: 'success',
            title: 'All Terms Saved',
            text: 'Your term group has been saved successfully',
            confirmButtonColor: '#3085d6'
        }).then(() => {
            navigate('/weekly-classes/term-dates/list');
        });
    };
    console.log('selectedTermGroup', selectedTermGroup)
    console.log("myGroupData", myGroupData)
    return (
        <div className="md:p-6 bg-gray-50 min-h-screen">
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
            <div className="flex flex-col gap-8 md:flex-row rounded-3xl w-full">
                <div className="transition-all duration-300 md:w-1/2">
                    <h3 className="font-semibold   text-[24px]"> <b>Step 1: </b>Add term Dates </h3>
                    <div className="rounded-2xl mb-5 bg-white md:p-6">
                        <div className="border border-gray-200 rounded-3xl px-4 py-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-base font-semibold text-gray-700 mb-2">
                                    Name of Term Group
                                </label>
                                {isGroupSaved && (
                                    <img
                                        src="/demo/synco/icons/edit.png"
                                        className="w-[18px] cursor-pointer"
                                        onClick={() => setIsGroupSaved(false)} // Allow editing
                                        alt="Edit group name"
                                    />
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Enter Term Group Name"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                onBlur={handleGroupNameSave}
                                className="md:w-1/2 px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isGroupSaved && !isEditMode}
                            />
                            {!isGroupSaved && (
                                <button
                                    onClick={handleGroupNameSave}
                                    disabled={isLoading}
                                    className="mt-2 ml-6 bg-[#237FEA] text-white text-[14px] font-semibold px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    {isLoading
                                        ? 'Saving...'
                                        : myGroupData?.id
                                            ? 'Update Group Name'
                                            : 'Save Group Name'}
                                </button>
                            )}

                        </div>
                    </div>

                    {isGroupSaved && (
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
                                                    className="md:w-1/2 px-4 mb-5 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />

                                                <div className="md:flex gap-4 mb-5 justify-between">
                                                    <div className="w-full">
                                                        <label className="block text-base font-semibold text-gray-700 mb-2">
                                                            Start Date
                                                        </label>
                                                        <DatePicker
                                                            placeholderText="Enter Start Date"
                                                            selected={term.startDate ? new Date(term.startDate) : null}
                                                            onChange={(date) =>
                                                                handleInputChange(term.id, 'startDate', date?.toISOString() || "")
                                                            }
                                                            dateFormat="EEEE, dd MMM"

                                                            className="w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <label className="block text-base font-semibold text-gray-700 mb-2">
                                                            End Date
                                                        </label>
                                                        <DatePicker
                                                            placeholderText="Enter End Date"
                                                            selected={term.endDate ? new Date(term.endDate) : null}
                                                            onChange={(date) =>
                                                                handleInputChange(term.id, 'endDate', date?.toISOString() || "")
                                                            }
                                                            dateFormat="EEEE, dd MMM"

                                                            className="w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />

                                                    </div>
                                                </div>

                                                <div className="md:flex gap-4 mb-5 justify-between">
                                                    <div className="w-full">
                                                        <label className="block text-base font-semibold text-gray-700 mb-2">
                                                            Exclusion Date(s)
                                                        </label>
                                                        {term.exclusions.map((ex, idx) => (
                                                            <div key={idx} className="flex gap-2 mb-2 items-center">


                                                                <DatePicker
                                                                    placeholderText={`Exclusion Date ${idx + 1}`}
                                                                    selected={ex ? new Date(ex) : null}
                                                                    onChange={(date) =>
                                                                        handleExclusionChange(term.id, idx, date?.toISOString() || "")
                                                                    }
                                                                    dateFormat="EEEE, dd MMM"

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
                                                            type="number"
                                                            placeholder="Total Number of Sessions"
                                                            value={term.sessions}
                                                            onChange={(e) =>
                                                                handleInputChange(term.id, 'sessions', e.target.value)
                                                            }
                                                            className="w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            min="1"
                                                        />
                                                    </div>
                                                </div>

                                                {activeSessionValue && (
                                                    <div className="text-right font-semibold text-blue-600 mb-4">
                                                        Active Term Sessions: {activeSessionValue}
                                                    </div>
                                                )}

                                                <div className="flex gap-4 justify-between">
                                                    <div className="w-full md:block hidden" />
                                                    <div className="w-full md:flex items-center gap-2 space-y-2 md:space-y-0">
                                                        <button
                                                            className={`flex whitespace-nowrap md:w-4/12 w-full items-center justify-center gap-1 border ${term.isSubmitted ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed' : 'border-blue-500 text-[#237FEA] hover:bg-blue-50'
                                                                } px-4 py-2 rounded-lg text-[14px] font-semibold`}
                                                            onClick={() => !term.isSubmitted && handleMapSession(term.id)}
                                                            disabled={term.isSubmitted}
                                                        >
                                                            Map Session
                                                        </button>

                                                        <button
                                                            className="bg-[#237FEA] text-white text-[14px] md:w-8/12 w-full font-semibold px-6 py-3 rounded-lg hover:bg-blue-700"
                                                            onClick={() => {
                                                                const activeTerm = terms.find(t => t.isOpen);
                                                                if (activeTerm) handleSaveTerm(activeTerm);
                                                            }}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? 'Saving...' : 'Save Term'}
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
                                    onClick={addNewTerm}
                                    className="flex items-center min-w-40 justify-center gap-1 border border-gray-400 text-gray-400 text-[14px] px-4 py-3 rounded-lg hover:bg-gray-100 w-full md:w-auto"
                                >
                                    + Add Term
                                </button>
                                <button
                                    className="bg-[#237FEA] text-white min-w-40 font-semibold px-6 py-3 rounded-lg text-[14px] hover:bg-blue-700 w-full md:w-auto"
                                    onClick={handleSaveAll}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save All'}
                                </button>
                            </div>
                        </div>
                    )}
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
                                    <div className="md:flex items-center justify-between mb-2">
                                        <label className="block text-[22px] font-semibold">
                                            {activeTerm?.name}
                                        </label>
                                    </div>
                                    <div className="flex justify-between gap-4 w-full text-[18px] mb-4 font-semibold">
                                        <label className=" w-1/2">Session Date</label> <label className=" w-1/2 md:pl-5">Session Plan</label>
                                    </div>
                                    {Array.from({ length: activeSessionCount }).map((_, index) => (
                                        <div key={index} className="md:flex w-full items-start gap-4 justify-between mb-4">
                                            <div className="w-1/2 ">


                                                <div className="flex items-center  gap-2 bg-white border border-gray-300 rounded-2xl px-4 py-3 mb-4 shadow-sm">
                                                    <span className="font-semibold text-base text-black whitespace-nowrap">Session {index + 1}</span>
                                                    <DatePicker
                                                        selected={
                                                            sessionMappings[index]?.sessionDate
                                                                ? new Date(sessionMappings[index].sessionDate)
                                                                : null
                                                        }
                                                        onChange={(e) =>
                                                            handleMappingChange(index, "sessionDate", e?.toISOString() || "")
                                                        }
                                                        dateFormat="EEEE, dd MMM"
                                                        className="text-[#717073] text-[15px] font-semibold bg-transparent focus:outline-none"
                                                        placeholderText="Select date"
                                                    />
                                                </div>

                                            </div>
                                            <div className="w-1/2 ">

                                                <motion.div
                                                    key={`sessionPlanId-${index}`}
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 10 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <SessionPlanSelect
                                                        idx={index}
                                                        value={sessionMappings[index]?.sessionPlanId}
                                                        onChange={handleMappingChange}
                                                    />


                                                </motion.div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex gap-4 justify-between">
                                        <div className="w-1/2" />
                                        <div className="w-full flex items-center gap-2">
                                            <button
                                                className="flex whitespace-nowrap w-6/12 items-center justify-center gap-1 border border-blue-500 text-[#237FEA] px-4 py-2 rounded-lg text-base font-semibold hover:bg-blue-50"
                                                onClick={() => setIsMapping(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveMappings}
                                                className="bg-[#237FEA] text-white text-base w-6/12 font-semibold px-6 py-3 rounded-lg hover:bg-blue-700"
                                            >
                                                Save Mappings
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