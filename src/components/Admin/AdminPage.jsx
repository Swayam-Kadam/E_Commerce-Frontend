import React from 'react'
import Chart from './component/Chart'
import Sample from './common/Sample'
import Card from './pages/Card'

const AdminPage = () => {
  return (
    <div className='min-h-screen max-w-[100rem]  mx-auto'>
        <Card/>
        <Chart/>
        {/* <Sample/> */}
    </div>
  )
}

export default AdminPage