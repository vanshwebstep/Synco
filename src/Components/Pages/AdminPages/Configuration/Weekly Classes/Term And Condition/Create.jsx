import Select from "react-select";
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, m } from 'framer-motion';
import SessionPlanSelect from "./SessionPlanSelect";
import { useNavigate, useParams } from 'react-router-dom';
import { useTermContext } from '../../../contexts/TermDatesSessionContext';
import Swal from 'sweetalert2';
import Loader from '../../../contexts/Loader';


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchParams } from "react-router-dom";
import { format } from "date-fns";

const initialTerms = [];
const Create = () => {
    const token = localStorage.getItem("adminToken");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [searchParams] = useSearchParams();
    const mapSectionRef = useRef(null);
    const id = searchParams.get("id");
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);
    const options = [
        { value: "monday", label: "Monday" },
        { value: "tuesday", label: "Tuesday" },
        { value: "wednesday", label: "Wednesday" },
        { value: "thursday", label: "Thursday" },
        { value: "friday", label: "Friday" },
        { value: "saturday", label: "Saturday" },
        { value: "sunday", label: "Sunday" },
    ];
    const termOptions = [
        { value: "Autumn", label: "Autumn" },
        { value: "Spring", label: "Spring" },
        { value: "Summer", label: "Summer" },
    ];

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
    // console.log('terms', terms)
    const { createTermGroup, updateTermGroup, myGroupData, setMyGroupData, setSelectedTermGroup, selectedTermGroup, fetchTerm, termData, fetchTermGroupById, loading } = useTermContext();
    // console.log('terms', terms)
    // Handle prefilling data in edit mode
    // First: fetch group data and wait for state update
    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                // console.log('Fetching group data...');
                setMyGroupData(null);
                await fetchTerm();

                await fetchTermGroupById(id);
                setIsEditMode(true);
            };

            fetchData();
        } else {
            setSelectedTermGroup(null);
        }
    }, [id, fetchTermGroupById]); // include fetchTermGroupById if it's stable (e.g., useCallback)



    // Second: Wait for isEditMode + termData + selectedTermGroup
    useEffect(() => {
        console.group('termData1', termData);

        if (isEditMode && termData.length && selectedTermGroup?.id) {
            setMyGroupData(null);
            setGroupName(selectedTermGroup.name);
            setIsGroupSaved(true);

            const matchedTerms = termData.filter(
                (term) => term.termGroup?.id === selectedTermGroup.id
            );

            if (matchedTerms?.length) {
                const mappedTerms = matchedTerms.map((term) => {
                    // Set selected day for the current term (optional — depends on your logic)
                    setSelectedDay(term.day);

                    return {
                        id: term.id,
                        day: term.day,
                        name: term.termName,
                        startDate: term.startDate,
                        endDate: term.endDate,
                        exclusions: Array.isArray(term?.exclusionDates)
                            ? term.exclusionDates
                            : JSON.parse(term?.exclusionDates || '[]'),
                        sessions: term.sessionsMap?.length || 0,
                        isOpen: false,
                        sessionsMap: term.sessionsMap || [],
                    };
                });

                setTerms(mappedTerms);

                const extractedData = mappedTerms.flatMap((term) =>
                    term.sessionsMap.map((session) => ({
                        sessionDate: session.sessionDate,
                        sessionPlanId: session.sessionPlanId,
                        termId: term.id,
                    }))
                );

                setSavedTermIds((prev) => {
                    const updated = new Set(prev);
                    matchedTerms.forEach((term) => updated.add(term.id));
                    return updated;
                });

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

        // console.log('myGroupData', selectedTermGroup);
        setMyGroupData(null)
        // setIsLoading(true);
        try {
            const payload = { name: groupName };

            const groupId = myGroupData?.id || selectedTermGroup?.id;
            // console.log('myGroupData', groupId);
            if (groupId) {
                // Update existing group
                await updateTermGroup(groupId, payload);
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Group Updated',
                //     text: 'Term group updated successfully',
                //     confirmButtonColor: '#3085d6'
                // });
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
            // setIsLoading(false);
        }
    };

    const handleMapSession = (termId) => {
        if (!isGroupSaved) {
            alert('Please save the group name first');
            return;
        }

        if (!activeTerm) {
            alert('Please select a term to map sessions');
            return;
        }

        // Only scroll when opening
        if (!isMapping) {
            setIsMapping(true);

            setTimeout(() => {
                mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100); // small delay to ensure the section is rendered
        } else {
            // If it's already open, just close
            setIsMapping(false);
        }
    };


    useEffect(() => {

        const openTerm = terms.find(t => t.isOpen);
        if (openTerm) {
            // console.log('openTerm0', openTerm)
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

    const [termselect, setTerm] = useState({
        startDate: "",
        endDate: "",
        sessionDates: [],
        exclusions: [],
    });
    // e.g., {value: "sunday", label: "Sunday"}

    // Handle multi-date selection for session dates
    const handleSessionDate = (termId, date) => {
        if (!selectedDay) {
            Swal.fire({ icon: "warning", title: "Oops...", text: "Select a day first!" });
            return;
        }

        const dateStr = date.toLocaleDateString("en-CA");

        setTerms((prev) =>
            prev.map((t) => {
                if (t.id === termId) {
                    let updatedDates = t.sessionsMap.map((s) => s.sessionDate);

                    if (updatedDates.includes(dateStr)) {
                        // Deselect
                        updatedDates = updatedDates.filter((d) => d !== dateStr);
                    } else {
                        updatedDates.push(dateStr);
                        updatedDates.sort();
                    }

                    const updatedSessionsMap = updatedDates.map((d, i) => ({
                        sessionDate: d,
                        sessionPlanId: t.sessionsMap[i]?.sessionPlanId || null,
                        sessionPlan: t.sessionsMap[i]?.sessionPlan || null,
                    }));

                    return {
                        ...t,
                        startDate: updatedDates[0] || "",
                        endDate: updatedDates[updatedDates.length - 1] || "",
                        sessionsMap: updatedSessionsMap,
                    };
                }
                return t;
            })
        );
    };
    // Handle exclusion dates
    const handleExclusionChange = (termId, idx, dateStr) => {
        setTerms((prev) =>
            prev.map((t) => {
                if (t.id === termId) {
                    const updatedExclusions = [...t.exclusions];
                    updatedExclusions[idx] = dateStr;
                    return { ...t, exclusions: updatedExclusions };
                }
                return t;
            })
        );
    };

    const addExclusionDate = (termId) => {
        setTerms((prev) =>
            prev.map((t) =>
                t.id === termId ? { ...t, exclusions: [...t.exclusions, ""] } : t
            )
        );
    };

    const removeExclusionDate = (termId, idx) => {
        setTerms((prev) =>
            prev.map((t) =>
                t.id === termId
                    ? { ...t, exclusions: t.exclusions.filter((_, i) => i !== idx) }
                    : t
            )
        );
    };

    const filterSessionDay = (date, term) => {
        if (!selectedDay) return false;

        const dayMap = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
        };
        const dayOk = date.getDay() === dayMap[selectedDay];

        const dateStr = date.toLocaleDateString("en-CA");
        // disable if in exclusions
        const notExcluded = !term.exclusions.includes(dateStr);

        return dayOk && notExcluded;
    };

    const filterExclusionDay = (date, term) => {
        if (!selectedDay) return false;

        const dayMap = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
        };

        const dayOk = date.getDay() === dayMap[selectedDay];
        const dateStr = date.toLocaleDateString("en-CA");

        // must be within start/end
        const withinTerm =
            term.startDate && term.endDate
                ? dateStr >= term.startDate && dateStr <= term.endDate
                : false;

        // cannot select session dates
        const notSession = !term.sessionsMap.map((s) => s.sessionDate).includes(dateStr);

        return dayOk && withinTerm && notSession;
    };
    // console.log('myGroupData', myGroupData)
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

        if (!willDelete.isConfirmed) return;

        // Check if term is saved (has real backend ID)
        const isSaved = savedTermIds.has(id);

        if (!isSaved) {
            // Just remove it locally
            setTerms(prev => prev.filter(term => term.id !== id));
            setSessionMappings([]);
            Swal.fire("Deleted!", "The unsaved term was removed.", "success");
            return;
        }

        // Otherwise delete from backend
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/term/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                Swal.fire("Deleted!", "The term was deleted successfully.", "success");

                // 🔹 Update terms locally
                setTerms(prev => prev.filter(term => term.id !== id));

                // 🔹 Update session mappings (remove sessions of that term)
                setSessionMappings(prev =>
                    prev.filter(mapping => mapping.termId !== id)
                );

                // 🔹 Update saved term IDs set
                setSavedTermIds(prev => {
                    const updated = new Set(prev);
                    updated.delete(id);
                    return updated;
                });

                // 🔹 If you still want to refresh backend data
                if (myGroupData) {
                    fetchTermGroupById(myGroupData.id);
                } else {
                    navigate('/configuration/weekly-classes/term-dates/list');
                }

                fetchTerm();
            } else {
                const errorData = await response.json();
                Swal.fire("Failed", errorData.message || "Failed to delete the term.", "error");
            }
        } catch (err) {
            console.error("Failed to delete term:", err);
            Swal.fire("Error", "Something went wrong. Please try again.", "error");
        }
    }, [token, savedTermIds, fetchTerm, myGroupData, fetchTermGroupById, navigate]);





    const handleMappingChange = (index, field, value) => {
        // console.log('index', field, value)
        const updated = [...sessionMappings];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setSessionMappings(updated);
    };



    const handleSaveMappings = () => {
        if (!sessionMappings.length) {
            Swal.fire({
                icon: 'warning',
                title: 'No Session Mappings',
                text: 'Please add at least one session mapping',
                confirmButtonColor: '#e03a10',
            });
            return;
        }

        const isValid = sessionMappings.every(mapping => mapping.sessionDate && mapping.sessionPlanId);

        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Mappings',
                text: 'Please fill all session mappings completely',
                confirmButtonColor: '#e03a10',
            });
            return;
        }

        // Save mappings exactly as added
        setSessionsMap(sessionMappings);
        console.log('sessionMappings', sessionMappings)

        setIsMapping(false);

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Session mappings saved successfully',
            confirmButtonColor: '#3085d6',
        });
    };


    const handleSaveTerm = async (term) => {
        console.log('selectedTermGroup', selectedTermGroup)
        console.log('myGroupData', myGroupData)
        if (!myGroupData?.id && !selectedTermGroup) {
            console.error("Missing termGroupId");
            return;
        }

        // console.log("OK"); // Either one exists




        console.log('Term to save:', term);
        console.log('sessionMappings:', termData);

        // Validate required fields
        if (!term.name || !term.startDate || !term.endDate) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Please fill all required fields for the term',
                confirmButtonColor: '#d33'
            });
            return;
        }

        // Validate session mappings
        if (
            sessionMappings.length === 0 ||
            sessionMappings.some(mapping => !mapping.sessionPlanId)
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Session Mapping Required',
                text: 'Please map all sessions before saving the term',
                confirmButtonColor: '#d33'
            });
            return;
        }
        // console.log('selectedTermGroup', selectedTermGroup?.id)
        // Prepare the payload
        const payload = {
            termName: term.name,
            day: term.day,
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

console.log('isExistingTerm',isExistingTerm)
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

           await fetchTerm();
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


        setSessionMappings([]);
        const newTerm = {
            id: Date.now(),
            name: '',
            startDate: '',
            endDate: '',
            exclusions: [''],
            sessions: '',
            isOpen: true,
            sessionsMap: []
        };
        setTerms(prev => [
            ...prev.map(term => ({ ...term, isOpen: false })),
            newTerm
        ]);
        setIsMapping(false);


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
        setIsEditMode(false);
        setSavedTermIds(null);
        setMyGroupData(null)
        // Success - navigate away or show success message
        Swal.fire({
            icon: 'success',
            title: 'All Terms Saved',
            text: 'Your term group has been saved successfully',
            confirmButtonColor: '#3085d6'
        }).then(() => {
            navigate('/configuration/weekly-classes/term-dates/list');
        });
    };
    // console.log('terms', terms)
    // console.log('savedTermIds', savedTermIds)

    // const isSaveDisabled = !terms.length || terms.some(t => !savedTermIds.has(t.id));

    // console.log('selectedTermGroup', selectedTermGroup)
    // console.log("myGroupData", myGroupData)
    const parseLocalDate = (dateStr) => {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day); // <-- local date, no timezone shift
    };

    if (loading) return <Loader />;
    console.log('selectedDay', selectedDay)
    console.log('terms', terms)
    return (
        <div className="md:p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3 w-full md:w-1/2">
                <h2
                    ref={mapSectionRef}
                    onClick={() => {
                        navigate('/configuration/weekly-classes/term-dates/list');
                        setIsEditMode(false);
                        // setSavedTermIds(null);
                        setMyGroupData(null)
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
                    <h3 className="font-semibold  mb-4 text-[24px]"> <b>Step 1: </b>Add term Dates </h3>
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
                                                <div className="md:flex items-center justify-between">
                                                    <Select
                                                        value={termOptions.find(option => option.value === term.name)}
                                                        onChange={(selectedOption) =>
                                                            handleInputChange(term.id, "name", selectedOption.value)
                                                        }
                                                        options={termOptions}
                                                        placeholder="Select Term"
                                                        className="md:w-1/2 mb-5 mx-2 mt-2 font-semibold text-base"
                                                        classNamePrefix="react-select"
                                                        styles={{
                                                            control: (base, state) => ({
                                                                ...base,
                                                                borderColor: state.isFocused ? "#ccc" : "#E5E7EB",
                                                                boxShadow: "none",
                                                                padding: "6px 8px",
                                                                minHeight: "48px",
                                                            }),
                                                            placeholder: (base) => ({ ...base, fontWeight: 600 }),
                                                            dropdownIndicator: (base) => ({ ...base, color: "#9CA3AF" }),
                                                            indicatorSeparator: () => ({ display: "none" }),
                                                        }}
                                                    />
                                                    <div className="md:w-1/2 mb-5 mx-2 mt-2">
                                                        <Select
                                                            options={options}
                                                            value={options.find(option => option.value === term.day) || null}
                                                            onChange={(selectedOption) => {
                                                                const newTerms = terms.map(t =>
                                                                    t.id === term.id ? { ...t, day: selectedOption?.value || "" } : t
                                                                );
                                                                setSelectedDay(selectedOption?.value)
                                                                setTerms(newTerms); // update state
                                                            }}
                                                            placeholder="Select a day"
                                                            className="rounded-lg px-0 py-0"
                                                            classNamePrefix="react-select"
                                                            isClearable={true}
                                                            styles={{
                                                                control: (base, state) => ({
                                                                    ...base,
                                                                    borderColor: state.isFocused ? "#ccc" : "#E5E7EB",
                                                                    boxShadow: "none",
                                                                    padding: "6px 8px",
                                                                    minHeight: "48px",
                                                                }),
                                                                placeholder: (base) => ({ ...base, fontWeight: 600 }),
                                                                dropdownIndicator: (base) => ({ ...base, color: "#9CA3AF" }),
                                                                indicatorSeparator: () => ({ display: "none" }),
                                                            }}
                                                        />

                                                    </div>
                                                </div>
                                                <div className="md:flex gap-4 px-2 mb-5 justify-between">
                                                    <div className="w-full">
                                                        <label className="block text-base font-semibold text-gray-700 mb-2">
                                                            Start Date
                                                        </label>
                                                        <DatePicker
    disabled={!term.day}
    placeholderText="Enter Start Date"
    selected={null}
    value={
        term.startDate
            ? new Date(term.startDate + "T00:00:00").toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "2-digit",
                  month: "short",
              }).replace(/(\w+)\s/, "$1, ") // Adds a comma after weekday
            : ""
    }
    onChange={(date) => handleSessionDate(term.id, date)}
    filterDate={(d) => filterSessionDay(d, term)}
    dayClassName={(date) => {
        const dateStr = date.toLocaleDateString("en-CA");
        if (term.sessionsMap.map((s) => s.sessionDate).includes(dateStr))
            return "selected-date";
        if (term.exclusions.includes(dateStr)) return "exclusion-date";
        return undefined;
    }}
    shouldCloseOnSelect={false}
    dateFormat="EEEE, dd MMM"
    className={`w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg ${
        term.day ? "bg-white" : "bg-gray-200 cursor-not-allowed"
    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
    withPortal
    minDate={new Date()} // 🔒 Disable all previous dates
/>

                                                        <ul>
                                                            {selectedDates.map((d) => (
                                                                <li key={d}>{d}</li>
                                                            ))}
                                                        </ul>




                                                    </div>
                                                    <div className="w-full">
                                                        <label className="block text-base font-semibold text-gray-700 mb-2">
                                                            End Date
                                                        </label>
                                                        <DatePicker

                                                            readOnly
                                                            placeholderText="End Date"
                                                            selected={term.endDate ? new Date(term.endDate + "T00:00:00") : null}
                                                            onChange={(date) => {
                                                                const localDate = date ? date.toLocaleDateString("en-CA") : "";
                                                                handleInputChange(term.id, "endDate", localDate);
                                                            }}
                                                            dateFormat="EEEE, dd MMM"
                                                            minDate={term.startDate ? new Date(term.startDate + "T00:00:00") : null}
                                                            className="w-full px-4 font-semibold text-base py-3 cursor-default border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                                                            withPortal // this renders the calendar in a portal, fixed on screen

                                                        />


                                                    </div>
                                                </div>

                                                <div className="md:flex gap-4 px-2 mb-5 justify-between">
                                                    <div className="w-full">
                                                        <label className="block text-base font-semibold text-gray-700 mb-2">
                                                            Exclusion Date(s)
                                                        </label>
                                                        {term.exclusions.map((ex, idx) => (
                                                            <div key={idx} className=" relative gap-2 mb-2 items-center">
                                                                <DatePicker
                                                                    placeholderText={`Exclusion Date ${idx + 1}`}
                                                                    selected={ex ? new Date(ex + "T00:00:00") : null}
                                                                    onChange={(date) =>
                                                                        handleExclusionChange(
                                                                            term.id,
                                                                            idx,
                                                                            date ? date.toLocaleDateString("en-CA") : ""
                                                                        )
                                                                    }
                                                                    dateFormat="EEEE, dd MMM"
                                                                    filterDate={(d) => filterExclusionDay(d, term)}
                                                                    withPortal
                                                                    className="w-full px-4 font-semibold text-base py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    dayClassName={(date) => {
                                                                        const dateStr = date.toLocaleDateString("en-CA");
                                                                        if (term.exclusions.includes(dateStr)) return "exclusion-date";
                                                                        if (term.sessionsMap.map((s) => s.sessionDate).includes(dateStr))
                                                                            return "selected-date";
                                                                        return undefined;
                                                                    }}
                                                                />
                                                                {term.exclusions.length > 1 && (
                                                                    <button
                                                                        onClick={() => removeExclusionDate(term.id, idx)}
                                                                        type="button"
                                                                        className="text-red-500 absolute top-[10px] right-[15px] hover:text-red-700 font-bold text-xl"
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
                                                            value={term.sessionsMap.length}
                                                            readOnly
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
                                                            className={`flex whitespace-nowrap px-2 md:w-5/12 w-full items-center justify-center gap-1 border ${term.isSubmitted ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed' : 'border-blue-500 text-[#237FEA] hover:bg-blue-50'
                                                                } px-6 py-2 rounded-lg text-[14px] font-semibold`}
                                                            onClick={() => !term.isSubmitted && handleMapSession(term.id)}
                                                            disabled={term.isSubmitted}
                                                        >
                                                            Map Session
                                                        </button>

                                                        <button
                                                            className="bg-[#237FEA] whitespace-nowrap text-white text-[14px] md:w-7/12 w-full font-semibold px-6 py-3 rounded-lg hover:bg-blue-700"
                                                            onClick={() => {
                                                                const activeTerm = terms.find(t => t.isOpen);
                                                                if (activeTerm) handleSaveTerm(activeTerm);
                                                            }}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading
                                                                ? 'Saving...'
                                                                : (() => {
                                                                    const activeTerm = terms.find(t => t.isOpen);
                                                                    return activeTerm && savedTermIds?.has(activeTerm.id)
                                                                        ? 'Update Term'
                                                                        : 'Save Term';
                                                                })()}

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
                                    className={`min-w-40 font-semibold px-6 py-3 rounded-lg text-[14px] w-full md:w-auto 
        ${!isGroupSaved ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#237FEA] hover:bg-blue-700 text-white'}`}
                                    onClick={handleSaveAll}
                                    disabled={!isGroupSaved || isLoading}
                                >
                                    {'Save All'}
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
                                    {Array.from({ length: activeTerm?.sessionsMap?.length || 0 }).map((_, index) => (
                                        <div key={index} className="md:flex w-full items-start gap-4 justify-between mb-4">
                                            <div className="w-1/2">
                                                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-2xl px-4 py-3 mb-4 shadow-sm">
                                                    <span className="font-semibold text-base text-black whitespace-nowrap">
                                                        Session {index + 1}
                                                    </span>
                                                    <DatePicker
                                                        readOnly
                                                        selected={
                                                            sessionMappings[index]?.sessionDate
                                                                ? new Date(sessionMappings[index].sessionDate + "T00:00:00")
                                                                : null
                                                        }
                                                        onChange={(date) =>
                                                            handleMappingChange(
                                                                index,
                                                                "sessionDate",
                                                                date ? date.toLocaleDateString("en-CA") : ""
                                                            )
                                                        }
                                                        dateFormat="EEEE, dd MMM"
                                                        placeholderText="Select date"
                                                        withPortal
                                                        minDate={
                                                            activeTerm?.startDate
                                                                ? new Date(activeTerm.startDate + "T00:00:00")
                                                                : null
                                                        }
                                                        maxDate={
                                                            activeTerm?.endDate
                                                                ? new Date(activeTerm.endDate + "T00:00:00")
                                                                : null
                                                        }
                                                        excludeDates={
                                                            activeTerm?.exclusions?.length
                                                                ? activeTerm.exclusions.map(
                                                                    (ex) => new Date(ex + "T00:00:00")
                                                                )
                                                                : []
                                                        }
                                                        className="text-[#717073] text-[15px] font-semibold bg-transparent focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-1/2">
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
                                                className="bg-[#237FEA] whitespace-nowrap text-white text-base w-6/12 font-semibold px-6 py-3 rounded-lg hover:bg-blue-700"
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