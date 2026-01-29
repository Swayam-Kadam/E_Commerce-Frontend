import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SwipperSlider = () => {
  // Sample images - replace with your own image URLs
  const images = [
    "/images/HomeSlide/slide1.webp",
    "/images/HomeSlide/slide2.webp",
    "/images/HomeSlide/slide3.webp",
    "/images/HomeSlide/slide4.jpg"
  ];

  return (
    <div className="max-w-7xl mx-auto my-10 rounded-xl overflow-hidden shadow-xl">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="h-64 md:h-[35rem]"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img 
                src={image} 
                alt={`Slide ${index + 1}`} 
                className="w-full h-full"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwipperSlider;