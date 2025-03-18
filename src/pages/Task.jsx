import React from 'react'
import PageHeader from "../layout/PageHeader";
import ProductList from "../components/Products/ProductList";

function Products() {
  return (
    <div>
          <PageHeader title="Tasks" />
          <ProductList/>
    </div>
  )
}

export default Products
