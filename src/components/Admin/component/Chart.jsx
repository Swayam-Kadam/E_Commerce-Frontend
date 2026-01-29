import React, { useState } from 'react';
import CommonChart from '../common/CommonChart';

const Chart = () => {
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [chartType, setChartType] = useState('monthly'); // For second chart
   const [lineChartType, setLineChartType] = useState('monthly'); // For line chart


  // Bar Chart Data
  const barChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: timePeriod === 'monthly' 
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] 
        : ['Q1', 'Q2', 'Q3', 'Q4']
    },
    yaxis: {
      title: {
        text: "Count",
      },
    },
    stroke: {
      curve: 'smooth'
    },
    colors: ['#008FFB']
  };

  const barChartSeries = [{
    name: 'Sales',
    data: timePeriod === 'monthly' 
      ? [30, 40, 35, 50, 49, 60, 45, 65, 20, 33, 55, 25] 
      : [120, 150, 180, 200]
  }];

  // Pie Chart Data
  const pieChartOptions = {
    chart: {
      type: 'pie',
      height: 350,
      toolbar: {
        show: true
      }
    },
    labels: chartType === 'monthly' 
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Q1', 'Q2', 'Q3', 'Q4'],
    colors: [
      '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0',
      '#546E7A', '#26a69a', '#D10CE8', '#FF9F43', '#4ECDC4',
      '#00A8FF', '#9C27B0'
    ],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      }
    }
  };

  const pieChartSeries = chartType === 'monthly' 
    ? [30, 40, 35, 50, 49, 60, 45, 65, 20, 33, 55, 25]
    : [120, 150, 180, 200];


    // Line Chart Data
  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true
      }
    },
    xaxis: {
      categories: lineChartType === 'monthly' 
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] 
        : ['Q1', 'Q2', 'Q3', 'Q4']
    },
    yaxis: {
      title: {
        text: "Revenue ($)",
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 5,
    },
    colors: ['#00E396', '#FF4560'],
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    }
  };

  const lineChartSeries = lineChartType === 'monthly' 
    ? [
        {
          name: 'Revenue',
          data: [4500, 5200, 4800, 6100, 5800, 7200, 6800, 7900, 7500, 8200, 7800, 9000]
        },
        {
          name: 'Profit',
          data: [2200, 2800, 2500, 3200, 3000, 3800, 3500, 4200, 4000, 4500, 4200, 4800]
        }
      ]
    : [
        {
          name: 'Revenue',
          data: [14500, 16800, 23200, 25000]
        },
        {
          name: 'Profit',
          data: [7500, 10300, 11700, 13500]
        }
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
    <div className='p-5'>
      {/* First Chart - Bar Chart */}
      <CommonChart
        title="Sales Performance - Bar Chart"
        options={barChartOptions}
        series={barChartSeries}
        subCategory={['Monthly', 'Quarterly']}
        onSubCategoryClick={handleTimePeriodClick}
        className="mt-5"
      />

    <div className='block lg:flex justify-between gap-5'>
      {/* Second Chart - Pie Chart */}
       {/* Line Chart */}
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