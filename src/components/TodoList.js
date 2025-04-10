"use client"

import TodoShow from "./TodoShow"
import { useLanguage } from "../context/LanguageContext"
import { useState, useRef, useEffect } from "react"

const TodoList = ({
  todos,
  removeTodo,
  changeTodo,
  archiveTodo,
  sortBy,
  selectedTodos,
  onSelectTodo,
  reorderTodos,
}) => {
  const { t } = useLanguage()
  const [draggedTodo, setDraggedTodo] = useState(null)
  const [dragOverTodoId, setDragOverTodoId] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showDropZones, setShowDropZones] = useState(false)
  const dragCounter = useRef(0)
  const listRef = useRef(null)

  // Show drop zones when dragging starts
  useEffect(() => {
    setShowDropZones(isDragging)
  }, [isDragging])

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

  // Handle drag start
  const handleDragStart = (e, todo) => {
    // Set the dragged todo
    setDraggedTodo(todo)
    setIsDragging(true)

    // Set data for drag operation
    e.dataTransfer.setData("text/plain", todo.id)
    e.dataTransfer.effectAllowed = "move"

    // Add a slight delay to make the drag image look better
    setTimeout(() => {
      e.target.classList.add("dragging")
    }, 0)
  }

  // Handle drag end
  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging")
    setDraggedTodo(null)
    setDragOverTodoId(null)
    setIsDragging(false)
    dragCounter.current = 0
  }

  // Handle drag over
  const handleDragOver = (e, todoId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    if (todoId !== dragOverTodoId) {
      setDragOverTodoId(todoId)
    }
  }

  // Handle drag enter
  const handleDragEnter = (e) => {
    e.preventDefault()
    dragCounter.current++
  }

  // Handle drag leave
  const handleDragLeave = (e) => {
    e.preventDefault()
    dragCounter.current--

    if (dragCounter.current === 0) {
      setDragOverTodoId(null)
    }
  }

  // Handle drop
  const handleDrop = (e, targetTodo) => {
    e.preventDefault()

    if (!draggedTodo || draggedTodo.id === targetTodo.id) {
      return
    }

    // Call the reorder function from parent
    reorderTodos(draggedTodo.id, targetTodo.id)

    // Reset states
    setDraggedTodo(null)
    setDragOverTodoId(null)
    dragCounter.current = 0
  }

  // Handle drop on delete zone
  const handleDeleteZoneDrop = (e) => {
    e.preventDefault()

    if (draggedTodo) {
      // If a single todo is being dragged
      removeTodo(draggedTodo.id)
    } else if (selectedTodos.length > 0) {
      // If multiple todos are selected
      selectedTodos.forEach((id) => {
        const todo = todos.find((t) => t.id === id)
        if (todo && !todo.completed) {
          removeTodo(id)
        }
      })
    }

    setDraggedTodo(null)
    setIsDragging(false)
  }

  // Handle drop on done zone
  const handleDoneZoneDrop = (e) => {
    e.preventDefault()

    if (draggedTodo) {
      // If a single todo is being dragged
      changeTodo(
        draggedTodo.id,
        draggedTodo.title,
        draggedTodo.category,
        draggedTodo.priority,
        draggedTodo.dueDate,
        true,
        draggedTodo.elapsedTime || 0,
      )
    } else if (selectedTodos.length > 0) {
      // If multiple todos are selected
      selectedTodos.forEach((id) => {
        const todo = todos.find((t) => t.id === id)
        if (todo && !todo.completed) {
          changeTodo(todo.id, todo.title, todo.category, todo.priority, todo.dueDate, true, todo.elapsedTime || 0)
        }
      })
    }

    setDraggedTodo(null)
    setIsDragging(false)
  }

  // Handle drag over for drop zones
  const handleDropZoneDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  // Use the sortBy prop passed from App.js
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
      draggable={true} // We'll handle the completed check in the TodoShow component
      onDragStart={(e) => handleDragStart(e, todo)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => handleDragOver(e, todo.id)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, todo)}
      isDraggedOver={dragOverTodoId === todo.id}
      isDragging={draggedTodo && draggedTodo.id === todo.id}
    />
  ))

  return (
    <div className="todo-list-container" ref={listRef}>
      {/* Drop zones for delete and done */}
      {showDropZones && (
        <div className="drop-zones">
          <div className="drop-zone delete-zone" onDragOver={handleDropZoneDragOver} onDrop={handleDeleteZoneDrop}>
            <div className="drop-zone-icon">🗑️</div>
            <div className="drop-zone-text">{t("drop_to_delete")}</div>
          </div>
          <div className="drop-zone done-zone" onDragOver={handleDropZoneDragOver} onDrop={handleDoneZoneDrop}>
            <div className="drop-zone-icon">✓</div>
            <div className="drop-zone-text">{t("drop_to_complete")}</div>
          </div>
        </div>
      )}

      {todos.length === 0 ? (
        <div className="no-todos">{t("no_tasks")}</div>
      ) : (
        <ul className="todo-list">{renderedTodos}</ul>
      )}
    </div>
  )
}

export default TodoList
