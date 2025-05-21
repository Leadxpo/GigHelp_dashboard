import React from 'react'
import PageHeader from "../layout/PageHeader";
import Dispute from "../components/Disputes/MainComp";

function dispute() {
  return (
    <div>
          <PageHeader title="Disputes List" />
          <Dispute/>
    </div>
  )
}

export default dispute
