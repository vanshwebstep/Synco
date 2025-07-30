// SessionPlanSelect.js

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Search } from 'lucide-react';
import { useTermContext } from '../../contexts/TermDatesSessionContext';
import { useSessionPlan } from '../../contexts/SessionPlanContext';



const ageMapping = {
  Beginner: "4-6 Years",
  Intermediate: "6-7 Years",
  Advanced: "8-9 Years",
  Pro: "10-12 Years",
};

const customStyles = {

  control: (base, state) => ({
    ...base,
    borderRadius: '1rem',
    borderColor: state.isFocused ? '#237FEA' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(35, 127, 234, 0.3)' : 'none',
    fontWeight: 600,
    fontSize: '15px',
    // paddingLeft: '36px',
    height: '50px',
    backgroundColor: '#fff',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#F2F2F2' : '#fff',
    color: '#000',
    fontWeight: 600,
    fontSize: '15px',
    paddingTop: '10px',
    paddingBottom: '10px',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '12px',
    marginTop: 2,
    overflow: 'hidden',
    zIndex: 20,
  }),
  placeholder: (base) => ({
    ...base,
    color: '#a1a1aa',
  }),
};

const SessionPlanSelect = ({ idx = 0, label = '', value, onChange }) => {
  const { fetchSessionGroup, sessionGroup } = useSessionPlan();
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const getPackages = async () => {
      try {
        const response = await fetchSessionGroup();
        console.log("Fetched packages:", response);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    getPackages();
  }, [fetchSessionGroup]);

  useEffect(() => {
    if (sessionGroup?.length > 0) {
      const transformedWeeks = sessionGroup.map((group) => ({
        value: group.id,
        label: group.groupName,
      }));
      setOptions(transformedWeeks);
    }
  }, [sessionGroup]);

  // Sync selected value when options or value change
  useEffect(() => {
    if (options.length > 0 && value) {
      const matched = options.find((opt) => opt.value === value);
      setSelectedOption(matched || null);
    }
  }, [value, options]);

  const handleChange = (option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(idx, 'sessionPlanId', option?.value || '');
    }
  };

  return (
    <div className="relative  w-full mb-5">
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder="Search Session Plan Group"
        styles={customStyles}
        isSearchable
      />
    </div>
  );
};

export default SessionPlanSelect;
