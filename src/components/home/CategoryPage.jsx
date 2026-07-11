import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { image: '/images/png/fashion.png', tint: 'from-rose-100 to-rose-50', name: 'Fashion' },
  { image: '/images/png/electronics.png', tint: 'from-sky-100 to-sky-50', name: 'Electronics' },
  { image: '/images/png/footwear.png', tint: 'from-amber-100 to-amber-50', name: 'Footwear' },
  { image: '/images/png/groceries.png', tint: 'from-emerald-100 to-emerald-50', name: 'Groceries' },
  { image: '/images/png/bags.png', tint: 'from-cyan-100 to-cyan-50', name: 'Bags' },
  { image: '/images/png/beauty.png', tint: 'from-fuchsia-100 to-fuchsia-50', name: 'Beauty' },
];

const CategoryPage = () => {
  return (
    <section id="categories" className="relative overflow-hidden bg-[linear-gradient(180deg,#eef5fb_0%,#ffffff_100%)] py-14 md:py-20">
      <div className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-[#0289de]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0289de]">
            Shop by category
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Featured Categories
          </h2>
          <p className="mt-2 text-base text-slate-500">
            Jump into the collections shoppers love most.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:grid-cols-6">
          {categories.map((category, index) => (
            <motion.button
              key={category.name}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className="group flex flex-col items-center text-center"
            >
              <div
                className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${category.tint} shadow-[0_10px_30px_-12px_rgba(2,137,222,0.45)] transition duration-300 group-hover:shadow-[0_16px_36px_-12px_rgba(2,137,222,0.55)] md:h-24 md:w-24`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white md:h-14 md:w-14">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-7 w-7 object-contain transition duration-300 group-hover:scale-110 md:h-9 md:w-9"
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-700 transition group-hover:text-[#0289de] sm:text-sm md:text-base">
                {category.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryPage;
