// components/GenderSelector.jsx
import React, { useState } from 'react';
import '../styles/_font.scss';
import '../styles/index.css';

const GenderSelector = ({ onGenderChange }) => {
  const [activeGender, setActiveGender] = useState('male'); 

  const handleGenderClick = (gender) => {
    setActiveGender(gender);
    onGenderChange(gender); 
  };

  return (
    <div className="max-w-[90%] mx-auto flex justify-start items-start pt-15 bg-white">
      <button
        className={`px-6 py-3 w-[140px] cursor-pointer font-semibold rounded-full text-lg mr-4 transition-colors ${
          activeGender === 'male'
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-300 text-black hover:bg-gray-400'
        }`}
        onClick={() => handleGenderClick('male')}
      >
        ĐỒ NAM
      </button>
      <button
        className={`px-6 py-3 w-[140px] cursor-pointer font-semibold rounded-full text-lg transition-colors ${
          activeGender === 'female'
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-300 text-black hover:bg-gray-400'
        }`}
        onClick={() => handleGenderClick('female')}
      >
        ĐỒ NỮ
      </button>
    </div>
  );
};

export default GenderSelector;