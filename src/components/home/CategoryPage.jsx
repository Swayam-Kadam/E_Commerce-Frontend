import React from 'react';

const CategoryPage = () => {
  const categories = [
    { image: "/images/png/fashion.png", bg: "bg-pink-100", name: "Fashion" },
    { image: "/images/png/electronics.png", bg: "bg-blue-100", name: "Electronics" },
    { image: "/images/png/footwear.png", bg: "bg-amber-100", name: "Footwear" },
    { image: "/images/png/groceries.png", bg: "bg-emerald-100", name: "Groceries" },
    { image: "/images/png/bags.png", bg: "bg-purple-100", name: "Bags" },
    { image: "/images/png/beauty.png", bg: "bg-rose-100", name: "Beauty" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-1">
      <h2 className="text-xl font-semibold text-left mb-10 text-gray-800">Featured Categories</h2>
      
      <div className="grid grid-cols-6 gap-4 md:gap-6">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center group cursor-pointer"
          >
            <div 
              className={`w-10 h-10 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 ${category.bg}`}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-sm">
                <img src={category.image} alt={category.name} className="w-8 h-8 object-contain" />
              </div>
            </div>
            <span className="hidden sm:block text-sm md:text-base font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;