import React from 'react';
import { useSelector } from 'react-redux';
import CommonCard from '../common/CommonCard';
import { FiUsers, FiDollarSign, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';

const formatGrowth = (rate) => {
  const value = Number(rate) || 0;
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
};

const Card = () => {
  const { stats } = useSelector((state) => state.admin.dashboard);

  return (
    <div className="grid grid-cols-1 justify-items-center gap-6 p-5 sm:grid-cols-2 xl:grid-cols-4">
      <CommonCard
        cardName="Total User"
        count={stats?.totalUsers ?? 0}
        icon={<FiUsers />}
        backgroundColor="bg-blue-50"
        borderColor="border-l-blue-500"
        iconBackground="bg-blue-100"
        iconColor="text-blue-600"
        className="transform hover:scale-105"
      />
      <CommonCard
        cardName="Revenue"
        count={`$${(stats?.totalRevenue ?? 0).toLocaleString()}`}
        icon={<FiDollarSign />}
        backgroundColor="bg-green-50"
        borderColor="border-l-green-500"
        iconBackground="bg-green-100"
        iconColor="text-green-600"
        className="transform hover:scale-105"
      />
      <CommonCard
        cardName="Total Orders"
        count={stats?.totalOrders ?? 0}
        icon={<FiShoppingCart />}
        backgroundColor="bg-purple-50"
        borderColor="border-l-purple-500"
        iconBackground="bg-purple-100"
        iconColor="text-purple-600"
        className="transform hover:scale-105"
      />
      <CommonCard
        cardName="Growth Rate"
        count={formatGrowth(stats?.growthRate)}
        icon={<FiTrendingUp />}
        backgroundColor="bg-orange-50"
        borderColor="border-l-orange-500"
        iconBackground="bg-orange-100"
        iconColor="text-orange-600"
        className="transform hover:scale-105"
      />
    </div>
  );
};

export default Card;
