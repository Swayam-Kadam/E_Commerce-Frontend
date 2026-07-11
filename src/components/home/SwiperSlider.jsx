import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    image: '/images/HomeSlide/slide1.webp',
    headline: 'Curated finds for every day',
    support: 'Fresh drops, trusted quality, and delivery that keeps up with you.',
  },
  {
    image: '/images/HomeSlide/slide2.webp',
    headline: 'Style that moves with you',
    support: 'From wardrobe staples to weekend essentials - shop the edit.',
  },
  {
    image: '/images/HomeSlide/slide3.webp',
    headline: 'Tech & home, made simple',
    support: 'Smart picks at fair prices, ready when you are.',
  },
  {
    image: '/images/HomeSlide/slide4.jpg',
    headline: 'Beauty & bags you will love',
    support: 'Discover new favorites with exclusive member deals.',
  },
];

const SwipperSlider = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        loop
        className="home-hero-swiper h-[min(88vh,720px)] min-h-[420px] w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/45 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(2,137,222,0.28),transparent_55%)]" />

              <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 sm:px-8 lg:px-10">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-xl"
                >
                  <p className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                    SwiftCart
                  </p>
                  <h1 className="mt-4 max-w-lg font-display text-2xl font-semibold leading-tight text-white/95 sm:text-3xl md:text-4xl">
                    {slide.headline}
                  </h1>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
                    {slide.support}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      to="/#featured-products"
                      className="inline-flex items-center justify-center bg-[#0289de] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0169ab]"
                    >
                      Shop Now
                    </Link>
                    <Link
                      to="/#categories"
                      className="inline-flex items-center justify-center border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                    >
                      Browse Categories
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SwipperSlider;
