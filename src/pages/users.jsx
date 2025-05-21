import React from 'react'
import PageHeader from "../layout/PageHeader";
import UserList from "../components/Users/UsersList";

function users() {
  return (
    <div>
          <PageHeader title="Users List" />
          <UserList/>
    </div>
  )
}

export default users;
