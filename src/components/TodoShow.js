"use client"

import TodoEdit from "./TodoEdit"
import { useState, useRef, useEffect } from "react"
import EditIcon from "../edit.svg"
import DeleteIcon from "../delete.svg"
import DoneIcon from "../g_check.svg"
import ArchiveIcon from "../archive.svg"
import PlayIcon from "../play.svg"
import PauseIcon from "../pause.svg"

const TodoShow = ({
  todo,
  removeTodo,
  changeTodo,
  archiveTodo,
  isSelected,
  onSelectTodo,
  draggable,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  isDraggedOver,
  isDragging,
}) => {
  const [showEdit, setShowEdit] = useState(false)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(todo.elapsedTime || 0)
  const timerRef = useRef(null)
  const todoRef = useRef(null)

  // Format time as HH:MM:SS
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = timeInSeconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle timer start/stop
  const toggleTimer = () => {
    if (todo.completed) return

    if (isTimerRunning) {
      // Stop timer
      clearInterval(timerRef.current)
      timerRef.current = null
      setIsTimerRunning(false)

      // Save elapsed time to todo
      changeTodo(todo.id, todo.title, todo.category, todo.priority, todo.dueDate, todo.completed, elapsedTime)
    } else {
      // Start timer
      setIsTimerRunning(true)
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Stop timer when todo is completed
  useEffect(() => {
    if (todo.completed && isTimerRunning) {
      clearInterval(timerRef.current)
      timerRef.current = null
      setIsTimerRunning(false)

      // Save final elapsed time
      changeTodo(todo.id, todo.title, todo.category, todo.priority, todo.dueDate, todo.completed, elapsedTime)
    }
  }, [
    todo.completed,
    isTimerRunning,
    elapsedTime,
    changeTodo,
    todo.id,
    todo.title,
    todo.category,
    todo.priority,
    todo.dueDate,
  ])

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

  const handleDelete = () => {
    if (!todo.completed) {
      removeTodo(todo.id)
    }
  }

  const handleEdit = () => {
    if (!todo.completed) {
      setShowEdit(true)
    }
  }

  const handleToggleComplete = () => {
    changeTodo(todo.id, todo.title, todo.category, todo.priority, todo.dueDate, !todo.completed, elapsedTime)
  }

  const handleArchive = () => {
    if (todo.completed && archiveTodo) {
      archiveTodo(todo.id)
    }
  }

  const handleSelect = (e) => {
    if (onSelectTodo) {
      onSelectTodo(todo.id, e.target.checked)
    }
  }

  const handleSubmit = (id, title, category, priority, dueDate) => {
    changeTodo(id, title, category, priority, dueDate, todo.completed, elapsedTime)
    setShowEdit(false)
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

  if (showEdit) {
    return (
      <li className="todo">
        <TodoEdit todo={todo} onSubmit={handleSubmit} />
      </li>
    )
  }

  // Determine the CSS classes for drag and drop
  const todoClasses = `todo ${isDraggedOver ? "drag-over" : ""} ${isDragging ? "dragging" : ""}`

  // Custom drag start handler to fix desktop issues
  const handleDragStart = (e) => {
    if (onDragStart) {
      // Set the drag image to the todo element
      if (todoRef.current) {
        const rect = todoRef.current.getBoundingClientRect()
        e.dataTransfer.setDragImage(todoRef.current, rect.width / 2, rect.height / 2)
      }
      onDragStart(e)
    }
  }

  // Only make non-completed todos draggable
  const isDraggable = draggable && !todo.completed

  return (
    <li
      ref={todoRef}
      className={todoClasses}
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : null}
      onDragEnd={isDraggable ? onDragEnd : null}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="todo-left-controls">
        <div className="todo-select-checkbox">
          {!todo.completed ? (
            <input type="checkbox" checked={isSelected} onChange={handleSelect} aria-label={`Select ${todo.title}`} />
          ) : (
            <div className="checkbox-placeholder" style={{ width: "16px", height: "16px" }}></div>
          )}
        </div>

        <div
          className="drag-handle"
          title={isDraggable ? "Drag to reorder" : ""}
          style={{ visibility: isDraggable ? "visible" : "hidden" }}
        >
          ⋮⋮⋮
        </div>
      </div>

      <div className="task-details">
        <p className={todo.completed ? "completed" : ""}>{todo.title}</p>

        <div className="todo-details-row">
          <p className="priority-box" style={getPriorityStyle(todo.priority)}>
            {todo.priority}
          </p>
          <p className="category">{todo.category}</p>
          <p className="due-date">{formatDueDate(todo.dueDate)}</p>
        </div>

        <div className="actions-row">
          <button
            className="timer-btn"
            onClick={toggleTimer}
            disabled={todo.completed}
            style={{
              backgroundColor: isTimerRunning ? "#ff9800" : "#4caf50",
              opacity: todo.completed ? 0.5 : 1,
            }}
            title={isTimerRunning ? "Pause timer" : "Start timer"}
          >
            {isTimerRunning ? (
              <img
                src={PauseIcon || "/placeholder.svg"}
                alt="Pause"
                title="Pause"
                style={{ opacity: todo.completed ? 0.5 : 1 }}
              />
            ) : (
              <img
                src={PlayIcon || "/placeholder.svg"}
                alt="Play"
                title="Play"
                style={{ opacity: todo.completed ? 0.5 : 1 }}
              />
            )}
          </button>
          <span className="timer-display">{formatTime(elapsedTime)}</span>
          <button className="edit-btn" onClick={handleEdit} disabled={todo.completed}>
            <img
              src={EditIcon || "/placeholder.svg"}
              alt="Edit todo"
              title="Edit"
              style={{ opacity: todo.completed ? 0.5 : 1 }}
            />
          </button>
          <button className="delete-btn" onClick={handleDelete} disabled={todo.completed}>
            <img
              src={DeleteIcon || "/placeholder.svg"}
              alt="Delete todo"
              title="Delete"
              style={{ opacity: todo.completed ? 0.5 : 1 }}
            />
          </button>
          <button className="done-btn" onClick={handleToggleComplete} disabled={todo.completed}>
            <img
              src={DoneIcon || "/placeholder.svg"}
              alt="Done todo"
              title="Done"
              style={{ opacity: todo.completed ? 0.5 : 1 }}
            />
          </button>
          {todo.completed && (
            <button className="archive-btn" onClick={handleArchive}>
              <img src={ArchiveIcon || "/placeholder.svg"} alt="Archive todo" title="Archive" />
            </button>
          )}
        </div>
      </div>
    </li>
  )
}

export default TodoShow
