"use client"
import DeleteIcon from "../delete.svg"

const ArchivedTodos = ({ archivedTodos, restoreTodo, deleteArchivedTodo, sortBy }) => {
  const formatDueDate = (dateTimeString) => {
    if (!dateTimeString) return "No due date"

    const date = new Date(dateTimeString)
    const formattedDate = date.toISOString().split("T")[0]
    let hours = date.getHours()
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12
    hours = hours ? hours : 12
    const minutes = date.getMinutes().toString().padStart(2, "0")

    return `${formattedDate} ${hours}:${minutes} ${ampm}`
  }

  const getPriorityStyle = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return { backgroundColor: "#ff4d4d", color: "#fff" }
      case "medium":
        return { backgroundColor: "#ffcc00", color: "#000" }
      case "low":
        return { backgroundColor: "#4caf50", color: "#fff" }
      default:
        return { backgroundColor: "#ccc", color: "#000" }
    }
  }

  const sortArchivedTodos = (todos, sortBy) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 }

    return [...todos].sort((a, b) => {
      if (sortBy === "priority") {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }

      if (sortBy === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }

      if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }

      if (sortBy === "category") {
        return a.category.localeCompare(b.category)
      }

      return 0
    })
  }

  const sortedArchivedTodos = sortArchivedTodos(archivedTodos, sortBy)

  return (
    <div className="archived-todos">
      <h2 className="archived-title">Archived Tasks</h2>

      {archivedTodos.length === 0 ? (
        <div className="no-archived">No archived tasks found.</div>
      ) : (
        <ul className="todo-list">
          {sortedArchivedTodos.map((todo) => (
            <li key={todo.id} className="todo archived-todo">
              <div className="task-details completed">
                <p>{todo.title}</p>
                <div className="todo-details-row">
                  <p className="priority-box" style={getPriorityStyle(todo.priority)}>
                    {todo.priority}
                  </p>
                  <p className="category">{todo.category}</p>
                </div>
                <p className="due-date">{formatDueDate(todo.dueDate)}</p>
              </div>
              <div className="actions">
                <button className="restore-btn" onClick={() => restoreTodo(todo.id)}>
                  🔄
                </button>
                <button className="delete-btn" onClick={() => deleteArchivedTodo(todo.id)}>
                  <img src={DeleteIcon || "/placeholder.svg"} alt="Delete" title="Delete" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ArchivedTodos
