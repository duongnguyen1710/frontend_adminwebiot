import { Grid } from '@mui/material'
import React from 'react'
import CategoryParentTable from './CategoryParentTable'
import CategoryChildrenTable from './CategoryChildrenTable'
import CategoryParent from './CategoryParent'

const CategoryTest = () => {
  return (
    <div className='px-2'>
      {/* <CategoryParent/> */}
            <CategoryParentTable/> 
          <CategoryChildrenTable/>
       
    

    
    </div>
  )
}

export default CategoryTest
