import React from 'react'
import { FiUsers } from "react-icons/fi";

const CommonCard = ({cardName,count,iconBackground,iconColor,icon,borderColor,backgroundColor,textColor,className}) => {
 return (
    <div className={`flex gap-5 w-[20rem] cursor-pointer items-center justify-between p-6 rounded-lg border border-gray-200 ${borderColor} border-l-4 ${backgroundColor} ${textColor} shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      {/* Content Section */}
      <div className='flex flex-col'>
        <p className='text-sm font-medium text-gray-600 mb-1'>{cardName}</p>
        <h1 className='font-bold text-3xl'>{count}</h1>
      </div>
      
      {/* Icon Section */}
      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${iconBackground} ${iconColor}`}>
        <div className='text-xl'>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default CommonCard