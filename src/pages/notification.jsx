import React from 'react'
import PageHeader from "../layout/PageHeader";
import NotificationList from "../components/Notifications/mainNotification";

function categories() {
  return (
    <div>
          <PageHeader title="Notification List" />
          <NotificationList/>
    </div>
  )
}

export default categories
