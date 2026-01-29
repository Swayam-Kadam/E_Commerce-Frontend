import React from 'react'
import CommonCard from '../common/CommonCard'
import { FiUsers, FiDollarSign, FiShoppingCart, FiTrendingUp } from "react-icons/fi";

const Card = () => {
  return (
    <div className='p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center'>
        <CommonCard
            cardName="Total User"
            count={450}
            icon={<FiUsers/>}
            backgroundColor="bg-blue-50"
            borderColor="border-l-blue-500"
            iconBackground="bg-blue-100"
            iconColor="text-blue-600"
            className="transform hover:scale-105"
        />
        <CommonCard
            cardName="Revenue"
            count={`$${45000}`}
            icon={<FiDollarSign/>}
            backgroundColor="bg-green-50"
            borderColor="border-l-green-500"
            iconBackground="bg-green-100"
            iconColor="text-green-600"
            className="transform hover:scale-105"
        />
        <CommonCard
            cardName="Total Orders"
            count={1200}
            icon={<FiShoppingCart />}
            backgroundColor="bg-purple-50"
            borderColor="border-l-purple-500"
            iconBackground="bg-purple-100"
            iconColor="text-purple-600"
            className="transform hover:scale-105"
        />
        <CommonCard
            cardName="Growth Rate"
            count="+15.2%"
            icon={<FiTrendingUp />}
            backgroundColor="bg-orange-50"
            borderColor="border-l-orange-500"
            iconBackground="bg-orange-100"
            iconColor="text-orange-600"
            className="transform hover:scale-105"
        />
    </div>
  )
}

export default Card