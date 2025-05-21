import React from 'react'
import PageHeader from "../layout/PageHeader";
import HomeList from "../components/Home/Home";

function Home() {
  return (
    <div>
          <PageHeader title="Hi Super Admin" />
          <HomeList/>
    </div>
  )
}

export default Home
