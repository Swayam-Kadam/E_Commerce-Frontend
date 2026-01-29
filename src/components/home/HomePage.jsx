import React from 'react'
import FloatOffer from '../common/FloatOffer'
import RunningOffer from '../common/RunningOffer'
import SwipperSlider from './SwiperSlider'
import CategoryPage from './CategoryPage'
import ProductPage from './ProductPage'
import MarketingPage from './MarketingPage'

const HomePage = () => {
  return (
    <div className='min-h-screen'>
      <RunningOffer/>
      <SwipperSlider/>
      <CategoryPage/>
      <ProductPage/>
      <MarketingPage/>
      <FloatOffer/>
      </div>
  )
}

export default HomePage