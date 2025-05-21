import React from 'react';
import PageHeader from "../layout/PageHeader";
import SubCategoryList from "../components/Categories/SubCategory/SubCategoryList";

function SubCategories() {
  return (
    <div>
      <PageHeader title="SubCategories List" />
      <SubCategoryList />
    </div>
  );
}

export default SubCategories;
