import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from './component/Chart';
import Card from './pages/Card';
import PageLoader from '@/components/common/PageLoader';
import { getDashboard } from './slice';

const AdminPage = () => {
  const dispatch = useDispatch();
  const { dashboardLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);

  if (dashboardLoading) {
    return <PageLoader loadingState />;
  }

  return (
    <div className="mx-auto min-h-screen max-w-[100rem]">
      <Card />
      <Chart />
    </div>
  );
};

export default AdminPage;
