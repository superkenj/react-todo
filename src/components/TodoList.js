import TodoShow from "./TodoShow"
import { useLanguage } from "../context/LanguageContext"

const TodoList = ({ todos, removeTodo, changeTodo, archiveTodo, sortBy, selectedTodos, onSelectTodo }) => {
  const { t } = useLanguage() // We'll use 't' for translations when needed
  const sortTodos = (todos, sortBy) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 }

    return [...todos].sort((a, b) => {
      // When sorting by "Completed" → Completed tasks go to the top
      if (sortBy === "completed") {
        if (a.completed !== b.completed) {
          return a.completed ? -1 : 1 // Completed first
        }
        return new Date(a.dueDate) - new Date(b.dueDate)
      }

      // For other sorting options → Completed tasks go to the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1 // Completed at the bottom
      }

      // Sorting logic for other options
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

  // ✅ Use the sortBy prop passed from App.js
  const sortedTodos = sortTodos(todos, sortBy)

  const renderedTodos = sortedTodos.map((todo) => (
    <TodoShow
      key={todo.id}
      todo={todo}
      removeTodo={removeTodo}
      changeTodo={changeTodo}
      archiveTodo={archiveTodo}
      isSelected={selectedTodos.includes(todo.id)}
      onSelectTodo={onSelectTodo}
    />
  ))

  return (
    <div>
      {todos.length === 0 ? (
        <div className="no-todos">{t("no_tasks")}</div>
      ) : (
        <ul className="todo-list">{renderedTodos}</ul>
      )}
    </div>
  )
}

export default TodoList
