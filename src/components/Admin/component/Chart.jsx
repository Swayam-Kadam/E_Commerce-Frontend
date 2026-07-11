import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CommonChart from '../common/CommonChart';

const Chart = () => {
  const { charts } = useSelector((state) => state.admin.dashboard);
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [chartType, setChartType] = useState('monthly');
  const [lineChartType, setLineChartType] = useState('monthly');

  const monthly = charts?.monthly || { labels: [], sales: [], revenue: [], profit: [] };
  const quarterly = charts?.quarterly || { labels: [], sales: [], revenue: [], profit: [] };

  const getPeriod = (type) => (type === 'monthly' ? monthly : quarterly);

  const salesPeriod = getPeriod(timePeriod);
  const piePeriod = getPeriod(chartType);
  const linePeriod = getPeriod(lineChartType);

  const barChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true,
      },
    },
    xaxis: {
      categories: salesPeriod.labels?.length
        ? salesPeriod.labels
        : timePeriod === 'monthly'
          ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          : ['Q1', 'Q2', 'Q3', 'Q4'],
    },
    yaxis: {
      title: {
        text: 'Orders',
      },
    },
    stroke: {
      curve: 'smooth',
    },
    colors: ['#008FFB'],
  };

  const barChartSeries = [
    {
      name: 'Orders',
      data: salesPeriod.sales?.length
        ? salesPeriod.sales
        : timePeriod === 'monthly'
          ? Array(12).fill(0)
          : Array(4).fill(0),
    },
  ];

  const pieChartOptions = {
    chart: {
      type: 'pie',
      height: 350,
      toolbar: {
        show: true,
      },
    },
    labels: piePeriod.labels?.length
      ? piePeriod.labels
      : chartType === 'monthly'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : ['Q1', 'Q2', 'Q3', 'Q4'],
    colors: [
      '#008FFB',
      '#00E396',
      '#FEB019',
      '#FF4560',
      '#775DD0',
      '#546E7A',
      '#26a69a',
      '#D10CE8',
      '#FF9F43',
      '#4ECDC4',
      '#00A8FF',
      '#9C27B0',
    ],
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + '%';
      },
    },
  };

  const pieChartSeries = piePeriod.sales?.length
    ? piePeriod.sales
    : chartType === 'monthly'
      ? Array(12).fill(0)
      : Array(4).fill(0);

  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true,
      },
    },
    xaxis: {
      categories: linePeriod.labels?.length
        ? linePeriod.labels
        : lineChartType === 'monthly'
          ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          : ['Q1', 'Q2', 'Q3', 'Q4'],
    },
    yaxis: {
      title: {
        text: 'Revenue ($)',
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 5,
    },
    colors: ['#00E396', '#FF4560'],
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5,
      },
    },
  };

  const lineChartSeries = [
    {
      name: 'Revenue',
      data: linePeriod.revenue?.length
        ? linePeriod.revenue
        : lineChartType === 'monthly'
          ? Array(12).fill(0)
          : Array(4).fill(0),
    },
    {
      name: 'Profit',
      data: linePeriod.profit?.length
        ? linePeriod.profit
        : lineChartType === 'monthly'
          ? Array(12).fill(0)
          : Array(4).fill(0),
    },
  ];

  const handleTimePeriodClick = (index) => {
    const periods = ['monthly', 'quarterly'];
    setTimePeriod(periods[index]);
  };

  const handleChartTypeClick = (index) => {
    const types = ['monthly', 'quarterly'];
    setChartType(types[index]);
  };

  const handleLineChartTypeClick = (index) => {
    const types = ['monthly', 'quarterly'];
    setLineChartType(types[index]);
  };

  return (
    <div className="p-5">
      <CommonChart
        title="Sales Performance - Bar Chart"
        options={barChartOptions}
        series={barChartSeries}
        subCategory={['Monthly', 'Quarterly']}
        onSubCategoryClick={handleTimePeriodClick}
        className="mt-5"
      />

      <div className="block justify-between gap-5 lg:flex">
        <CommonChart
          title="Revenue & Profit Trend - Line Chart"
          options={lineChartOptions}
          series={lineChartSeries}
          subCategory={['Monthly', 'Quarterly']}
          onSubCategoryClick={handleLineChartTypeClick}
          className="mt-8 w-full"
        />

        <CommonChart
          title="Sales Distribution - Pie Chart"
          options={pieChartOptions}
          series={pieChartSeries}
          subCategory={['Monthly', 'Quarterly']}
          onSubCategoryClick={handleChartTypeClick}
          className="mt-5 w-full"
        />
      </div>
    </div>
  );
};

export default Chart;
