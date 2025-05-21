import React from 'react'
import PageHeader from "../layout/PageHeader";
import CategoryList from "../components/Categories/MainCategory/MainCategoryList";

function categories() {
  return (
    <div>
          <PageHeader title="Categories List" />
          <CategoryList/>
    </div>
  )
}

export default categories
