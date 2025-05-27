import React from 'react'
import PageHeader from "../layout/PageHeader";
import UserList from "../components/SystemUser/MainSystemUserList";

function users() {
  return (
    <div>
          <PageHeader title=" System Users " />
          <UserList/>
    </div>
  )
}

export default users;
