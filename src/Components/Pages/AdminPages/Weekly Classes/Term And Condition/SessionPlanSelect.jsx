// SessionPlanSelect.js

import React, { useState } from 'react';
import Select from 'react-select';
import { Search } from 'lucide-react';

const options = [
  { value: 'pele-week-01', label: 'Pelé – Week 01' },
  { value: 'pele-week-02', label: 'Pelé – Week 02' },
  { value: 'pele-week-03', label: 'Pelé – Week 03' },
  { value: 'pele-week-04', label: 'Pelé – Week 04' },
];

const customStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: '12px',
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

const SessionPlanSelect = ({ idx = 0, value = '', onChange }) => {
  const [selectedOption, setSelectedOption] = useState(
    options.find((opt) => opt.label === value) || null
  );

  const handleChange = (option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(idx, 'plan', option?.label || '');
    }
  };

  return (
    <div className="relative w-full mb-5">
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
