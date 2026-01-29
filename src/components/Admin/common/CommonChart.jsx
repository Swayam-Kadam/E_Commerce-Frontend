
import {  useState } from "react";
import ReactApexChart from "react-apexcharts";
import "./commonchart.css"

const CommonChart = ({
  title,
  options,
  series,
  className = "",
  subCategory,
  onSubCategoryClick,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);


  const updatedOptions = {
    ...options,
    chart: {
      ...options?.chart,
      toolbar: {
        
        tools: {
          
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
    },
  };

  const handleSubCategoryClick = (index) => {
    setSelectedIndex(index);
    if (onSubCategoryClick) {
      onSubCategoryClick(index);
    }
  };

  return (
    <div className={`common-chart-container ${className}`}>
      <div className="chart-data">
        <div className="chart-data-header">
          <h3>{title}</h3>
          {subCategory && subCategory.length > 0 && (
            <div className="chart-data-subcategory">
              {subCategory.map((item, index) => (
                <p
                  key={index}
                  onClick={() => handleSubCategoryClick(index)}
                  className={`subcategory-item ${
                    index === selectedIndex ? "active-subcategory" : ""
                  }`}
                >
                  {item}
                </p>
              ))}
            </div>
          )}
        </div>
        <ReactApexChart
          options={updatedOptions}
          series={series}
          type={options?.chart?.type || 'line'}
          height={options?.chart?.height || 350}
        />
      </div>
    </div>
  );
};

export default CommonChart;