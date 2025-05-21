import React from 'react'
import PageHeader from "../layout/PageHeader";
import TaskList from "../components/Tasks/TaskList";

function Tasks() {
  return (
    <div>
          <PageHeader title="Tasks" />
          <TaskList/>
    </div>
  )
}

export default Tasks
