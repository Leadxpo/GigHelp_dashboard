import React from 'react'
import PageHeader from "../layout/PageHeader";
import BrandList from "../components/Users/BrandList";

function brands() {
  return (
    <div>
          <PageHeader title="Users List" />
          <BrandList/>
    </div>
  )
}

export default brands
